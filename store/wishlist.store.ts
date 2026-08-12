"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

interface WishlistState {
  items: Product[];
  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clear: () => void;
  // DB sync
  syncFromDB: () => Promise<void>;
  addItemWithSync: (product: Product) => Promise<void>;
  removeItemWithSync: (productId: string) => Promise<void>;
  toggleItemWithSync: (product: Product) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      // ─── Local only (offline) ─────────────────────────────────────────────
      addItem: (product) => {
        if (!get().isInWishlist(product.id)) {
          set((state) => ({ items: [...state.items, product] }));
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((p) => p.id !== productId),
        }));
      },

      toggleItem: (product) => {
        if (get().isInWishlist(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      isInWishlist: (productId) =>
        get().items.some((p) => p.id === productId),

      clear: () => set({ items: [] }),

      // ─── DB Sync ─────────────────────────────────────────────────────────

      // Load wishlist from DB (call on login)
      syncFromDB: async () => {
        try {
          const res = await fetch("/api/user/wishlist", { credentials: "include" });
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            const products = data.data.map((item: { product: Product }) => item.product);
            set({ items: products });
          }
        } catch {
          // silently fail — keep local state
        }
      },

      // Add + sync to DB
      addItemWithSync: async (product) => {
        get().addItem(product);
        try {
          await fetch("/api/user/wishlist", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product.id }),
          });
        } catch { /* silent */ }
      },

      // Remove + sync to DB
      removeItemWithSync: async (productId) => {
        get().removeItem(productId);
        try {
          await fetch("/api/user/wishlist", {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
          });
        } catch { /* silent */ }
      },

      // Toggle + sync to DB
      toggleItemWithSync: async (product) => {
        const inWishlist = get().isInWishlist(product.id);
        if (inWishlist) {
          await get().removeItemWithSync(product.id);
        } else {
          await get().addItemWithSync(product);
        }
      },
    }),
    { name: "marqet-wishlist" }
  )
);
