import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { deleteCachePattern } from "@/lib/redis";
import type { ApiResponse } from "@/types";

// ─── GET /api/admin/products ─────────────────────────────────────────────────
export async function GET(request: NextRequest): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Number(searchParams.get("limit") ?? 20));
    const search = searchParams.get("search") ?? "";
    const categoryId = searchParams.get("categoryId");
    const brandId = searchParams.get("brandId");
    const isActive = searchParams.get("isActive");

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (brandId) where.brandId = brandId;
    if (isActive !== null && isActive !== "") where.isActive = isActive === "true";

    const [total, products] = await Promise.all([
      db.product.count({ where }),
      db.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          images: true,
          variants: true,
          category: true,
          brand: true,
          _count: { select: { reviews: true, orderItems: true } },
        },
      }),
    ]);

    return Response.json({
      success: true,
      data: {
        data: products,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    } satisfies ApiResponse);
  } catch (error) {
    console.error("[ADMIN/PRODUCTS/GET]", error);
    return Response.json(
      { success: false, error: "Failed to fetch products" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

// ─── POST /api/admin/products ────────────────────────────────────────────────
export async function POST(request: NextRequest): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const {
      name, slug, description, price, comparePrice,
      categoryId, brandId, tags, stock,
      isFeatured, isNew, isBestSeller, isTrending, isActive,
      images, variants,
    } = body;

    if (!name || !slug || !description || price == null || !categoryId) {
      return Response.json(
        { success: false, error: "Missing required fields: name, slug, description, price, categoryId" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      return Response.json(
        { success: false, error: "Slug already exists" } satisfies ApiResponse,
        { status: 409 }
      );
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        description,
        price: Number(price),
        comparePrice: comparePrice != null ? Number(comparePrice) : null,
        categoryId,
        brandId: brandId || null,
        tags: tags ?? [],
        stock: Number(stock ?? 0),
        isFeatured: isFeatured ?? false,
        isNew: isNew ?? true,
        isBestSeller: isBestSeller ?? false,
        isTrending: isTrending ?? false,
        isActive: isActive ?? true,
        images: images?.length
          ? { create: images.map((img: { url: string; alt?: string; isPrimary?: boolean }) => ({
              url: img.url,
              alt: img.alt ?? name,
              isPrimary: img.isPrimary ?? false,
            })) }
          : undefined,
        variants: variants?.length
          ? { create: variants.map((v: { size?: string; color?: string; colorHex?: string; stock?: number; price?: number }) => ({
              size: v.size,
              color: v.color,
              colorHex: v.colorHex,
              stock: Number(v.stock ?? 0),
              price: v.price != null ? Number(v.price) : null,
            })) }
          : undefined,
      },
      include: { images: true, variants: true, category: true, brand: true },
    });

    await deleteCachePattern("products:*");

    return Response.json(
      { success: true, data: product, message: "Product created" } satisfies ApiResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error("[ADMIN/PRODUCTS/POST]", error);
    return Response.json(
      { success: false, error: "Failed to create product" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
