import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import type { ApiResponse } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const { id } = await params;

  try {
    const banner = await db.banner.findUnique({ where: { id } });
    if (!banner) {
      return Response.json(
        { success: false, error: "Banner not found" } satisfies ApiResponse,
        { status: 404 }
      );
    }
    return Response.json({ success: true, data: banner } satisfies ApiResponse);
  } catch (error) {
    console.error("[ADMIN/BANNERS/GET/:id]", error);
    return Response.json(
      { success: false, error: "Failed to fetch banner" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const { id } = await params;

  try {
    const body = await request.json();
    const { title, subtitle, brandName, type, imageBase64, imageUrl, link, isActive, position } = body;

    const existing = await db.banner.findUnique({ where: { id } });
    if (!existing) {
      return Response.json(
        { success: false, error: "Banner not found" } satisfies ApiResponse,
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (type !== undefined) updateData.type = type;
    if (title !== undefined) updateData.title = title;
    if (brandName !== undefined) updateData.brandName = brandName || null;
    if (subtitle !== undefined) updateData.subtitle = subtitle || null;
    if (link !== undefined) updateData.link = link || null;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (position !== undefined) updateData.position = Number(position);

    // Replace image if new one provided
    if (imageBase64) {
      // Delete old Cloudinary image
      if (existing.publicId) {
        try { await deleteImage(existing.publicId); } catch { /* ignore */ }
      }
      const uploaded = await uploadImage(imageBase64, "faizan/banners");
      updateData.image = uploaded.url;
      updateData.publicId = uploaded.publicId;
    } else if (imageUrl !== undefined) {
      updateData.image = imageUrl;
    }

    const banner = await db.banner.update({ where: { id }, data: updateData });
    return Response.json(
      { success: true, data: banner, message: "Banner updated" } satisfies ApiResponse
    );
  } catch (error) {
    console.error("[ADMIN/BANNERS/PATCH/:id]", error);
    return Response.json(
      { success: false, error: "Failed to update banner" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const { id } = await params;

  try {
    const banner = await db.banner.findUnique({ where: { id } });
    if (banner?.publicId) {
      try { await deleteImage(banner.publicId); } catch { /* ignore */ }
    }
    await db.banner.delete({ where: { id } });
    return Response.json({ success: true, message: "Banner deleted" } satisfies ApiResponse);
  } catch (error) {
    console.error("[ADMIN/BANNERS/DELETE/:id]", error);
    return Response.json(
      { success: false, error: "Failed to delete banner" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
