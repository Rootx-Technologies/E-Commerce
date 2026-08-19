import type { Metadata } from "next";
import { ProductsClient } from "./products-client";
import { db } from "@/lib/db";
import type { Product, Category, Brand } from "@/types";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our complete collection of premium products.",
};

interface SearchParams {
  search?: string;
  category?: string;
  brand?: string;
  size?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
  filter?: string;
}

interface ProductsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const page = Math.max(1, Number(params.page ?? 1));
  const limit = ITEMS_PER_PAGE;

  // Build where clause
  const where: Record<string, unknown> = { isActive: true };

  if (params.category) {
    const slugs = params.category.split(",");
    where.category = {
      OR: [
        { slug: { in: slugs } },
        { parent: { slug: { in: slugs } } }
      ]
    };
  }
  
  if (params.brand) {
    const slugs = params.brand.split(",");
    where.brand = { slug: { in: slugs } };
  }

  // Handle sizes for server side rendering
  if (params.size) {
    const sizes = params.size.split(",");
    where.variants = {
      some: {
        size: { in: sizes }
      }
    };
  }

  if (params.filter === "new")        where.isNew       = true;
  if (params.filter === "featured")   where.isFeatured  = true;
  if (params.filter === "bestseller") where.isBestSeller = true;
  if (params.filter === "trending")   where.isTrending  = true;

  if (params.minPrice || params.maxPrice) {
    where.price = {
      ...(params.minPrice ? { gte: Number(params.minPrice) } : {}),
      ...(params.maxPrice ? { lte: Number(params.maxPrice) } : {}),
    };
  }

  if (params.search) {
    where.OR = [
      { name:        { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
      { tags:        { has: params.search } },
    ];
  }

  // Build orderBy
  const sort = params.sort ?? "newest";
  const orderBy: Record<string, string> =
    sort === "price_asc"  ? { price: "asc" }
    : sort === "price_desc" ? { price: "desc" }
    : sort === "rating"     ? { rating: "desc" }
    : sort === "popular"    ? { reviewCount: "desc" }
    : { createdAt: "desc" };

  const [total, products, categories, brands] = await Promise.all([
    db.product.count({ where }),
    db.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { images: true, variants: true, category: true, brand: true },
    }),
    db.category.findMany({ orderBy: { name: "asc" }, include: { parent: { select: { id: true, name: true } } } }),
    db.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <ProductsClient
      initialProducts={products as unknown as Product[]}
      categories={categories as unknown as Category[]}
      brands={brands as unknown as Brand[]}
      initialFilters={params as Record<string, string | undefined>}
      total={total}
      currentPage={page}
    />
  );
}
