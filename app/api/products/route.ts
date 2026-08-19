import { NextRequest } from "next/server";
import type { ApiResponse, PaginatedResponse, Product } from "@/types";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Number(searchParams.get("limit") ?? ITEMS_PER_PAGE));
    const categoryParam = searchParams.get("category");
    const brandParam = searchParams.get("brand");
    const sizeParam = searchParams.get("size");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") ?? "newest";
    const filter = searchParams.get("filter");

    const { db } = await import("@/lib/db");
    const { getCache, setCache } = await import("@/lib/redis");

    const cacheKey = `products:${JSON.stringify({ page, limit, category: categoryParam, brand: brandParam, size: sizeParam, search, minPrice, maxPrice, sort, filter })}`;
    const cached = await getCache<PaginatedResponse<Product>>(cacheKey);
    if (cached) {
      return Response.json({ success: true, data: cached } satisfies ApiResponse<PaginatedResponse<Product>>);
    }

    const where: Record<string, unknown> = { isActive: true };

    if (categoryParam) {
      const slugs = categoryParam.split(",");
      where.category = {
        OR: [
          { slug: { in: slugs } },
          { parent: { slug: { in: slugs } } }
        ]
      };
    }
    
    if (brandParam) {
      const slugs = brandParam.split(",");
      where.brand = { slug: { in: slugs } };
    }
    
    if (sizeParam) {
      const sizes = sizeParam.split(",");
      where.variants = {
        some: {
          size: { in: sizes }
        }
      };
    }

    if (filter === "new") where.isNew = true;
    if (filter === "featured") where.isFeatured = true;
    if (filter === "bestseller") where.isBestSeller = true;
    if (filter === "trending") where.isTrending = true;
    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice ? { gte: Number(minPrice) } : {}),
        ...(maxPrice ? { lte: Number(maxPrice) } : {}),
      };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    const orderBy: Record<string, string> =
      sort === "price_asc" ? { price: "asc" }
      : sort === "price_desc" ? { price: "desc" }
      : sort === "rating" ? { rating: "desc" }
      : sort === "popular" ? { reviewCount: "desc" }
      : { createdAt: "desc" };

    const [total, products] = await Promise.all([
      db.product.count({ where }),
      db.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: true,
          variants: true,
          category: true,
          brand: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const result: PaginatedResponse<Product> = {
      data: products as unknown as Product[],
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    await setCache(cacheKey, result, 300);

    return Response.json({ success: true, data: result } satisfies ApiResponse<PaginatedResponse<Product>>);
  } catch (error) {
    console.error("[PRODUCTS/GET]", error);
    return Response.json(
      { success: false, error: "Failed to fetch products" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
