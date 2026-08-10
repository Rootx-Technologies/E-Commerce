import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { db } from "@/lib/db";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Brands",
  description: `Shop top international and local brands at ${SITE_NAME}.`,
};

export const revalidate = 300;

const brandColors = [
  "from-blue-50 to-blue-100 border-blue-200",
  "from-amber-50 to-amber-100 border-amber-200",
  "from-emerald-50 to-emerald-100 border-emerald-200",
  "from-violet-50 to-violet-100 border-violet-200",
  "from-rose-50 to-rose-100 border-rose-200",
  "from-cyan-50 to-cyan-100 border-cyan-200",
  "from-orange-50 to-orange-100 border-orange-200",
  "from-teal-50 to-teal-100 border-teal-200",
];

export default async function BrandsPage() {
  const brands = await db.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-neutral-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">
            Official Stores
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Top Brands
          </h1>
          <p className="mt-4 text-neutral-400 max-w-xl mx-auto">
            Authentic products from the world&apos;s most trusted brands, all in one place.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-6 mb-14 rounded-2xl bg-neutral-50 border border-neutral-100 p-8">
          {[
            { value: `${brands.length}+`, label: "Partner Brands" },
            { value: "100%",              label: "Authentic Products" },
            { value: "50K+",              label: "Happy Customers" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-neutral-900">{s.value}</p>
              <p className="text-sm text-neutral-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {brands.map((brand, i) => {
            const colorClass = brandColors[i % brandColors.length];
            return (
              <Link
                key={brand.id}
                href={`/products?brand=${brand.slug}`}
                className={`group relative flex flex-col items-center justify-between gap-4 rounded-2xl border bg-gradient-to-br ${colorClass} p-6 hover:shadow-md transition-all duration-200`}
              >
                <div className="flex h-16 w-full items-center justify-center">
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={120}
                      height={48}
                      className="object-contain h-10 w-auto"
                    />
                  ) : (
                    <span className="text-2xl font-black text-neutral-800 tracking-tight">
                      {brand.name}
                    </span>
                  )}
                </div>
                <div className="w-full text-center">
                  <p className="text-xs text-neutral-500">{brand._count.products} products</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-neutral-700 group-hover:text-amber-700 transition-colors">
                  Shop Brand <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Authenticity badge */}
        <div className="mt-20 rounded-2xl bg-neutral-950 p-10 text-center">
          <Star className="h-8 w-8 text-amber-400 mx-auto mb-4 fill-amber-400" />
          <h2 className="text-2xl font-bold text-white">100% Authentic Guarantee</h2>
          <p className="mt-3 text-neutral-400 max-w-lg mx-auto text-sm leading-relaxed">
            Every product on {SITE_NAME} is sourced directly from authorized distributors and brand
            partners. We guarantee authenticity on every purchase — or your money back.
          </p>
        </div>
      </div>
    </div>
  );
}
