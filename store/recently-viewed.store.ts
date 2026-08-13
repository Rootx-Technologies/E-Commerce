"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

const MAX_ITEMS = 10;

interface RecentlyViewedState {
  items: Product[];
  addItem: (product: Product) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const filtered = get().items.filter((p) => p.id !== product.id);
        set({ items: [product, ...filtered].slice(0, MAX_ITEMS) });
      },

      clear: () => set({ items: [] }),
    }),
    { name: "marqet-recently-viewed" }
  )
);
