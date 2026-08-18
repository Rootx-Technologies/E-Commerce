"use client";

import Link from "next/link";
import Image from "next/image";
import { SectionHeader } from "./section-header";
import type { Category } from "@/types";

const MAIN_CATEGORY_DATA = [
  { id: "clothing", name: "Clothing", slug: "clothing", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80" },
  { id: "shoes", name: "Shoes", slug: "shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" },
  { id: "bags", name: "Bags", slug: "bags", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80" },
  { id: "accessories", name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" },
  { id: "perfumes", name: "Perfumes", slug: "perfumes", image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80" },
];

interface CategoriesSectionProps {
  categories?: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  // Always ensure only the 5 main categories are shown
  const displayCategories = MAIN_CATEGORY_DATA.map((mainCat) => {
    const dbCat = categories?.find((c) => c.slug.toLowerCase() === mainCat.slug);
    return {
      id: dbCat?.id ?? mainCat.id,
      name: mainCat.name,
      slug: mainCat.slug,
      image: dbCat?.image || mainCat.image,
    };
  });

  return (
    <section className="bg-neutral-50 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Shop by Category" subtitle="Browse" viewAllHref="/categories" />

        {/* 5 Main Categories Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
          {displayCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="group flex flex-col items-center gap-3.5 rounded-2xl p-3 w-full max-w-[200px] transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* Circle Image */}
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-2 ring-neutral-200/60 transition-all duration-300 group-hover:ring-amber-400 group-hover:shadow-[0_16px_36px_rgba(245,158,11,0.25)]">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  sizes="(max-width: 640px) 100px, 128px"
                />
              </div>

              {/* Label */}
              <span className="text-center text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-800 transition-colors duration-200 group-hover:text-amber-600">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
