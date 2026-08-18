import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Layers } from "lucide-react";
import { db } from "@/lib/db";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Categories",
  description: `Browse all 5 main categories and subcategories at ${SITE_NAME} — Clothing, Shoes, Bags, Accessories, and Perfumes.`,
};

export const revalidate = 300;

export default async function CategoriesPage() {
  const mainCategories = await db.category.findMany({
    where: { parentId: null },
    orderBy: { createdAt: "asc" },
    include: {
      children: {
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true } } },
      },
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="bg-neutral-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">
            Explore Collections
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            5 Main Categories
          </h1>
          <p className="mt-4 text-neutral-400 max-w-xl mx-auto text-sm sm:text-base">
            Discover our premium range of Clothing, Shoes, Bags, Accessories, and Perfumes.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {mainCategories.map((mainCat) => (
          <div key={mainCat.id} className="rounded-3xl border border-neutral-200/80 bg-neutral-50/50 p-6 sm:p-10 shadow-sm">
            {/* Main Category Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6 mb-8">
              <div className="flex items-center gap-4">
                {mainCat.image && (
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-neutral-200 flex-shrink-0 shadow-sm">
                    <Image
                      src={mainCat.image}
                      alt={mainCat.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                    {mainCat.name}
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1 max-w-md">
                    {mainCat.description || `Browse the latest ${mainCat.name} collection`}
                  </p>
                </div>
              </div>

              <Link
                href={`/products?category=${mainCat.slug}`}
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors shadow-sm"
              >
                Explore All {mainCat.name}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Subcategories Grid */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                {mainCat.name} Subcategories
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mainCat.children.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/products?category=${sub.slug}`}
                    className="group flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4 hover:border-amber-400 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      {sub.image ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-neutral-100 flex-shrink-0">
                          <Image src={sub.image} alt={sub.name} fill className="object-cover" sizes="48px" />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                          {sub.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
                          {sub.name}
                        </h3>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {sub._count.products} products
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
