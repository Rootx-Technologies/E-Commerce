"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export function CartPageClient() {
  const { items, removeItem, updateQuantity, clearCart, applyCoupon, removeCoupon, couponCode, discount, subtotal, shipping, tax, total } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  const safeItems = mounted ? items : [];
  const sub = mounted ? subtotal() : 0;
  const shippingCost = mounted ? shipping() : 0;
  const taxAmount = mounted ? tax() : 0;
  const totalAmount = mounted ? total() : 0;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, orderAmount: sub }),
      });
      const data = await res.json();
      if (data.success) {
        applyCoupon(couponInput, data.data.discountAmount);
        toast.success(`Coupon applied! Saved ${formatPrice(data.data.discountAmount)}`);
        setCouponInput("");
      } else { toast.error(data.error ?? "Invalid coupon code"); }
    } catch { toast.error("Failed to apply coupon"); }
    finally { setCouponLoading(false); }
  };

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
      </div>
    );
  }

  if (safeItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4 text-center">
        <ShoppingBag className="h-16 w-16 text-neutral-200" />
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Your cart is empty</h1>
          <p className="mt-1 text-sm text-neutral-500">Looks like you haven&apos;t added anything yet.</p>
        </div>
        <Link href="/products"><Button size="lg" className="gap-2"><ShoppingBag className="h-4 w-4" />Start Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-5 sm:mb-8">
        Cart <span className="text-neutral-400 font-normal text-base">({safeItems.length} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {safeItems.map((item) => (
            <div key={item.id} className="flex gap-3 sm:gap-5 rounded-xl border border-neutral-100 p-3 sm:p-4 bg-white">
              <div className="relative h-20 w-16 sm:h-28 sm:w-24 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                {item.product.images[0] && (
                  <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" sizes="96px" />
                )}
              </div>

              <div className="flex flex-1 flex-col gap-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/products/${item.product.slug}`}
                    className="text-xs sm:text-sm font-semibold text-neutral-900 hover:text-amber-600 transition-colors line-clamp-2">
                    {item.product.name}
                  </Link>
                  <button onClick={() => removeItem(item.id)}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center text-neutral-400 hover:text-red-500 transition-colors"
                    aria-label="Remove item">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {(item.size || item.color) && (
                  <p className="text-[10px] sm:text-xs text-neutral-500">
                    {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(" · ")}
                  </p>
                )}

                <div className="flex items-center justify-between mt-auto pt-1">
                  <div className="flex items-center rounded-md border border-neutral-200">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center hover:bg-neutral-100 transition-colors rounded-l-md"
                      aria-label="Decrease">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center hover:bg-neutral-100 transition-colors rounded-r-md"
                      aria-label="Increase">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-neutral-900">{formatPrice(item.price * item.quantity)}</p>
                    {item.quantity > 1 && <p className="text-[10px] text-neutral-400">{formatPrice(item.price)} each</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-1">
            <Link href="/products"><Button variant="ghost" size="sm" className="text-xs sm:text-sm">← Continue Shopping</Button></Link>
            <button onClick={() => { clearCart(); toast.success("Cart cleared"); }}
              className="text-xs sm:text-sm text-red-500 hover:text-red-700 transition-colors">
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="rounded-xl border border-neutral-100 bg-white p-4 sm:p-6 space-y-4 lg:sticky lg:top-24">
            <h2 className="text-base sm:text-lg font-semibold text-neutral-900">Order Summary</h2>

            {/* Coupon */}
            {couponCode ? (
              <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-xs font-medium text-green-700">{couponCode}</span>
                </div>
                <button onClick={() => { removeCoupon(); toast.success("Coupon removed"); }}
                  className="text-xs text-red-500 hover:text-red-700">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input placeholder="Coupon code" value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  className="text-xs h-9" />
                <Button variant="outline" size="sm" onClick={handleApplyCoupon} isLoading={couponLoading} className="flex-shrink-0 h-9">
                  Apply
                </Button>
              </div>
            )}

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-neutral-600 text-xs sm:text-sm">
                <span>Subtotal</span><span>{formatPrice(sub)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 text-xs sm:text-sm">
                  <span>Discount</span><span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600 text-xs sm:text-sm">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? <span className="text-green-600 font-medium">Free</span> : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-neutral-600 text-xs sm:text-sm">
                <span>Tax (17%)</span><span>{formatPrice(taxAmount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-sm sm:text-base text-neutral-900">
                <span>Total</span><span>{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <Link href="/checkout">
              <Button size="lg" className="w-full gap-2 text-sm sm:text-base">
                Checkout <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-center text-[10px] sm:text-xs text-neutral-400">Secure checkout · SSL encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
}
