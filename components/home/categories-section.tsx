import Link from "next/link";
import Image from "next/image";
import { SectionHeader } from "./section-header";
import type { Category } from "@/types";

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="bg-neutral-50 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Shop by Category" subtitle="Browse" viewAllHref="/categories" centered />

        <div className="mt-6 grid grid-cols-3 gap-3 sm:mt-8 sm:gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl p-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white bg-white shadow-[0_12px_25px_rgba(15,23,42,0.08)] ring-2 ring-transparent transition-all duration-300 group-hover:ring-amber-300 group-hover:shadow-[0_18px_40px_rgba(245,158,11,0.18)] sm:h-20 sm:w-20 md:h-24 md:w-24">
                {category.image ? (
                  <>
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-all duration-500 ease-out group-hover:scale-125"
                      sizes="80px"
                    />
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-xl transition-transform duration-500 group-hover:scale-110">🛍️</div>
                )}
              </div>

              <span className="text-center text-[10px] font-semibold leading-tight text-neutral-700 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-amber-600 sm:text-xs">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
