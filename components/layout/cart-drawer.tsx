"use client";

import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { getColorHex } from "@/lib/product-variants";
import { SHIPPING_THRESHOLD } from "@/lib/constants";

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, removeItem, updateQuantity, subtotal, shipping, tax, total, itemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const sub = mounted ? subtotal() : 0;
  const shippingCost = mounted ? shipping() : 0;
  const taxAmount = mounted ? tax() : 0;
  const totalAmount = mounted ? total() : 0;
  const safeItems = mounted ? items : [];
  const freeShippingProgress = Math.min((sub / SHIPPING_THRESHOLD) * 100, 100);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm sm:max-w-md flex-col bg-white shadow-2xl"
            role="dialog" aria-label="Shopping cart" aria-modal="true">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                <h2 className="text-base sm:text-lg font-semibold">
                  Cart{safeItems.length > 0 && (
                    <span className="text-neutral-500 font-normal text-sm ml-1">({itemCount()} items)</span>
                  )}
                </h2>
              </div>
              <button onClick={closeCart}
                className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                aria-label="Close cart">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free shipping progress */}
            {sub < SHIPPING_THRESHOLD && sub > 0 && (
              <div className="bg-amber-50 px-4 sm:px-6 py-2.5 text-xs text-amber-800">
                <div className="flex justify-between mb-1">
                  <span>Add <strong>{formatPrice(SHIPPING_THRESHOLD - sub)}</strong> for free shipping</span>
                  <span>{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-amber-200 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500 transition-all duration-500" style={{ width: `${freeShippingProgress}%` }} />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4">
              {safeItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
                  <ShoppingBag className="h-14 w-14 text-neutral-200" />
                  <div>
                    <p className="font-medium text-neutral-900">Your cart is empty</p>
                    <p className="text-sm text-neutral-500 mt-1">Add some products to get started</p>
                  </div>
                  <Button onClick={closeCart} variant="outline" size="sm">Continue Shopping</Button>
                </div>
              ) : (
                <ul className="space-y-3 sm:space-y-4">
                  {safeItems.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                        {item.product.images[0] && (
                          <Image src={item.product.images[0].url} alt={item.product.name} fill
                            className="object-cover" sizes="80px" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-1 min-w-0">
                        <Link href={`/products/${item.product.slug}`} onClick={closeCart}
                          className="text-xs sm:text-sm font-medium text-neutral-900 hover:text-amber-600 transition-colors line-clamp-2">
                          {item.product.name}
                        </Link>
                        {(item.size || item.color) && (
                          <div className="flex items-center gap-1.5 flex-wrap my-0.5">
                            {item.size && (
                              <span className="inline-flex items-center rounded-md bg-neutral-100 border border-neutral-200/80 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-800">
                                Size: <span className="ml-1 text-amber-700 font-bold">{item.size}</span>
                              </span>
                            )}
                            {item.color && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 border border-neutral-200/80 px-1.5 py-0.5 text-[10px] font-medium text-neutral-700">
                                <span
                                  className="h-2 w-2 rounded-full border border-neutral-300"
                                  style={{ backgroundColor: getColorHex(item.color) }}
                                />
                                {item.color}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-0 rounded-md border border-neutral-200">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="flex h-8 w-8 items-center justify-center hover:bg-neutral-100 transition-colors rounded-l-md"
                              aria-label="Decrease quantity">
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex h-8 w-8 items-center justify-center hover:bg-neutral-100 transition-colors rounded-r-md"
                              aria-label="Increase quantity">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                            <button onClick={() => removeItem(item.id)}
                              className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                              aria-label="Remove item">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {safeItems.length > 0 && (
              <div className="border-t border-neutral-100 px-4 sm:px-6 py-3 sm:py-4 space-y-3">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-neutral-600 text-xs sm:text-sm">
                    <span>Subtotal</span><span>{formatPrice(sub)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 text-xs sm:text-sm">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? <span className="text-green-600 font-medium">Free</span> : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 text-xs sm:text-sm">
                    <span>Tax (17%)</span><span>{formatPrice(taxAmount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-sm sm:text-base text-neutral-900">
                    <span>Total</span><span>{formatPrice(totalAmount)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Link href="/checkout" onClick={closeCart}>
                    <Button className="w-full" size="lg">Checkout</Button>
                  </Link>
                  <Link href="/cart" onClick={closeCart}>
                    <Button variant="outline" className="w-full" size="sm">View Full Cart</Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
