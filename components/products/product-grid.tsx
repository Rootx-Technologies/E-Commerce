"use client";

import { ProductCard } from "./product-card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  columns?: 2 | 3 | 4 | 5;
}

const columnClasses = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
};

export function ProductGrid({
  products,
  isLoading = false,
  columns = 4,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={`grid ${columnClasses[columns]} gap-3 sm:gap-4`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[4/5] w-full rounded-xl" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-neutral-900">No products found</p>
        <p className="mt-1 text-sm text-neutral-500">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
      <div className={`grid ${columnClasses[columns]} gap-3 sm:gap-4 items-stretch`}>
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.03 }}
          className="h-full"
        >
          <ProductCard
            product={product}
            priority={index < 4}
            className="h-full"
          />
        </motion.div>
      ))}
    </div>
  );
}
