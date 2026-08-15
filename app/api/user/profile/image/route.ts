import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { signUserToken, makeUserCookie } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest): Promise<Response> {
  const auth = await requireUser(request);
  if (auth instanceof Response) return auth;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json(
        { success: false, error: "No file provided" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { success: false, error: "Only JPG, PNG and WebP allowed" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    if (file.size > 3 * 1024 * 1024) {
      return Response.json(
        { success: false, error: "File too large. Max 3MB." } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Convert to base64
    const bytes = await file.arrayBuffer();
    const base64 = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;

    // Upload to Cloudinary
    const { url } = await uploadImage(base64, "marqet/avatars");

    // Update user image in DB
    const updated = await db.user.update({
      where: { id: auth.userId },
      data: { image: url },
      select: { id: true, name: true, email: true, image: true, role: true, credits: true, emailVerified: true, createdAt: true },
    });

    // Re-issue token with new image
    const newToken = await signUserToken({
      userId: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role as "USER" | "ADMIN",
      image: updated.image,
    });

    const response = Response.json(
      {
        success: true,
        data: { user: updated, token: newToken },
        message: "Profile picture updated!",
      } satisfies ApiResponse
    );
    response.headers.set("Set-Cookie", makeUserCookie(newToken));
    return response;
  } catch (error) {
    console.error("[USER/PROFILE/IMAGE]", error);
    return Response.json(
      { success: false, error: "Upload failed. Try again." } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
