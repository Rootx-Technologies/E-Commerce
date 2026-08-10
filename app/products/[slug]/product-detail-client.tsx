"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, Share2, ChevronRight, Minus, Plus, Star, Shield, Truck, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useAuthStore } from "@/store/auth.store";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const router = useRouter();
  const inWishlist = isInWishlist(product.id);

  const discount = product.comparePrice
    ? calculateDiscount(product.price, product.comparePrice)
    : null;

  const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))];

  const handleAddToCart = () => {
    if (!isLoggedIn()) {
      toast.error("Please login to add items to your cart", { icon: "🔒", duration: 3000 });
      router.push("/login");
      return;
    }
    addItem(product, quantity, undefined, selectedSize ?? undefined, selectedColor ?? undefined);
    toast.success("Added to cart!", { icon: "🛍️" });
  };

  const handleBuyNow = () => {
    if (!isLoggedIn()) {
      toast.error("Please login to continue", { icon: "🔒", duration: 3000 });
      router.push("/login");
      return;
    }
    handleAddToCart();
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
          {sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-neutral-900">Size</h3>
                <button className="text-xs text-amber-600 hover:text-amber-700">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size === selectedSize ? null : size!)}
                    className={`h-10 min-w-[2.5rem] px-3 rounded-md border text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-300 text-neutral-700 hover:border-neutral-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {colors.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                Color{selectedColor && `: ${selectedColor}`}
              </h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const variant = product.variants.find((v) => v.color === color);
                  return (
                    <button
                      key={color}
                      onClick={() =>
                        setSelectedColor(color === selectedColor ? null : color!)
                      }
                      className={`h-8 w-8 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-neutral-900 scale-110"
                          : "border-transparent hover:border-neutral-400"
                      }`}
                      style={{
                        backgroundColor: variant?.colorHex ?? "#ccc",
                      }}
                      aria-label={color ?? "Color option"}
                      title={color ?? undefined}
                    />
                  );
                })}
              </div>
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
                toggleItem(product);
                toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
              }}
              className={inWishlist ? "text-red-500 border-red-200 hover:bg-red-50" : ""}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
            </Button>
          </div>

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
              <div className="flex items-center gap-6 p-6 rounded-xl bg-neutral-50">
                <div className="text-center">
                  <p className="text-5xl font-black text-neutral-900">
                    {product.rating.toFixed(1)}
                  </p>
                  <StarRating rating={product.rating} showCount={false} size="sm" />
                  <p className="text-xs text-neutral-500 mt-1">
                    {product.reviewCount} reviews
                  </p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500 w-4">{star}</span>
                      <div className="flex-1 h-2 rounded-full bg-neutral-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{
                            width: `${star === 5 ? 60 : star === 4 ? 25 : star === 3 ? 10 : 3}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-sm text-neutral-500 text-center">
                Reviews are loaded from the database in production.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
