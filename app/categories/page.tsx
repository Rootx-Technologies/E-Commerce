import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Grid3X3 } from "lucide-react";
import { db } from "@/lib/db";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Categories",
  description: `Browse all product categories at ${SITE_NAME} — fashion, electronics, footwear, and more.`,
};

export const revalidate = 300;

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  const featured = categories.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-neutral-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">
            Browse
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            All Categories
          </h1>
          <p className="mt-4 text-neutral-400 max-w-xl mx-auto">
            Explore our curated collection across fashion, electronics, lifestyle, and more.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Categories — large cards */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Featured</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {featured.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl h-56 bg-neutral-100"
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg font-bold text-white">{cat.name}</h3>
                  <p className="text-sm text-neutral-300 mt-0.5">
                    {cat._count.products} products
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:gap-2 transition-all">
                    Shop Now <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Categories grid */}
        <div>
          <h2 className="text-xl font-bold text-neutral-900 mb-6">All Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 p-6 hover:border-amber-200 hover:bg-amber-50 transition-all duration-200"
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-white shadow-sm ring-2 ring-transparent group-hover:ring-amber-400 transition-all">
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Grid3X3 className="h-6 w-6 text-neutral-400" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-neutral-900 group-hover:text-amber-700 transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {cat._count.products} items
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
