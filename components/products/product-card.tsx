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
import { Badge } from "@/components/ui/badge";
import { getProductAvailableOptions } from "@/lib/product-variants";
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

  const handleInitialAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn()) {
      toast.error("Please login to add items to your cart", { icon: "🔒", duration: 3000 });
      router.push("/login");
      return;
    }
    if (hasSizes) { setIsSelectingSize(true); return; }
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
        className="flex flex-col flex-1 h-full overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-neutral-200/80 transition-all duration-300 hover:shadow-lg hover:ring-neutral-300 hover:-translate-y-0.5"
      >
        {/* ── Image ── */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-50 flex-shrink-0">
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

          {/* Gradient overlay for text readability at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

          {/* Badges — top left */}
          <div className="absolute left-2 top-2 flex flex-col gap-1 z-10">
            {product.isNew && (
              <span className="inline-flex items-center rounded-md bg-emerald-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm tracking-wide">
                NEW
              </span>
            )}
            {discount && discount > 0 && (
              <span className="inline-flex items-center rounded-md bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
                -{discount}%
              </span>
            )}
          </div>

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px] z-10">
              <span className="rounded-full bg-neutral-800 px-3 py-1 text-[10px] font-semibold text-white tracking-wide">
                Out of Stock
              </span>
            </div>
          )}

          {/* Action buttons — top right, slide in on hover */}
          <div className="absolute right-2 top-2 flex flex-col gap-1.5 z-10">
            <button
              onClick={handleWishlist}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-all duration-200",
                "sm:opacity-0 sm:translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0",
                inWishlist
                  ? "bg-red-500 text-white"
                  : "bg-white/95 text-neutral-600 hover:bg-red-500 hover:text-white"
              )}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("h-3 w-3", inWishlist && "fill-current")} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); openQuickView(product.slug); }}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-md text-neutral-600 transition-all duration-200 hover:bg-neutral-900 hover:text-white",
                "sm:opacity-0 sm:translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 sm:delay-50"
              )}
              aria-label="Quick view"
            >
              <Eye className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault(); e.stopPropagation();
                toggleCompare(product);
                toast.success(isInCompare(product.id) ? "Removed from compare" : "Added to compare!", { duration: 1500 });
              }}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-all duration-200",
                "sm:opacity-0 sm:translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 sm:delay-100",
                isInCompare(product.id)
                  ? "bg-amber-500 text-white"
                  : "bg-white/95 text-neutral-600 hover:bg-amber-500 hover:text-white"
              )}
              aria-label="Compare"
            >
              <GitCompare className="h-3 w-3" />
            </button>
          </div>

          {/* Quick Size/Color overlay */}
          <AnimatePresence>
            {isSelectingSize && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.18 }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                className="absolute inset-x-0 bottom-0 z-20 bg-white/97 backdrop-blur-md p-2.5 border-t border-neutral-200 shadow-lg rounded-b-xl flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                    {sizeType === "shoes" ? "Shoe Size" : "Select Size"}
                  </span>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsSelectingSize(false); }}
                    className="p-0.5 text-neutral-400 hover:text-neutral-700 rounded transition-colors"
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
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedColor(c.name); }}
                          className={`h-3.5 w-3.5 rounded-full transition-all shrink-0 ${
                            selectedColor === c.name ? "ring-1 ring-neutral-900 ring-offset-1 scale-110" : "opacity-75 hover:opacity-100"
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

          {/* Add to cart bar — bottom, appears on hover */}
          {!isSelectingSize && (
            <div className={cn(
              "absolute bottom-0 left-0 right-0 px-2 pb-2 z-10 transition-all duration-200",
              "sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0",
              "opacity-100"
            )}>
              <button
                onClick={handleInitialAddToCart}
                disabled={product.stock === 0}
                className={cn(
                  "flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-semibold transition-all duration-200 shadow-lg",
                  justAdded
                    ? "bg-green-600 text-white"
                    : "bg-neutral-900/92 backdrop-blur-sm text-white hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                {justAdded ? (
                  <><Check className="h-3 w-3 stroke-[3]" /> Added!</>
                ) : (
                  <><ShoppingBag className="h-3 w-3" />{hasSizes ? "Pick Size & Add" : "Add to Cart"}</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── Info ── seamlessly connected to image */}
        <div className="flex flex-col flex-1 justify-between px-2.5 pt-2 pb-2.5">
          {/* Brand + name */}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-400 truncate">
              {product.brand?.name ?? "Exclusive"}
            </p>
            <h3
              className="mt-0.5 text-[13px] font-semibold leading-snug text-neutral-900 line-clamp-2 group-hover:text-amber-600 transition-colors"
              title={product.name}
            >
              {product.name}
            </h3>

            {/* Color swatches preview */}
            {hasColors && colors.length > 0 && (
              <div className="flex items-center gap-1 mt-1">
                {colors.slice(0, 5).map((c) => (
                  <span
                    key={c.name}
                    className="h-2 w-2 rounded-full border border-neutral-200 inline-block"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
                {colors.length > 5 && (
                  <span className="text-[8px] text-neutral-400">+{colors.length - 5}</span>
                )}
              </div>
            )}
          </div>

          {/* Price + rating */}
          <div className="mt-1.5">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm font-extrabold tracking-tight text-neutral-900">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-[11px] text-neutral-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                <span className="text-[11px] font-bold text-neutral-700">
                  {product.rating > 0 ? product.rating.toFixed(1) : "5.0"}
                </span>
                <span className="text-[10px] text-neutral-400">
                  ({product.reviewCount})
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
