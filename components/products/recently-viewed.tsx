"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useRecentlyViewedStore } from "@/store/recently-viewed.store";
import { ProductCard } from "./product-card";
import { SectionHeader } from "@/components/home/section-header";

export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const [mounted, setMounted] = useState(false);
  const items = useRecentlyViewedStore((s) => s.items);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const filtered = excludeId ? items.filter((p) => p.id !== excludeId) : items;
  if (filtered.length === 0) return null;

  return (
    <section className="py-12 border-t border-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-5 w-5 text-neutral-400" />
          <SectionHeader
            title="Recently Viewed"
            subtitle="Your History"
            viewAllHref="/products"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
