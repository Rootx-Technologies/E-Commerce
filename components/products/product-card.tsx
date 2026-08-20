"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star, Eye, GitCompare, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn, formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { useCompareStore } from "@/store/compare.store";
import { getProductAvailableOptions } from "@/lib/product-variants";
import type { Product } from "@/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

function getPromoBadges(product: Product, discount: number | null) {
  const badges: { label: string; className: string }[] = [];
  const tags = product.tags.map((t) => t.toLowerCase());
  const isBundle = tags.some((t) =>
    ["bundle", "combo", "set", "pack", "2pc", "3pc"].some((k) => t.includes(k))
  );

  if (discount && discount >= 25) {
    badges.push({
      label: "Crazy Deal",
      className: "bg-[#ff6b00] text-white",
    });
  }

  if (isBundle) {
    badges.push({
      label: "Bundle Offer",
      className: "bg-[#28a745] text-white",
    });
  }

  if (product.isBestSeller && badges.length < 2) {
    badges.push({
      label: "Best Seller",
      className: "bg-amber-600 text-white",
    });
  }

  if (product.isNew && badges.length < 2) {
    badges.push({
      label: "New Arrival",
      className: "bg-sky-600 text-white",
    });
  }

  return badges.slice(0, 2);
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);
  const { toggleItemWithSync, isInWishlist } = useWishlistStore();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const openQuickView = useUIStore((s) => s.openQuickView);
  const { toggleItem: toggleCompare, isInCompare } = useCompareStore();

  const { sizes, colors, hasSizes, hasColors, sizeType } = getProductAvailableOptions(product);

  const [isSelectingSize, setIsSelectingSize] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0]?.name ?? null);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => setMounted(true), []);

  const inWishlist = mounted && isInWishlist(product.id);
  const discount = product.comparePrice ? calculateDiscount(product.price, product.comparePrice) : null;
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const secondaryImage = product.images.find((i) => !i.isPrimary) ?? product.images[1];
  const promoBadges = getPromoBadges(product, discount);
  const filledStars = Math.max(0, Math.min(5, Math.round(product.rating > 0 ? product.rating : product.reviewCount > 0 ? 5 : 0)));
  const reviewLabel =
    product.reviewCount === 0
      ? "No Reviews"
      : product.reviewCount === 1
        ? "1 Review"
        : `${product.reviewCount} Reviews`;

  const handleInitialAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn()) {
      toast.error("Please login to add items to your cart", { icon: "🔒", duration: 3000 });
      router.push("/login");
      return;
    }
    if (hasSizes) {
      setIsSelectingSize(true);
      return;
    }
    addItem(product, 1, undefined, undefined, selectedColor ?? undefined);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
    toast.success(`Added to cart!`, { icon: "🛍️", duration: 2000 });
    openCart();
  };

  const handleSelectSizeAndAdd = (sizeStr: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, undefined, sizeStr, selectedColor ?? undefined);
    setIsSelectingSize(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
    toast.success(`Added! Size: ${sizeStr}${selectedColor ? ` · ${selectedColor}` : ""}`, { icon: "🛍️", duration: 2000 });
    openCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn()) {
      toast.error("Please login to save items", { icon: "🔒", duration: 3000 });
      router.push("/login");
      return;
    }
    toggleItemWithSync(product);
    toast.success(inWishlist ? "Removed from wishlist" : "Saved!", { icon: inWishlist ? "💔" : "❤️", duration: 1500 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={cn("group relative flex flex-col h-full", className)}
    >
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-col flex-1 h-full"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-neutral-50 flex-shrink-0">
          {primaryImage && (
            <>
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt ?? product.name}
                fill
                className={cn(
                  "object-cover transition-all duration-500 ease-in-out group-hover:scale-[1.04]",
                  secondaryImage ? "group-hover:opacity-0" : ""
                )}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={priority}
              />
              {secondaryImage && (
                <Image
                  src={secondaryImage.url}
                  alt={secondaryImage.alt ?? product.name}
                  fill
                  className="object-cover opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              )}
            </>
          )}

          {discount && discount > 0 && (
            <span className="absolute left-2.5 top-2.5 z-10 inline-flex items-center rounded-md bg-neutral-950 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              Save {discount}%
            </span>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px] z-10">
              <span className="rounded-full bg-neutral-800 px-3 py-1 text-[10px] font-semibold text-white tracking-wide">
                Out of Stock
              </span>
            </div>
          )}

          <div className="absolute right-2.5 top-2.5 flex flex-col gap-1.5 z-10">
            <button
              onClick={handleWishlist}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full shadow-md transition-all duration-200",
                "sm:opacity-0 sm:translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0",
                inWishlist
                  ? "bg-red-500 text-white"
                  : "bg-white text-neutral-700 hover:bg-red-500 hover:text-white"
              )}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("h-3.5 w-3.5", inWishlist && "fill-current")} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openQuickView(product.slug);
              }}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md text-neutral-700 transition-all duration-200 hover:bg-neutral-900 hover:text-white",
                "sm:opacity-0 sm:translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 sm:delay-50"
              )}
              aria-label="Quick view"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleCompare(product);
                toast.success(isInCompare(product.id) ? "Removed from compare" : "Added to compare!", { duration: 1500 });
              }}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full shadow-md transition-all duration-200",
                "sm:opacity-0 sm:translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 sm:delay-100",
                isInCompare(product.id)
                  ? "bg-amber-500 text-white"
                  : "bg-white text-neutral-700 hover:bg-amber-500 hover:text-white"
              )}
              aria-label="Compare"
            >
              <GitCompare className="h-3.5 w-3.5" />
            </button>
          </div>

          <AnimatePresence>
            {isSelectingSize && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.18 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="absolute inset-x-0 bottom-0 z-20 bg-white/97 backdrop-blur-md p-2.5 border-t border-neutral-200 shadow-lg rounded-b-xl flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                    {sizeType === "shoes" ? "Shoe Size" : "Select Size"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsSelectingSize(false);
                    }}
                    className="p-0.5 text-neutral-400 hover:text-neutral-700 rounded transition-colors"
                    aria-label="Close size picker"
                  >
                    <X size={12} />
                  </button>
                </div>
                {hasColors && colors.length > 1 && (
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-neutral-400 shrink-0">Color:</span>
                    <div className="flex gap-1 overflow-x-auto">
                      {colors.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedColor(c.name);
                          }}
                          className={`h-3.5 w-3.5 rounded-full transition-all shrink-0 ${
                            selectedColor === c.name
                              ? "ring-1 ring-neutral-900 ring-offset-1 scale-110"
                              : "opacity-75 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-5 gap-1">
                  {sizes.map((sizeOpt) => (
                    <button
                      key={sizeOpt.id}
                      type="button"
                      onClick={(e) => handleSelectSizeAndAdd(sizeOpt.shortLabel, e)}
                      className="py-1 rounded-md border border-neutral-200 bg-white text-neutral-800 font-semibold text-[10px] hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors"
                      title={sizeOpt.label}
                    >
                      {sizeOpt.shortLabel}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isSelectingSize && product.stock > 0 && (
            <button
              onClick={handleInitialAddToCart}
              className={cn(
                "absolute bottom-2.5 right-2.5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md transition-all duration-200",
                "hover:scale-105 hover:bg-neutral-950 hover:text-white hover:border-neutral-950",
                justAdded && "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-600 hover:text-white"
              )}
              aria-label={hasSizes ? "Pick size and add to cart" : "Add to cart"}
            >
              {justAdded ? (
                <Check className="h-4 w-4 stroke-[3]" />
              ) : (
                <ShoppingBag className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        <div className="flex flex-col flex-1 pt-2.5 pb-1">
          {promoBadges.length > 0 && (
            <div className="mb-1.5 flex flex-wrap items-center gap-1">
              {promoBadges.map((badge) => (
                <span
                  key={badge.label}
                  className={cn(
                    "inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-bold leading-none",
                    badge.className
                  )}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          )}

          <h3
            className="text-[13px] font-bold leading-snug text-neutral-900 line-clamp-2"
            title={product.name}
          >
            {product.name}
          </h3>

          <div className="mt-1.5 flex items-center gap-1.5">
            <div className="flex items-center gap-px" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < filledStars
                      ? "fill-amber-400 text-amber-400"
                      : "fill-neutral-200 text-neutral-200"
                  )}
                />
              ))}
            </div>
            <span className="text-[11px] font-medium text-sky-600">{reviewLabel}</span>
          </div>

          <div className="mt-auto pt-2 flex items-baseline gap-2 flex-wrap">
            <span className="text-sm font-bold tracking-tight text-neutral-900">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-[12px] text-neutral-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
