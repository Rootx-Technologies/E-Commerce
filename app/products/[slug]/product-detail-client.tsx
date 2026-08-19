"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, Share2, ChevronRight, Minus, Plus, Star, Shield, Truck, RefreshCw, CheckCircle, Loader2, GitCompare, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { useRecentlyViewedStore } from "@/store/recently-viewed.store";
import { useCompareStore } from "@/store/compare.store";
import { SizeGuide } from "@/components/products/size-guide";
import { StockAlert } from "@/components/products/stock-alert";
import { formatPrice, calculateDiscount, getInitials } from "@/lib/utils";
import { getProductAvailableOptions, getColorHex } from "@/lib/product-variants";
import type { Product } from "@/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Review {
  id: string;
  rating: number;
  title?: string | null;
  body: string;
  isVerified: boolean;
  createdAt: string;
  user: { id: string; name: string; image?: string | null };
}

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { sizes, colors, hasSizes, hasColors, sizeType } = getProductAvailableOptions(product);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0]?.name ?? null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewsFetched, setReviewsFetched] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);
  const { toggleItemWithSync, isInWishlist } = useWishlistStore();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const user = useAuthStore((s) => s.user);
  const addToRecentlyViewed = useRecentlyViewedStore((s) => s.addItem);
  const { toggleItem: toggleCompare, isInCompare } = useCompareStore();
  const inCompare = isInCompare(product.id);
  const router = useRouter();
  const inWishlist = isInWishlist(product.id);

  // Track this product as recently viewed
  useEffect(() => {
    addToRecentlyViewed(product as unknown as import("@/types").Product);
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchReviews = useCallback(async () => {
    if (reviewsFetched) return;
    setReviewsLoading(true);
    try {
      const res = await fetch(`/api/products/${product.slug}/reviews`);
      const data = await res.json();
      if (data.success) setReviews(data.data as Review[]);
    } catch { /* silent */ } finally {
      setReviewsLoading(false);
      setReviewsFetched(true);
    }
  }, [product.slug, reviewsFetched]);

  useEffect(() => {
    if (activeTab === "reviews") fetchReviews();
  }, [activeTab, fetchReviews]);

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn()) {
      toast.error("Please login to submit a review", { icon: "🔒" });
      router.push("/login");
      return;
    }
    if (!reviewBody.trim()) { toast.error("Please write a review"); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${product.slug}/reviews`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: reviewRating, title: reviewTitle, body: reviewBody }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Review submitted!");
        setReviews((prev) => [data.data as Review, ...prev]);
        setReviewTitle(""); setReviewBody(""); setReviewRating(5);
      } else {
        toast.error(data.error ?? "Failed to submit review");
      }
    } catch { toast.error("Something went wrong"); }
    finally { setSubmitting(false); }
  }

  const discount = product.comparePrice
    ? calculateDiscount(product.price, product.comparePrice)
    : null;

  const handleAddToCart = () => {
    if (!isLoggedIn()) {
      toast.error("Please login to add items to your cart", { icon: "🔒", duration: 3000 });
      router.push("/login");
      return;
    }

    if (hasSizes && !selectedSize) {
      setSizeError(true);
      toast.error(
        sizeType === "shoes"
          ? "Please select a shoe size before adding to cart"
          : "Please select a size (Small, Medium, Large, Extra Large) before adding to cart",
        { icon: "⚠️", duration: 3500 }
      );
      return;
    }

    setSizeError(false);
    addItem(product, quantity, undefined, selectedSize ?? undefined, selectedColor ?? undefined);
    toast.success(
      `Added to cart! ${selectedSize ? `(Size: ${selectedSize})` : ""}${selectedColor ? ` [${selectedColor}]` : ""}`,
      { icon: "🛍️", duration: 2500 }
    );
    openCart();
  };

  const handleBuyNow = () => {
    if (!isLoggedIn()) {
      toast.error("Please login to continue", { icon: "🔒", duration: 3000 });
      router.push("/login");
      return;
    }
    if (hasSizes && !selectedSize) {
      setSizeError(true);
      toast.error(
        sizeType === "shoes"
          ? "Please select a shoe size before proceeding to checkout"
          : "Please select a size (Small, Medium, Large, Extra Large) before proceeding to checkout",
        { icon: "⚠️", duration: 3500 }
      );
      return;
    }
    setSizeError(false);
    addItem(product, quantity, undefined, selectedSize ?? undefined, selectedColor ?? undefined);
    router.push("/checkout");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-neutral-900 transition-colors">Products</Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/products?category=${product.category.slug}`}
          className="hover:text-neutral-900 transition-colors"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-neutral-900 font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div
            className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            {product.images[selectedImage] && (
              <Image
                src={product.images[selectedImage].url}
                alt={product.images[selectedImage].alt ?? product.name}
                fill
                className="object-cover transition-transform duration-300"
                style={
                  isZoomed
                    ? {
                        transform: "scale(2)",
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      }
                    : {}
                }
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && <Badge variant="new">New</Badge>}
              {discount && <Badge variant="sale">-{discount}%</Badge>}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === i
                      ? "border-neutral-900"
                      : "border-transparent hover:border-neutral-300"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand & Name */}
          {product.brand && (
            <Link
              href={`/products?brand=${product.brand.slug}`}
              className="text-sm font-semibold uppercase tracking-widest text-amber-600 hover:text-amber-700 transition-colors"
            >
              {product.brand.name}
            </Link>
          )}
          <h1 className="text-3xl font-bold text-neutral-900 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <StarRating
            rating={product.rating}
            reviewCount={product.reviewCount}
            size="md"
          />

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-black text-neutral-900">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <>
                <span className="text-xl text-neutral-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
                <Badge variant="sale" className="text-sm px-3 py-1">
                  Save {discount}%
                </Badge>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                product.stock > 10
                  ? "bg-green-500"
                  : product.stock > 0
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
            />
            <span className="text-sm text-neutral-600">
              {product.stock > 10
                ? "In Stock"
                : product.stock > 0
                ? `Only ${product.stock} left`
                : "Out of Stock"}
            </span>
          </div>

          <Separator />

          {/* Sizes */}
          {hasSizes && (
            <div className={`rounded-xl p-3 transition-colors ${sizeError ? "bg-red-50/80 border border-red-200" : ""}`}>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-neutral-900">
                    {sizeType === "shoes" ? "Shoe Size" : "Select Size"}
                  </h3>
                  {selectedSize && (
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                      {sizes.find((s) => s.shortLabel === selectedSize)?.label ?? selectedSize}
                    </span>
                  )}
                </div>
                <SizeGuide type={sizeType === "shoes" ? "shoes" : "clothing"} />
              </div>

              {sizeError && (
                <p className="text-xs text-red-600 font-medium mb-2.5 flex items-center gap-1">
                  <AlertCircle size={13} />
                  Please choose a {sizeType === "shoes" ? "shoe size" : "size (Small, Medium, Large, Extra Large)"} to continue
                </p>
              )}

              <div className="flex flex-wrap gap-2">
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
                      className={`group relative flex flex-col items-center justify-center min-w-[3.25rem] px-3.5 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                        isSelected
                          ? "border-neutral-900 bg-neutral-900 text-white shadow-md scale-105"
                          : sizeError
                          ? "border-red-300 bg-white text-neutral-800 hover:border-neutral-900"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 shadow-2xs"
                      }`}
                      title={sizeOpt.label}
                    >
                      <span className="text-sm tracking-tight">{sizeOpt.shortLabel}</span>
                      {sizeOpt.label !== sizeOpt.shortLabel && (
                        <span className={`text-[10px] font-normal leading-none mt-0.5 opacity-80 ${isSelected ? "text-neutral-200" : "text-neutral-400"}`}>
                          {sizeOpt.label.length > 12 ? sizeOpt.label.split("(")[0].trim() : sizeOpt.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Colors */}
          {hasColors && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-sm font-semibold text-neutral-900">
                  Color: <span className="font-normal text-neutral-600">{selectedColor ?? "Choose a color"}</span>
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {colors.map((c) => {
                  const isSelected = selectedColor === c.name;
                  const isLight = c.hex.toLowerCase() === "#ffffff" || c.hex.toLowerCase() === "#f8fafc" || c.hex.toLowerCase() === "#f1f5f9";
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(isSelected ? null : c.name)}
                      className={`group relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
                        isSelected
                          ? "ring-2 ring-neutral-900 ring-offset-2 scale-110 shadow-sm"
                          : "hover:scale-105 hover:ring-1 hover:ring-neutral-400 hover:ring-offset-1"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      aria-label={c.name}
                      title={c.name}
                    >
                      {/* Checkmark icon on active */}
                      {isSelected && (
                        <Check size={14} className={isLight ? "text-neutral-900" : "text-white"} strokeWidth={3} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active selection summary chip */}
          {(selectedSize || selectedColor) && (
            <div className="flex items-center gap-2 flex-wrap rounded-xl bg-neutral-50/90 border border-neutral-200/80 px-3.5 py-2 text-xs text-neutral-700">
              <span className="font-semibold text-neutral-900 text-[11px] uppercase tracking-wide">Selected:</span>
              {selectedSize && (
                <span className="inline-flex items-center gap-1 rounded-md bg-white border border-neutral-200 px-2 py-0.5 font-medium text-neutral-800 shadow-2xs">
                  Size: <strong>{selectedSize}</strong>
                </span>
              )}
              {selectedColor && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-white border border-neutral-200 px-2 py-0.5 font-medium text-neutral-800 shadow-2xs">
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-neutral-300 inline-block"
                    style={{ backgroundColor: getColorHex(selectedColor) }}
                  />
                  Color: <strong>{selectedColor}</strong>
                </span>
              )}
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Quantity</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-md border border-neutral-300">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-neutral-100 transition-colors rounded-l-md"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-sm font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="p-2.5 hover:bg-neutral-100 transition-colors rounded-r-md"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-neutral-500">
                {product.stock} available
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="gold"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1"
            >
              Buy Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                if (!isLoggedIn()) {
                  toast.error("Please login to save items to your wishlist", { icon: "🔒", duration: 3000 });
                  router.push("/login");
                  return;
                }
                toggleItemWithSync(product);
                toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
              }}
              className={inWishlist ? "text-red-500 border-red-200 hover:bg-red-50" : ""}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
            </Button>
          </div>

          {/* Stock alert for out of stock */}
          {product.stock === 0 && (
            <StockAlert productId={product.id} productName={product.name} />
          )}

          {/* Compare button */}
          <button
            onClick={() => {
              toggleCompare(product as unknown as import("@/types").Product);
              toast.success(inCompare ? "Removed from compare" : "Added to compare! Click compare bar below.");
            }}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${inCompare ? "text-amber-600" : "text-neutral-500 hover:text-neutral-900"}`}
          >
            <GitCompare size={15} />
            {inCompare ? "Remove from Compare" : "Add to Compare"}
          </button>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Truck, text: "Free shipping over ₨5,000" },
              { icon: Shield, text: "Secure payment" },
              { icon: RefreshCw, text: "30-day returns" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex flex-col items-center gap-1.5 rounded-lg bg-neutral-50 p-3 text-center"
              >
                <Icon className="h-5 w-5 text-amber-600" />
                <span className="text-[11px] text-neutral-600 leading-tight">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <div className="flex border-b border-neutral-200">
          {(["description", "specs", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {tab === "reviews" ? `Reviews (${product.reviewCount})` : tab}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === "description" && (
            <div className="prose prose-neutral max-w-none">
              <p className="text-neutral-600 leading-relaxed">{product.description}</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-neutral-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Premium quality materials
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Carefully crafted for durability
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Authentic brand product
                </li>
              </ul>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              {[
                { label: "Category", value: product.category.name },
                { label: "Brand", value: product.brand?.name ?? "N/A" },
                { label: "SKU", value: product.id.slice(0, 8).toUpperCase() },
                { label: "Stock", value: `${product.stock} units` },
                { label: "Tags", value: product.tags.join(", ") },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3 py-3 border-b border-neutral-100">
                  <span className="text-sm font-medium text-neutral-500 w-24 flex-shrink-0">
                    {label}
                  </span>
                  <span className="text-sm text-neutral-900">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6 max-w-2xl">
              {/* Rating summary */}
              <div className="flex items-center gap-6 p-6 rounded-xl bg-neutral-50">
                <div className="text-center">
                  <p className="text-5xl font-black text-neutral-900">{product.rating.toFixed(1)}</p>
                  <StarRating rating={product.rating} showCount={false} size="sm" />
                  <p className="text-xs text-neutral-500 mt-1">{reviews.length} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews.filter((r) => r.rating === star).length;
                    const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500 w-4">{star}</span>
                        <div className="flex-1 h-2 rounded-full bg-neutral-200 overflow-hidden">
                          <div className="h-full rounded-full bg-amber-400 transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-neutral-400 w-6">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit review form */}
              <div className="rounded-xl border border-neutral-200 p-5">
                <h3 className="font-semibold text-neutral-900 mb-4">Write a Review</h3>
                {!isLoggedIn() ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-neutral-500 mb-3">Login to submit a review</p>
                    <Link href="/login"><Button size="sm" variant="outline">Sign In</Button></Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {/* Star picker */}
                    <div>
                      <label className="text-sm font-medium text-neutral-700 mb-2 block">Your Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => setReviewRating(star)}
                            className="transition-transform hover:scale-110">
                            <Star className={`h-7 w-7 ${star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-neutral-300"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700 mb-1 block">Title (optional)</label>
                      <input value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="Summarize your experience"
                        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700 mb-1 block">Review <span className="text-red-500">*</span></label>
                      <textarea value={reviewBody} onChange={(e) => setReviewBody(e.target.value)}
                        rows={3} placeholder="Share your experience with this product..."
                        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 resize-none"
                      />
                    </div>
                    <Button type="submit" disabled={submitting} size="sm" className="gap-2">
                      {submitting && <Loader2 size={14} className="animate-spin" />}
                      {submitting ? "Submitting..." : "Submit Review"}
                    </Button>
                  </form>
                )}
              </div>

              {/* Reviews list */}
              {reviewsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                </div>
              ) : reviews.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-6">
                  No reviews yet — be the first to review this product!
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-xl border border-neutral-100 p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white text-xs font-bold">
                          {review.user.image
                            ? <img src={review.user.image} alt={review.user.name} className="h-full w-full rounded-full object-cover" />
                            : getInitials(review.user.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-neutral-900">{review.user.name}</p>
                            {review.isVerified && (
                              <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                <CheckCircle size={11} className="fill-green-600 text-white" /> Verified Purchase
                              </span>
                            )}
                            <span className="text-xs text-neutral-400 ml-auto">
                              {new Date(review.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <div className="flex mt-1 mb-2">
                            {[1,2,3,4,5].map((s) => (
                              <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? "text-amber-400 fill-amber-400" : "text-neutral-200"}`} />
                            ))}
                          </div>
                          {review.title && <p className="text-sm font-medium text-neutral-800 mb-1">{review.title}</p>}
                          <p className="text-sm text-neutral-600 leading-relaxed">{review.body}</p>
                          {/* Delete own review */}
                          {user?.id === review.user.id && (
                            <button
                              onClick={async () => {
                                await fetch(`/api/products/${product.slug}/reviews`, { method: "DELETE", credentials: "include" });
                                setReviews((prev) => prev.filter((r) => r.id !== review.id));
                                toast.success("Review deleted");
                              }}
                              className="mt-2 text-xs text-red-400 hover:text-red-600 transition-colors"
                            >
                              Delete my review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
