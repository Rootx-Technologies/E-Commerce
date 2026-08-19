"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Heart, Star, ChevronLeft, ChevronRight, ExternalLink, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/ui.store";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { getProductAvailableOptions, getColorHex } from "@/lib/product-variants";
import type { Product } from "@/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function QuickViewModal() {
  const { quickViewProductId, closeQuickView, openCart } = useUIStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggleItemWithSync, isInWishlist } = useWishlistStore();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const router = useRouter();

  const { sizes, colors, hasSizes, hasColors, sizeType } = product
    ? getProductAvailableOptions(product)
    : { sizes: [], colors: [], hasSizes: false, hasColors: false, sizeType: "generic" as const };

  // Fetch product when modal opens
  useEffect(() => {
    if (!quickViewProductId) { setProduct(null); setSelectedImage(0); setSelectedSize(null); setSelectedColor(null); setQuantity(1); setSizeError(false); return; }
    setLoading(true);
    fetch(`/api/products/${quickViewProductId}/detail`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setProduct(d.data);
          const opts = getProductAvailableOptions(d.data);
          if (opts.colors.length > 0) setSelectedColor(opts.colors[0].name);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [quickViewProductId]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeQuickView(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closeQuickView]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = quickViewProductId ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [quickViewProductId]);

  const inWishlist = product ? isInWishlist(product.id) : false;
  const discount = product?.comparePrice ? calculateDiscount(product.price, product.comparePrice) : null;

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    if (!isLoggedIn()) {
      toast.error("Please login to add items to your cart", { icon: "🔒" });
      closeQuickView();
      router.push("/login");
      return;
    }

    if (hasSizes && !selectedSize) {
      setSizeError(true);
      toast.error(
        sizeType === "shoes"
          ? "Please select a shoe size"
          : "Please select a size (Small, Medium, Large, Extra Large)",
        { icon: "⚠️" }
      );
      return;
    }

    setSizeError(false);
    addItem(product, quantity, undefined, selectedSize ?? undefined, selectedColor ?? undefined);
    toast.success(
      `Added to cart! ${selectedSize ? `(Size: ${selectedSize})` : ""}${selectedColor ? ` [${selectedColor}]` : ""}`,
      { icon: "🛍️" }
    );
    closeQuickView();
    openCart();
  }, [product, quantity, selectedSize, selectedColor, isLoggedIn, hasSizes, sizeType, addItem, closeQuickView, openCart, router]);

  return (
    <AnimatePresence>
      {quickViewProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeQuickView}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={closeQuickView}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
            >
              <X size={16} />
            </button>

            {loading || !product ? (
              <div className="flex h-80 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                {/* Images */}
                <div className="relative bg-neutral-50 rounded-l-2xl overflow-hidden">
                  <div className="relative aspect-square">
                    <Image
                      src={product.images[selectedImage]?.url ?? product.images[0]?.url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {product.isNew && <Badge variant="new">New</Badge>}
                      {discount && <Badge variant="sale">-{discount}%</Badge>}
                    </div>
                    {/* Image nav */}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImage((i) => Math.max(0, i - 1))}
                          className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow text-neutral-700 hover:bg-white transition-colors"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          onClick={() => setSelectedImage((i) => Math.min(product.images.length - 1, i + 1))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow text-neutral-700 hover:bg-white transition-colors"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </>
                    )}
                  </div>
                  {/* Thumbnails */}
                  {product.images.length > 1 && (
                    <div className="flex gap-2 p-3 justify-center">
                      {product.images.map((img, i) => (
                        <button
                          key={img.id}
                          onClick={() => setSelectedImage(i)}
                          className={`relative h-12 w-12 overflow-hidden rounded-lg border-2 transition-all ${i === selectedImage ? "border-neutral-900" : "border-transparent opacity-60 hover:opacity-100"}`}
                        >
                          <Image src={img.url} alt="" fill className="object-cover" sizes="48px" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6 flex flex-col gap-4">
                  {product.brand && (
                    <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">{product.brand.name}</p>
                  )}
                  <h2 className="text-xl font-bold text-neutral-900 leading-tight">{product.name}</h2>

                  {/* Rating */}
                  {product.reviewCount > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "fill-neutral-200 text-neutral-200"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-neutral-500">({product.reviewCount})</span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-neutral-900">{formatPrice(product.price)}</span>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <span className="text-base text-neutral-400 line-through">{formatPrice(product.comparePrice)}</span>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="flex items-center gap-1.5">
                    <div className={`h-2 w-2 rounded-full ${product.stock > 10 ? "bg-green-500" : product.stock > 0 ? "bg-amber-500" : "bg-red-500"}`} />
                    <span className="text-xs text-neutral-600">
                      {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock"}
                    </span>
                  </div>

                  {/* Sizes */}
                  {hasSizes && (
                    <div className={`rounded-xl p-2.5 transition-colors ${sizeError ? "bg-red-50 border border-red-200" : ""}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-semibold text-neutral-700">
                          {sizeType === "shoes" ? "Shoe Size" : "Size"}
                          {selectedSize && (
                            <span className="ml-1.5 font-bold text-amber-700">
                              ({sizes.find((s) => s.shortLabel === selectedSize)?.label ?? selectedSize})
                            </span>
                          )}
                        </p>
                      </div>
                      {sizeError && (
                        <p className="text-[11px] text-red-600 font-medium mb-1.5 flex items-center gap-1">
                          <AlertCircle size={12} />
                          Please choose a size to continue
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        {sizes.map((sizeOpt) => {
                          const isSelected = selectedSize === sizeOpt.shortLabel;
                          return (
                            <button
                              key={sizeOpt.id}
                              type="button"
                              onClick={() => {
                                setSelectedSize(isSelected ? null : sizeOpt.shortLabel);
                                setSizeError(false);
                              }}
                              className={`h-8 min-w-[2.25rem] px-2.5 rounded-lg border text-xs font-semibold transition-all ${
                                isSelected
                                  ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                                  : sizeError
                                  ? "border-red-300 bg-white text-neutral-800"
                                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-900"
                              }`}
                              title={sizeOpt.label}
                            >
                              {sizeOpt.shortLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Colors */}
                  {hasColors && (
                    <div>
                      <p className="text-xs font-semibold text-neutral-700 mb-1.5">
                        Color: <span className="font-normal text-neutral-600">{selectedColor ?? "Choose"}</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {colors.map((c) => {
                          const isSelected = selectedColor === c.name;
                          const isLight = c.hex.toLowerCase() === "#ffffff" || c.hex.toLowerCase() === "#f8fafc" || c.hex.toLowerCase() === "#f1f5f9";
                          return (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => setSelectedColor(isSelected ? null : c.name)}
                              className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                                isSelected ? "ring-2 ring-neutral-900 ring-offset-1 scale-110" : "hover:scale-105"
                              }`}
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                              aria-label={c.name}
                            >
                              {isSelected && <Check size={12} className={isLight ? "text-neutral-900" : "text-white"} strokeWidth={3} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="flex items-center gap-3">
                    <p className="text-xs font-semibold text-neutral-700">Qty</p>
                    <div className="flex items-center rounded-lg border border-neutral-200">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2.5 py-1.5 hover:bg-neutral-50 transition-colors rounded-l-lg text-sm">−</button>
                      <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-2.5 py-1.5 hover:bg-neutral-50 transition-colors rounded-r-lg text-sm">+</button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <Button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="flex-1 gap-2"
                    >
                      <ShoppingBag size={15} />
                      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                    <button
                      onClick={() => { toggleItemWithSync(product); toast.success(inWishlist ? "Removed from wishlist" : "Saved!"); }}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${inWishlist ? "border-red-200 bg-red-50 text-red-500" : "border-neutral-200 text-neutral-600 hover:border-red-200 hover:text-red-500"}`}
                    >
                      <Heart size={16} className={inWishlist ? "fill-current" : ""} />
                    </button>
                  </div>

                  {/* Full detail link */}
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={closeQuickView}
                    className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    <ExternalLink size={12} />
                    View full details
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
