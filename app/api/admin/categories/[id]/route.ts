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
    const category = await db.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        _count: { select: { products: true } },
      },
    });
    if (!category) {
      return Response.json(
        { success: false, error: "Category not found" } satisfies ApiResponse,
        { status: 404 }
      );
    }
    return Response.json({ success: true, data: category } satisfies ApiResponse);
  } catch (error) {
    console.error("[ADMIN/CATEGORIES/GET/:id]", error);
    return Response.json(
      { success: false, error: "Failed to fetch category" } satisfies ApiResponse,
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
    const { name, slug, image, description, parentId } = body;

    if (slug) {
      const existing = await db.category.findFirst({ where: { slug, NOT: { id } } });
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
    if (image !== undefined) updateData.image = image || null;
    if (description !== undefined) updateData.description = description || null;
    if (parentId !== undefined) updateData.parentId = parentId || null;

    const category = await db.category.update({
      where: { id },
      data: updateData,
      include: { parent: { select: { id: true, name: true } }, _count: { select: { products: true } } },
    });

    return Response.json(
      { success: true, data: category, message: "Category updated" } satisfies ApiResponse
    );
  } catch (error) {
    console.error("[ADMIN/CATEGORIES/PATCH/:id]", error);
    return Response.json(
      { success: false, error: "Failed to update category" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const { id } = await params;

  try {
    const productCount = await db.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return Response.json(
        { success: false, error: `Cannot delete — ${productCount} products use this category` } satisfies ApiResponse,
        { status: 409 }
      );
    }
    await db.category.delete({ where: { id } });
    return Response.json(
      { success: true, message: "Category deleted" } satisfies ApiResponse
    );
  } catch (error) {
    console.error("[ADMIN/CATEGORIES/DELETE/:id]", error);
    return Response.json(
      { success: false, error: "Failed to delete category" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
