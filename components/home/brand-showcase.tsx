import { SectionHeader } from "./section-header";
import type { Brand } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface BrandShowcaseProps {
  brands: Brand[];
}

export function BrandShowcase({ brands }: BrandShowcaseProps) {
  return (
    <section className="py-12 border-y border-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Top Brands"
          subtitle="Featured"
          viewAllHref="/brands"
          centered
        />
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/products?brand=${brand.slug}`}
              className="group flex items-center justify-center h-12 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-200"
            >
              {brand.logo ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={120}
                  height={48}
                  className="object-contain h-10 w-auto"
                />
              ) : (
                <span className="text-lg font-bold text-neutral-400 group-hover:text-neutral-900 transition-colors">
                  {brand.name}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
