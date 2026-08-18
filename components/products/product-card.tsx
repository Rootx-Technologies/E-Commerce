"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star, Eye, GitCompare } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn, formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { useCompareStore } from "@/store/compare.store";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItemWithSync, isInWishlist } = useWishlistStore();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const openQuickView = useUIStore((s) => s.openQuickView);
  const { toggleItem: toggleCompare, isInCompare } = useCompareStore();

  useEffect(() => setMounted(true), []);

  const inWishlist = mounted && isInWishlist(product.id);
  const discount = product.comparePrice ? calculateDiscount(product.price, product.comparePrice) : null;
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const secondaryImage = product.images.find((i) => !i.isPrimary) ?? product.images[1];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn()) {
      toast.error("Please login to add items to your cart", {
        icon: "🔒",
        duration: 3000,
      });
      router.push("/login");
      return;
    }
    addItem(product, 1);
    toast.success("Added to cart", { icon: "🛍️", duration: 1800 });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn()) {
      toast.error("Please login to save items to your wishlist", {
        icon: "🔒",
        duration: 3000,
      });
      router.push("/login");
      return;
    }
    toggleItemWithSync(product);
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist", {
      icon: inWishlist ? "💔" : "❤️", duration: 1500,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className={cn("group relative flex flex-col h-full", className)}>
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-col flex-1 h-full overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-neutral-300"
      >
        {/* Image - Full Width Edge-to-Edge */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 flex-shrink-0">
          {primaryImage && (
            <>
              {/* Primary image — fades out on hover */}
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt ?? product.name}
                fill
                className={cn(
                  "object-cover transition-all duration-500 ease-in-out group-hover:scale-105",
                  secondaryImage ? "group-hover:opacity-0" : ""
                )}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={priority}
              />
              {/* Secondary image — fades in on hover */}
              {secondaryImage && (
                <Image
                  src={secondaryImage.url}
                  alt={secondaryImage.alt ?? product.name}
                  fill
                  className="object-cover opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              )}
            </>
          )}

          {/* Badges */}
          <div className="absolute left-2.5 top-2.5 flex flex-col gap-1 z-10">
            {product.isNew && <Badge variant="new" className="text-[9px] px-1.5 py-0.5 shadow-sm">New</Badge>}
            {product.isBestSeller && <Badge variant="default" className="text-[9px] px-1.5 py-0.5 shadow-sm">Best Seller</Badge>}
            {discount && discount > 0 && <Badge variant="sale" className="text-[9px] px-1.5 py-0.5 shadow-sm">-{discount}%</Badge>}
          </div>

          {/* Out of stock */}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-10">
              <span className="rounded-full bg-neutral-900 px-3 py-1 text-[10px] font-semibold text-white">Out of Stock</span>
            </div>
          )}

          {/* Wishlist + Quick View + Compare buttons */}
          <div className="absolute right-2.5 top-2.5 flex flex-col gap-1.5 z-10">
            <button
              onClick={handleWishlist}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full shadow-md transition-all duration-200 sm:h-8.5 sm:w-8.5",
                "sm:opacity-0 sm:translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0",
                inWishlist ? "bg-red-500 text-white" : "bg-white/90 backdrop-blur-sm text-neutral-700 hover:bg-red-500 hover:text-white"
              )}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}>
              <Heart className={cn("h-3.5 w-3.5", inWishlist && "fill-current")} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); openQuickView(product.slug); }}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md text-neutral-700 transition-all duration-200 sm:h-8.5 sm:w-8.5 hover:bg-neutral-900 hover:text-white",
                "sm:opacity-0 sm:translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 sm:delay-75"
              )}
              aria-label="Quick view">
              <Eye className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault(); e.stopPropagation();
                toggleCompare(product);
                toast.success(isInCompare(product.id) ? "Removed from compare" : "Added to compare!", { duration: 1500 });
              }}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full shadow-md transition-all duration-200 sm:h-8.5 sm:w-8.5",
                "sm:opacity-0 sm:translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 sm:delay-150",
                isInCompare(product.id) ? "bg-amber-500 text-white" : "bg-white/90 backdrop-blur-sm text-neutral-700 hover:bg-amber-500 hover:text-white"
              )}
              aria-label="Compare">
              <GitCompare className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Add to cart — hover overlay */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-2.5 transition-all duration-200 z-10",
            "sm:opacity-0 sm:translate-y-3 sm:group-hover:opacity-100 sm:group-hover:translate-y-0",
            "opacity-100"
          )}>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-neutral-900/90 backdrop-blur-sm py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 sm:py-2.5 sm:text-xs">
              <ShoppingBag className="h-3.5 w-3.5" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 justify-between p-3 sm:p-3.5">
          <div className="space-y-0.5">
            <p className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              {product.brand?.name ?? "Exclusive"}
            </p>

            <h3
              className="truncate text-sm font-semibold text-neutral-900 transition-colors group-hover:text-amber-600 sm:text-[15px]"
              title={product.name}
            >
              {product.name}
            </h3>
          </div>

          {/* Price & Rating Section */}
          <div className="mt-2.5 space-y-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-base font-extrabold tracking-tight text-neutral-900 sm:text-[17px]">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-xs text-neutral-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            {product.reviewCount > 0 ? (
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-[12px] font-bold text-neutral-800">
                    {product.rating > 0 ? product.rating.toFixed(1) : "5.0"}
                  </span>
                </div>
                <span className="text-neutral-300">•</span>
                <span className="text-[11px] text-neutral-400">
                  ({product.reviewCount} {product.reviewCount === 1 ? "review" : "reviews"})
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
