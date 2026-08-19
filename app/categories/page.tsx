import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Categories",
  description: `Shop Men, Women, Kids & Bags at ${SITE_NAME} — Browse all collections and subcategories.`,
};

export const revalidate = 300;

// Fallback images per category slug
const FALLBACK_IMAGES: Record<string, string> = {
  men: "https://www.exportleftovers.com/cdn/shop/files/anime_5.jpg?v=1784118174&width=720",
  women: "https://www.exportleftovers.com/cdn/shop/files/white_2_03a9b9bb-d15a-4809-b5b3-ca5be0dab7c4.jpg?v=1784377234&width=720",
  kids: "https://www.exportleftovers.com/cdn/shop/files/5_86f257cf-9ae5-4e00-aa6a-5136cd85cdb4.jpg?v=1785424365&width=720",
  bags: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80",
};

const CATEGORY_ACCENT: Record<string, string> = {
  men:   "from-slate-900 to-slate-700",
  women: "from-rose-900 to-rose-700",
  kids:  "from-sky-800 to-sky-600",
  bags:  "from-amber-900 to-amber-700",
};

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
    <div className="min-h-screen bg-neutral-50">

      {/* ── Hero ── */}
      <div className="relative bg-neutral-950 overflow-hidden">
        {/* subtle grid pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 mb-4">
            Browse All Collections
          </p>
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight">
            Shop By Category
          </h1>
          <p className="mt-4 text-neutral-400 text-sm sm:text-base max-w-lg mx-auto">
            Explore our curated collections for Men, Women, Kids &amp; Bags — find exactly what you&apos;re looking for.
          </p>
        </div>
      </div>

      {/* ── Categories ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {mainCategories.map((mainCat) => {
          const coverImage = mainCat.image || FALLBACK_IMAGES[mainCat.slug] || "";
          const accent = CATEGORY_ACCENT[mainCat.slug] ?? "from-neutral-900 to-neutral-700";

          return (
            <section key={mainCat.id}>

              {/* ── Category Banner Card ── */}
              <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${accent} mb-8`}>
                {/* Background image */}
                {coverImage && (
                  <Image
                    src={coverImage}
                    alt={mainCat.name}
                    fill
                    className="object-cover object-center opacity-25"
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                )}

                {/* Content */}
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 sm:p-10">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                      {mainCat._count.products} Products
                    </p>
                    <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                      {mainCat.name}
                    </h2>
                    <p className="text-white/70 mt-2 text-sm max-w-sm">
                      {mainCat.description || `Explore the full ${mainCat.name} collection`}
                    </p>
                  </div>

                  <Link
                    href={`/products?category=${mainCat.slug}`}
                    className="flex-shrink-0 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-neutral-900 hover:bg-neutral-100 transition-colors shadow-lg"
                  >
                    Shop All {mainCat.name}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* ── Subcategories Grid ── */}
              {mainCat.children.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-5">
                    Browse {mainCat.name} by Subcategory
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mainCat.children.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/products?category=${sub.slug}`}
                        className="group relative overflow-hidden rounded-2xl bg-white border border-neutral-200 hover:border-neutral-900 hover:shadow-lg transition-all duration-200"
                      >
                        {/* Sub-image */}
                        <div className="relative h-36 w-full bg-neutral-100 overflow-hidden">
                          {sub.image ? (
                            <Image
                              src={sub.image}
                              alt={sub.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 640px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-neutral-100">
                              <span className="text-4xl font-black text-neutral-200">
                                {sub.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          {/* dark overlay on hover */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                        </div>

                        {/* Sub info */}
                        <div className="flex items-center justify-between p-4">
                          <div>
                            <h3 className="text-sm font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors">
                              {sub.name}
                            </h3>
                            <p className="text-xs text-neutral-400 mt-0.5">
                              {sub._count.products} items
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </section>
          );
        })}
      </div>
    </div>
  );
}
