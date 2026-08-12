"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Trash2, ShoppingBag, ArrowRight, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import toast from "react-hot-toast";

export function WishlistClient() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItemWithSync, clear } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const safeItems = mounted ? items : [];
  const loggedIn = mounted && isLoggedIn();

  const handleMoveToCart = (product: (typeof items)[0]) => {
    if (!isLoggedIn()) {
      toast.error("Please login to add items to your cart", { icon: "🔒" });
      router.push("/login");
      return;
    }
    addToCart(product, 1);
    removeItemWithSync(product.id);
    toast.success("Moved to cart!", { icon: "🛍️" });
  };

  const handleRemove = (productId: string) => {
    removeItemWithSync(productId);
    toast.success("Removed from wishlist");
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-500 fill-red-500" />
                My Wishlist
                {safeItems.length > 0 && (
                  <span className="text-base font-normal text-neutral-500">
                    ({safeItems.length} items)
                  </span>
                )}
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                Items you&apos;ve saved for later
              </p>
            </div>
            {loggedIn && safeItems.length > 0 && (
              <button
                onClick={() => { clear(); toast.success("Wishlist cleared"); }}
                className="text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {!mounted ? (
          /* Loading skeleton */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl bg-neutral-200 aspect-[3/4]" />
            ))}
          </div>
        ) : !loggedIn ? (
          /* Not logged in */
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
              <Lock className="h-10 w-10 text-neutral-300" />
            </div>
            <div>
              <p className="text-xl font-semibold text-neutral-900">Login to view your wishlist</p>
              <p className="mt-1 text-sm text-neutral-500">
                Save your favourite items and access them from any device.
              </p>
            </div>
            <Link href="/login">
              <Button className="gap-2">Sign In to View Wishlist</Button>
            </Link>
          </div>
        ) : safeItems.length === 0 ? (
          /* Empty wishlist */
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
              <Heart className="h-10 w-10 text-neutral-300" />
            </div>
            <div>
              <p className="text-xl font-semibold text-neutral-900">Your wishlist is empty</p>
              <p className="mt-1 text-sm text-neutral-500">
                Save items you love and come back to them anytime.
              </p>
            </div>
            <Link href="/products">
              <Button className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              <AnimatePresence>
                {safeItems.map((product) => {
                  const discount = product.comparePrice
                    ? calculateDiscount(product.price, product.comparePrice)
                    : null;
                  const img = product.images.find((i) => i.isPrimary) ?? product.images[0];

                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="group relative rounded-2xl bg-white border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Remove button */}
                      <button
                        onClick={() => handleRemove(product.id)}
                        className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-500 hover:bg-red-50 hover:text-red-500 shadow-sm transition-all"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                        {product.isNew && <Badge variant="new">New</Badge>}
                        {discount && <Badge variant="sale">-{discount}%</Badge>}
                      </div>

                      {/* Image */}
                      <Link href={`/products/${product.slug}`}>
                        <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                          {img && (
                            <Image
                              src={img.url}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 640px) 50vw, 25vw"
                            />
                          )}
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="p-4 space-y-3">
                        <div>
                          {product.brand && (
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                              {product.brand.name}
                            </p>
                          )}
                          <Link href={`/products/${product.slug}`}>
                            <p className="text-sm font-medium text-neutral-900 line-clamp-2 hover:text-amber-600 transition-colors">
                              {product.name}
                            </p>
                          </Link>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-neutral-900">
                            {formatPrice(product.price)}
                          </span>
                          {product.comparePrice && (
                            <span className="text-xs text-neutral-400 line-through">
                              {formatPrice(product.comparePrice)}
                            </span>
                          )}
                        </div>

                        <Button
                          size="sm"
                          className="w-full gap-1.5"
                          onClick={() => handleMoveToCart(product)}
                          disabled={product.stock === 0}
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          {product.stock === 0 ? "Out of Stock" : "Move to Cart"}
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="mt-10 text-center">
              <Link href="/products">
                <Button variant="outline" className="gap-2">
                  Continue Shopping
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
