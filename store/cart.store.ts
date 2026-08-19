"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";
import { SHIPPING_THRESHOLD, SHIPPING_COST, TAX_RATE } from "@/lib/constants";

interface CartState {
  items: CartItem[];
  couponCode: string;
  discount: number;

  // Actions
  addItem: (product: Product, quantity?: number, variantId?: string, size?: string, color?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;

  // Computed
  subtotal: () => number;
  shipping: () => number;
  tax: () => number;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: "",
      discount: 0,

      addItem: (product, quantity = 1, variantId, size, color) => {
        set((state) => {
          const normSize = size ? size.trim() : undefined;
          const normColor = color ? color.trim() : undefined;

          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              (item.size ?? "") === (normSize ?? "") &&
              (item.color ?? "") === (normColor ?? "") &&
              (item.variantId ?? "") === (variantId ?? "")
          );

          if (existingIndex >= 0) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
            };
            return { items: updated };
          }

          const newItemId = `${product.id}__${normSize ?? "nosize"}__${normColor ?? "nocolor"}__${variantId ?? "default"}`;

          const newItem: CartItem = {
            id: newItemId,
            product,
            variantId,
            quantity,
            price: product.price,
            size: normSize,
            color: normColor,
          };

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [], couponCode: "", discount: 0 }),

      applyCoupon: (code, discount) => set({ couponCode: code, discount }),

      removeCoupon: () => set({ couponCode: "", discount: 0 }),

      subtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),

      shipping: () => {
        const sub = get().subtotal();
        return sub >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
      },

      tax: () => {
        const sub = get().subtotal() - get().discount;
        return Math.round(sub * TAX_RATE);
      },

      total: () => {
        const sub = get().subtotal();
        return sub - get().discount + get().shipping() + get().tax();
      },

      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "marqet-cart",
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discount: state.discount,
      }),
    }
  )
);
