"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

const MAX_COMPARE = 3;

interface CompareState {
  items: Product[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInCompare: (productId: string) => boolean;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product) => {
        if (get().items.length >= MAX_COMPARE) return;
        if (!get().isInCompare(product.id)) {
          set((s) => ({ items: [...s.items, product] }));
        }
      },

      removeItem: (productId) => {
        set((s) => ({ items: s.items.filter((p) => p.id !== productId) }));
      },

      toggleItem: (product) => {
        if (get().isInCompare(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      isInCompare: (productId) => get().items.some((p) => p.id === productId),

      clear: () => set({ items: [] }),
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
    }),
    {
      name: "marqet-compare",
      partialize: (s) => ({ items: s.items }),
    }
  )
);
