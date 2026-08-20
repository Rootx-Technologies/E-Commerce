"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";

// ─── Countdown ────────────────────────────────────────────────────────────────
function useCountdown(endTime: Date) {
  const calc = () => {
    const diff = Math.max(0, endTime.getTime() - Date.now());
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };

  // Start with zeros to match SSR — useEffect sets real values client-side
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    setT(calc()); // immediate correct value on mount
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endTime]);

  return t;
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[36px]">
      <span className="tabular-nums text-[1.9rem] font-black leading-none text-neutral-900 sm:text-[2.4rem]">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-neutral-400 sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

// ─── Promo badges ─────────────────────────────────────────────────────────────
function getPromoBadges(product: Product, discount: number | null) {
  const badges: { label: string; bg: string }[] = [];
  const tags = (product.tags ?? []).map((t) => t.toLowerCase());
  const isBundle = tags.some((t) =>
    ["bundle", "combo", "set", "pack", "2pc", "3pc"].some((k) => t.includes(k))
  );
  if (discount && discount >= 20)
    badges.push({ label: "Crazy Deal", bg: "bg-[#ff6b00]" });
  if (isBundle)
    badges.push({ label: "Bundle Offer", bg: "bg-[#28a745]" });
  if (product.isBestSeller && badges.length < 2)
    badges.push({ label: "Best Seller", bg: "bg-amber-600" });
  if (product.isNew && badges.length < 2)
    badges.push({ label: "New Arrival", bg: "bg-sky-600" });
  return badges.slice(0, 2);
}

// ─── Sale Card ────────────────────────────────────────────────────────────────
function SaleCard({ product, index }: { product: Product; index: number }) {
  const primaryImage =
    product.images?.find((i) => i.isPrimary) ?? product.images?.[0];
  const secondaryImage = product.images?.find((i) => !i.isPrimary);

  const discount = product.comparePrice
    ? calculateDiscount(product.price, product.comparePrice)
    : null;

  const badges = getPromoBadges(product, discount);

  const filledStars = Math.min(
    5,
    Math.round(
      product.rating > 0 ? product.rating : product.reviewCount > 0 ? 5 : 0
    )
  );

  const reviewLabel =
    product.reviewCount === 0
      ? "No Reviews"
      : product.reviewCount === 1
      ? "1 Review"
      : `${product.reviewCount} Reviews`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      className="flex-none w-[240px] sm:w-[265px] lg:w-[285px]"
    >
      <Link href={`/products/${product.slug}`} className="group block">

        {/* ── Image — tall, slight radius like screenshot ── */}
        <div className="relative h-[340px] sm:h-[380px] lg:h-[420px] w-full overflow-hidden rounded-sm bg-neutral-100">
          {primaryImage ? (
            <>
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt ?? product.name}
                fill
                className={cn(
                  "object-cover transition-transform duration-500 group-hover:scale-[1.04]",
                  secondaryImage && "group-hover:opacity-0"
                )}
                sizes="(max-width: 640px) 260px, 310px"
              />
              {secondaryImage && (
                <Image
                  src={secondaryImage.url}
                  alt={secondaryImage.alt ?? product.name}
                  fill
                  className="object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 260px, 310px"
                />
              )}
            </>
          ) : (
            <div className="h-full w-full bg-neutral-200" />
          )}

          {/* SAVE badge — top-left, black, no radius */}
          {discount && discount > 0 && (
            <span className="absolute left-0 top-3 z-10 bg-neutral-950 px-2.5 py-[5px] text-[10px] font-bold uppercase tracking-widest text-white">
              SAVE {discount}%
            </span>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/55 backdrop-blur-[2px]">
              <span className="bg-neutral-800 px-3 py-1 text-[10px] font-semibold text-white">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* ── Text below image — plain, no box ── */}
        <div className="pt-2.5 pb-1">
          {/* Badges */}
          {badges.length > 0 && (
            <div className="mb-1.5 flex flex-wrap gap-1">
              {badges.map((b) => (
                <span
                  key={b.label}
                  className={cn(
                    "inline-flex items-center rounded-[3px] px-1.5 py-[2px] text-[9px] font-bold leading-none text-white",
                    b.bg
                  )}
                >
                  {b.label}
                </span>
              ))}
            </div>
          )}

          {/* Name */}
          <p className="line-clamp-2 text-[13px] font-bold leading-snug text-neutral-900">
            {product.name}
          </p>

          {/* Stars */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <div className="flex items-center gap-px">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-[11px] w-[11px]",
                    i < filledStars
                      ? "fill-amber-400 text-amber-400"
                      : "fill-neutral-200 text-neutral-200"
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] font-medium text-sky-600">
              {reviewLabel}
            </span>
          </div>

          {/* Price */}
          <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
            <span className="text-[13px] font-bold text-neutral-900">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-[11px] text-neutral-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
interface FlashSaleSectionProps {
  products: Product[];
  endTime: Date;
}

export function FlashSaleSection({ products, endTime }: FlashSaleSectionProps) {
  const { d, h, m, s } = useCountdown(endTime);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const SCROLL_BY = 290;

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows, { passive: true });
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -SCROLL_BY, behavior: "smooth" });
  };
  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: SCROLL_BY, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          {/* Left */}
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Shop Before It Ends
            </p>
            <h2 className="text-[1.6rem] font-black leading-tight text-neutral-900 sm:text-[2.1rem]">
              Save Minimum{" "}
              <span className="relative inline-block">
                40%
                <svg
                  aria-hidden
                  viewBox="0 0 64 20"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute -inset-x-1 -bottom-0.5 h-[0.55em] w-[calc(100%+0.5rem)]"
                >
                  <path
                    d="M2 14 Q32 4 62 14"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              on Crazy Deal
            </h2>
            <Link
              href="/deals"
              className="mt-2 inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-600 underline underline-offset-2 hover:text-neutral-900"
            >
              Shop the Sale
            </Link>
          </div>

          {/* Right: countdown */}
          <div className="flex items-end gap-3 sm:gap-5">
            <TimeBlock value={d} label="Days" />
            <span className="mb-5 text-xl font-black text-neutral-300">:</span>
            <TimeBlock value={h} label="Hours" />
            <span className="mb-5 text-xl font-black text-neutral-300">:</span>
            <TimeBlock value={m} label="Minutes" />
            <span className="mb-5 text-xl font-black text-neutral-300">:</span>
            <TimeBlock value={s} label="Seconds" />
          </div>
        </div>

        {/* ── Cards + arrows ── */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={scrollLeft}
            aria-label="Scroll left"
            className={cn(
              "absolute -left-4 top-[180px] z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md border border-neutral-200 text-neutral-700 transition-all hover:bg-neutral-900 hover:text-white hover:border-neutral-900",
              !canLeft && "opacity-0 pointer-events-none"
            )}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Right arrow */}
          <button
            onClick={scrollRight}
            aria-label="Scroll right"
            className={cn(
              "absolute -right-4 top-[180px] z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md border border-neutral-200 text-neutral-700 transition-all hover:bg-neutral-900 hover:text-white hover:border-neutral-900",
              !canRight && "opacity-0 pointer-events-none"
            )}
          >
            <ChevronRight size={18} />
          </button>

          {/* Right edge fade */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

          {/* Scroll container */}
          <div
            ref={scrollRef}
            className="flex gap-1.5 overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product, i) => (
              <SaleCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
