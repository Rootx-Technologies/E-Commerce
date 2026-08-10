"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/types";

interface FlashSaleSectionProps {
  products: Product[];
  endTime: Date;
}

function useCountdown(endTime: Date) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const update = () => {
      const diff = endTime.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ h: 0, m: 0, s: 0 }); return; }
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [endTime]);
  return timeLeft;
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-neutral-900 text-white text-lg sm:text-xl font-black tabular-nums">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1 text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-neutral-400">
        {label}
      </span>
    </div>
  );
}

export function FlashSaleSection({ products, endTime }: FlashSaleSectionProps) {
  const { h, m, s } = useCountdown(endTime);

  return (
    <section className="bg-neutral-950 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 fill-amber-400" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-amber-400">
                Limited Time
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Flash Sale</h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-0.5">Grab them before they&apos;re gone</p>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <TimeUnit value={h} label="Hrs" />
            <span className="text-xl sm:text-2xl font-black text-neutral-600 mb-4">:</span>
            <TimeUnit value={m} label="Min" />
            <span className="text-xl sm:text-2xl font-black text-neutral-600 mb-4">:</span>
            <TimeUnit value={s} label="Sec" />
          </div>
        </div>

        {/* Products — horizontal scroll on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {products.slice(0, 5).map((product) => (
            <div key={product.id} className="bg-neutral-900 rounded-xl p-2 sm:p-3">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href="/deals" className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors">
            View All Deals <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
