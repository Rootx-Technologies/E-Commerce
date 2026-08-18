"use client";

import Link from "next/link";
import Image from "next/image";
import { SectionHeader } from "./section-header";
import type { Brand } from "@/types";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandShowcaseProps {
  brands: Brand[];
}

export function BrandShowcase({ brands }: BrandShowcaseProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [Autoplay({ delay: 2500, stopOnInteraction: true })]
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
    <section className="py-12 border-y border-neutral-100 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with nav buttons */}
        <div className="flex items-center justify-between mb-8">
          <SectionHeader title="Top Brands" subtitle="Featured" viewAllHref="/brands" />
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
          <div className="flex items-center gap-4 sm:gap-8">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="flex-none"
                style={{ minWidth: "calc(100% / 5.5)" }}
              >
                <Link
                  href={`/products?brand=${brand.slug}`}
                  className="group flex items-center justify-center h-14 px-4 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300"
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
                    <span className="text-base font-bold text-neutral-400 group-hover:text-neutral-900 transition-colors whitespace-nowrap">
                      {brand.name}
                    </span>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="mt-6 flex justify-center gap-1.5">
          {brands.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === selectedIndex
                  ? "w-5 bg-amber-500"
                  : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
              )}
              aria-label={`Go to brand ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
