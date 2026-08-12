"use client";

import Link from "next/link";
import Image from "next/image";
import { SectionHeader } from "./section-header";
import type { Category } from "@/types";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [Autoplay({ delay: 3000, stopOnInteraction: true })]
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => { emblaApi.off("select", onSelect); emblaApi.off("reInit", onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <section className="bg-neutral-50 py-10 sm:py-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with nav buttons */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <SectionHeader title="Shop by Category" subtitle="Browse" viewAllHref="/categories" />
          <div className="flex items-center gap-2">
            <button
              onClick={scrollPrev}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-sm transition-all hover:border-amber-400 hover:text-amber-600 hover:shadow-md",
                !canScrollPrev && "opacity-30 cursor-not-allowed"
              )}
              aria-label="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={scrollNext}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-sm transition-all hover:border-amber-400 hover:text-amber-600 hover:shadow-md",
                !canScrollNext && "opacity-30 cursor-not-allowed"
              )}
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Embla Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3 sm:gap-5">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex-none"
                style={{ minWidth: "calc(100% / 4.5)" }}
              >
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl p-2 transition-all duration-300 hover:-translate-y-1.5"
                >
                  {/* Circle image */}
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-white bg-white shadow-[0_8px_24px_rgba(15,23,42,0.10)] ring-2 ring-transparent transition-all duration-300 group-hover:ring-amber-400 group-hover:shadow-[0_12px_32px_rgba(245,158,11,0.22)] sm:h-24 sm:w-24 md:h-28 md:w-28">
                    {category.image ? (
                      <>
                        <div className="absolute inset-0 z-10 rounded-full bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-115"
                          sizes="112px"
                        />
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-2xl">
                        🛍️
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <span className="text-center text-[11px] font-semibold leading-tight text-neutral-700 transition-colors duration-200 group-hover:text-amber-600 sm:text-xs">
                    {category.name}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="mt-6 flex justify-center gap-1.5">
          {categories.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === selectedIndex
                  ? "w-5 bg-amber-500"
                  : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
              )}
              aria-label={`Go to category ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
