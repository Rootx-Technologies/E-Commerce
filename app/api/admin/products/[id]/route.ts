import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { deleteCachePattern } from "@/lib/redis";
import type { ApiResponse } from "@/types";

type Params = { params: Promise<{ id: string }> };

// ─── GET /api/admin/products/[id] ────────────────────────────────────────────
export async function GET(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  const { id } = await params;
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: true,
        category: true,
        brand: true,
        reviews: { include: { user: { select: { id: true, name: true, image: true } } }, take: 20 },
        _count: { select: { reviews: true, orderItems: true } },
      },
    });

    if (!product) {
      return Response.json(
        { success: false, error: "Product not found" } satisfies ApiResponse,
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: product } satisfies ApiResponse);
  } catch (error) {
    console.error("[ADMIN/PRODUCTS/GET/:id]", error);
    return Response.json(
      { success: false, error: "Failed to fetch product" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

// ─── PATCH /api/admin/products/[id] ──────────────────────────────────────────
export async function PATCH(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  const { id } = await params;
  try {
    const body = await request.json();
    const {
      name, slug, description, price, comparePrice,
      categoryId, brandId, tags, stock,
      isFeatured, isNew, isBestSeller, isTrending, isActive,
      images, variants,
    } = body;

    // Check slug uniqueness if changing
    if (slug) {
      const existing = await db.product.findFirst({ where: { slug, NOT: { id } } });
      if (existing) {
        return Response.json(
          { success: false, error: "Slug already taken by another product" } satisfies ApiResponse,
          { status: 409 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (comparePrice !== undefined) updateData.comparePrice = comparePrice != null ? Number(comparePrice) : null;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (brandId !== undefined) updateData.brandId = brandId || null;
    if (tags !== undefined) updateData.tags = tags;
    if (stock !== undefined) updateData.stock = Number(stock);
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (isNew !== undefined) updateData.isNew = isNew;
    if (isBestSeller !== undefined) updateData.isBestSeller = isBestSeller;
    if (isTrending !== undefined) updateData.isTrending = isTrending;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Replace images if provided
    if (images !== undefined) {
      await db.productImage.deleteMany({ where: { productId: id } });
      updateData.images = {
        create: images.map((img: { url: string; alt?: string; isPrimary?: boolean }) => ({
          url: img.url,
          alt: img.alt ?? name,
          isPrimary: img.isPrimary ?? false,
        })),
      };
    }

    // Replace variants if provided
    if (variants !== undefined) {
      await db.productVariant.deleteMany({ where: { productId: id } });
      updateData.variants = {
        create: variants.map((v: { size?: string; color?: string; colorHex?: string; stock?: number; price?: number }) => ({
          size: v.size,
          color: v.color,
          colorHex: v.colorHex,
          stock: Number(v.stock ?? 0),
          price: v.price != null ? Number(v.price) : null,
        })),
      };
    }

    const product = await db.product.update({
      where: { id },
      data: updateData,
      include: { images: true, variants: true, category: true, brand: true },
    });

    await deleteCachePattern("products:*");

    return Response.json(
      { success: true, data: product, message: "Product updated" } satisfies ApiResponse
    );
  } catch (error) {
    console.error("[ADMIN/PRODUCTS/PATCH/:id]", error);
    return Response.json(
      { success: false, error: "Failed to update product" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

// ─── DELETE /api/admin/products/[id] ─────────────────────────────────────────
export async function DELETE(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  const { id } = await params;
  try {
    await db.product.delete({ where: { id } });
    await deleteCachePattern("products:*");
    return Response.json(
      { success: true, message: "Product deleted" } satisfies ApiResponse
    );
  } catch (error) {
    console.error("[ADMIN/PRODUCTS/DELETE/:id]", error);
    return Response.json(
      { success: false, error: "Failed to delete product" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
