import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const { id } = await params;

  try {
    const brand = await db.brand.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!brand) {
      return Response.json(
        { success: false, error: "Brand not found" } satisfies ApiResponse,
        { status: 404 }
      );
    }
    return Response.json({ success: true, data: brand } satisfies ApiResponse);
  } catch (error) {
    console.error("[ADMIN/BRANDS/GET/:id]", error);
    return Response.json(
      { success: false, error: "Failed to fetch brand" } satisfies ApiResponse,
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
    const { name, slug, logo } = body;

    if (slug) {
      const existing = await db.brand.findFirst({ where: { slug, NOT: { id } } });
      if (existing) {
        return Response.json(
          { success: false, error: "Slug already taken" } satisfies ApiResponse,
          { status: 409 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (logo !== undefined) updateData.logo = logo || null;

    const brand = await db.brand.update({
      where: { id },
      data: updateData,
      include: { _count: { select: { products: true } } },
    });

    return Response.json(
      { success: true, data: brand, message: "Brand updated" } satisfies ApiResponse
    );
  } catch (error) {
    console.error("[ADMIN/BRANDS/PATCH/:id]", error);
    return Response.json(
      { success: false, error: "Failed to update brand" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const { id } = await params;

  try {
    const productCount = await db.product.count({ where: { brandId: id } });
    if (productCount > 0) {
      return Response.json(
        { success: false, error: `Cannot delete — ${productCount} products use this brand` } satisfies ApiResponse,
        { status: 409 }
      );
    }
    await db.brand.delete({ where: { id } });
    return Response.json({ success: true, message: "Brand deleted" } satisfies ApiResponse);
  } catch (error) {
    console.error("[ADMIN/BRANDS/DELETE/:id]", error);
    return Response.json(
      { success: false, error: "Failed to delete brand" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
