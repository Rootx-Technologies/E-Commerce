import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { uploadImage } from "@/lib/cloudinary";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const banners = await db.banner.findMany({ orderBy: { position: "asc" } });
    return Response.json({ success: true, data: banners } satisfies ApiResponse);
  } catch (error) {
    console.error("[ADMIN/BANNERS/GET]", error);
    return Response.json(
      { success: false, error: "Failed to fetch banners" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const { title, subtitle, brandName, type, imageBase64, imageUrl, link, isActive, position } = body;

    if (!title) {
      return Response.json(
        { success: false, error: "Title is required" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    let finalImageUrl = imageUrl ?? "";
    let publicId: string | null = null;

    // Upload to Cloudinary if base64 image provided
    if (imageBase64) {
      const uploaded = await uploadImage(imageBase64, "marqet/banners");
      finalImageUrl = uploaded.url;
      publicId = uploaded.publicId;
    }

    if (!finalImageUrl) {
      return Response.json(
        { success: false, error: "Image is required (provide imageBase64 or imageUrl)" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Auto-assign position if not provided
    let finalPosition = position;
    if (finalPosition == null) {
      const last = await db.banner.findFirst({ orderBy: { position: "desc" } });
      finalPosition = (last?.position ?? 0) + 1;
    }

    const banner = await db.banner.create({
      data: {
        type: type ?? "HERO",
        title,
        brandName: brandName || null,
        subtitle: subtitle || null,
        image: finalImageUrl,
        publicId,
        link: link || null,
        isActive: isActive ?? true,
        position: Number(finalPosition),
      },
    });

    return Response.json(
      { success: true, data: banner, message: "Banner created" } satisfies ApiResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error("[ADMIN/BANNERS/POST]", error);
    return Response.json(
      { success: false, error: "Failed to create banner" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
