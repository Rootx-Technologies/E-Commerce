import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import type { ApiResponse } from "@/types";

// POST /api/admin/upload — upload image to Cloudinary
export async function POST(request: NextRequest): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "marqet";

    if (!file) {
      return Response.json(
        { success: false, error: "No file provided" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { success: false, error: "Invalid file type. Only JPG, PNG, WebP and GIF allowed." } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return Response.json(
        { success: false, error: "File too large. Maximum size is 5MB." } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await uploadImage(base64, folder);

    return Response.json(
      {
        success: true,
        data: { url: result.url, publicId: result.publicId },
        message: "Image uploaded successfully",
      } satisfies ApiResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error("[ADMIN/UPLOAD]", error);
    return Response.json(
      { success: false, error: "Upload failed. Please try again." } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

// DELETE /api/admin/upload — delete image from Cloudinary
export async function DELETE(request: NextRequest): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const { publicId } = await request.json();
    if (!publicId) {
      return Response.json(
        { success: false, error: "publicId is required" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    await deleteImage(publicId);
    return Response.json(
      { success: true, message: "Image deleted" } satisfies ApiResponse
    );
  } catch (error) {
    console.error("[ADMIN/UPLOAD/DELETE]", error);
    return Response.json(
      { success: false, error: "Failed to delete image" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
