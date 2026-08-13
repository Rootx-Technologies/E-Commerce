"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, GitCompare, ArrowLeft, Check, Minus } from "lucide-react";
import { useCompareStore } from "@/store/compare.store";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { StarRating } from "@/components/ui/star-rating";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function CompareClient() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, clear } = useCompareStore();
  const addItem = useCartStore((s) => s.addItem);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const safeItems = mounted ? items : [];

  function handleAddToCart(product: typeof items[0]) {
    if (!isLoggedIn()) {
      toast.error("Please login to add items to cart", { icon: "🔒" });
      router.push("/login");
      return;
    }
    addItem(product, 1);
    toast.success(`${product.name} added to cart!`, { icon: "🛍️" });
  }

  if (!mounted) return null;

  if (safeItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 text-center px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
          <GitCompare className="h-10 w-10 text-neutral-300" />
        </div>
        <div>
          <p className="text-xl font-semibold text-neutral-900">No products to compare</p>
          <p className="text-sm text-neutral-500 mt-1">Add products using the compare button on product cards</p>
        </div>
        <Link href="/products"><Button>Browse Products</Button></Link>
      </div>
    );
  }

  // Comparison rows
  const rows = [
    { label: "Price", render: (p: typeof items[0]) => (
      <div>
        <p className="font-bold text-lg text-neutral-900">{formatPrice(p.price)}</p>
        {p.comparePrice && p.comparePrice > p.price && (
          <p className="text-sm text-neutral-400 line-through">{formatPrice(p.comparePrice)}</p>
        )}
      </div>
    )},
    { label: "Rating", render: (p: typeof items[0]) => (
      <div className="flex flex-col items-center gap-1">
        <StarRating rating={p.rating} showCount={false} size="sm" />
        <span className="text-xs text-neutral-500">{p.rating.toFixed(1)} ({p.reviewCount})</span>
      </div>
    )},
    { label: "Category", render: (p: typeof items[0]) => (
      <span className="text-sm text-neutral-700">{p.category?.name ?? "—"}</span>
    )},
    { label: "Brand", render: (p: typeof items[0]) => (
      <span className="text-sm text-neutral-700">{p.brand?.name ?? "—"}</span>
    )},
    { label: "Stock", render: (p: typeof items[0]) => (
      <span className={`text-sm font-medium ${p.stock > 10 ? "text-green-600" : p.stock > 0 ? "text-amber-600" : "text-red-500"}`}>
        {p.stock > 10 ? "In Stock" : p.stock > 0 ? `${p.stock} left` : "Out of Stock"}
      </span>
    )},
    { label: "New", render: (p: typeof items[0]) => (
      p.isNew ? <Check size={18} className="text-green-500 mx-auto" /> : <Minus size={18} className="text-neutral-300 mx-auto" />
    )},
    { label: "Best Seller", render: (p: typeof items[0]) => (
      p.isBestSeller ? <Check size={18} className="text-green-500 mx-auto" /> : <Minus size={18} className="text-neutral-300 mx-auto" />
    )},
    { label: "Featured", render: (p: typeof items[0]) => (
      p.isFeatured ? <Check size={18} className="text-green-500 mx-auto" /> : <Minus size={18} className="text-neutral-300 mx-auto" />
    )},
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-16 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/products" className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                <ArrowLeft size={15} /> Back
              </Link>
              <div className="flex items-center gap-2">
                <GitCompare size={18} className="text-amber-500" />
                <h1 className="text-lg font-bold text-neutral-900">Compare Products</h1>
                <span className="text-sm text-neutral-400">({safeItems.length} products)</span>
              </div>
            </div>
            <button onClick={clear} className="text-sm text-red-500 hover:text-red-700 transition-colors">
              Clear all
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Product headers */}
            <thead>
              <tr>
                <th className="w-36 pr-4 text-left align-bottom pb-6">
                  <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Product</span>
                </th>
                {safeItems.map((product) => (
                  <th key={product.id} className="px-3 pb-6 text-center align-top min-w-[200px]">
                    <div className="relative">
                      {/* Remove button */}
                      <button
                        onClick={() => removeItem(product.id)}
                        className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 hover:bg-red-100 hover:text-red-500 transition-colors z-10"
                      >
                        <X size={12} />
                      </button>

                      {/* Product image */}
                      <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-xl bg-neutral-100 mb-3">
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="160px"
                          />
                        )}
                      </div>

                      {/* Name */}
                      <Link
                        href={`/products/${product.slug}`}
                        className="text-sm font-semibold text-neutral-900 hover:text-amber-600 transition-colors line-clamp-2 block"
                      >
                        {product.name}
                      </Link>
                      {product.brand && (
                        <p className="text-xs text-neutral-400 mt-0.5">{product.brand.name}</p>
                      )}

                      {/* Add to cart */}
                      <Button
                        size="sm"
                        className="mt-3 w-full gap-1.5"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                      >
                        <ShoppingBag size={13} />
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </Button>
                    </div>
                  </th>
                ))}
                {/* Empty placeholder columns */}
                {Array.from({ length: 3 - safeItems.length }).map((_, i) => (
                  <th key={`empty-${i}`} className="px-3 pb-6 min-w-[200px]">
                    <Link
                      href="/products"
                      className="flex flex-col items-center justify-center h-40 w-40 mx-auto rounded-xl border-2 border-dashed border-neutral-200 text-neutral-400 hover:border-amber-300 hover:text-amber-500 transition-colors text-xs font-medium gap-2"
                    >
                      <span className="text-2xl">+</span>
                      Add Product
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Comparison rows */}
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr key={row.label} className={rowIdx % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                  <td className="pr-4 py-4 text-sm font-semibold text-neutral-500 rounded-l-xl pl-3">
                    {row.label}
                  </td>
                  {safeItems.map((product) => (
                    <td key={product.id} className="px-3 py-4 text-center">
                      {row.render(product)}
                    </td>
                  ))}
                  {Array.from({ length: 3 - safeItems.length }).map((_, i) => (
                    <td key={`empty-${i}`} className="px-3 py-4" />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
