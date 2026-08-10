"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, Grid3X3, List, X, ChevronDown, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductGrid } from "@/components/products/product-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SORT_OPTIONS } from "@/lib/constants";
import type { Product, Category, Brand } from "@/types";

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
  brands: Brand[];
  initialFilters: Record<string, string | undefined>;
  total?: number;
  currentPage?: number;
}

export function ProductsClient({ initialProducts, categories, brands, initialFilters, total = 0, currentPage = 1 }: ProductsClientProps) {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const activeFilters = Object.entries(initialFilters).filter(([k, v]) => v && k !== "page" && k !== "sort");

  const updateFilter = useCallback((key: string, value: string | undefined) => {
    const params = new URLSearchParams();
    Object.entries(initialFilters).forEach(([k, v]) => { if (v && k !== key) params.set(k, v); });
    if (value) params.set(key, value);
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }, [initialFilters, router]);

  const clearAllFilters = () => router.push("/products");

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="border-b border-neutral-100 bg-neutral-50 py-5 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">All Products</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{initialProducts.length} products found</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(!isFilterOpen)} className="gap-2 h-9">
              <Filter className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Filters</span>
              {activeFilters.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
                  {activeFilters.length}
                </span>
              )}
            </Button>

            {/* Active chips — hidden on mobile */}
            <div className="hidden sm:flex flex-wrap gap-1.5">
              {activeFilters.map(([key, value]) => (
                <button key={key} onClick={() => updateFilter(key, undefined)}
                  className="flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-200 transition-colors">
                  {value} <X className="h-3 w-3" />
                </button>
              ))}
              {activeFilters.length > 0 && (
                <button onClick={clearAllFilters} className="text-xs text-red-500 hover:text-red-700 font-medium px-1">
                  Clear all
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <div className="relative">
              <select
                value={initialFilters.sort ?? "newest"}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="h-9 appearance-none rounded-md border border-neutral-300 bg-white pl-3 pr-7 text-xs sm:text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900 cursor-pointer"
                aria-label="Sort products">
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            </div>

            {/* View mode — desktop only */}
            <div className="hidden sm:flex items-center gap-0.5 rounded-md border border-neutral-200 p-0.5">
              <button onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900"}`}
                aria-label="Grid view">
                <Grid3X3 className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-colors ${viewMode === "list" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900"}`}
                aria-label="List view">
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6 lg:gap-8">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.aside
                initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 240 }}
                exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }}
                className="flex-shrink-0 overflow-hidden hidden sm:block">
                <div className="w-[240px] space-y-5">
                  {/* Categories */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2.5">Category</h3>
                    <div className="space-y-1.5">
                      {categories.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                          <input type="radio" name="category" value={cat.slug}
                            checked={initialFilters.category === cat.slug}
                            onChange={() => updateFilter("category", cat.slug)}
                            className="accent-neutral-900 h-3.5 w-3.5" />
                          <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">{cat.name}</span>
                        </label>
                      ))}
                      {initialFilters.category && (
                        <button onClick={() => updateFilter("category", undefined)} className="text-xs text-amber-600 hover:text-amber-700">
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Brands */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2.5">Brand</h3>
                    <div className="space-y-1.5">
                      {brands.map((brand) => (
                        <label key={brand.id} className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox"
                            checked={initialFilters.brand === brand.slug}
                            onChange={(e) => updateFilter("brand", e.target.checked ? brand.slug : undefined)}
                            className="accent-neutral-900 h-3.5 w-3.5" />
                          <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">{brand.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2.5">Price Range</h3>
                    <div className="flex items-center gap-2">
                      <Input type="number" placeholder="Min" value={initialFilters.minPrice ?? ""}
                        onChange={(e) => updateFilter("minPrice", e.target.value || undefined)}
                        className="text-xs h-8" />
                      <span className="text-neutral-400 text-xs">—</span>
                      <Input type="number" placeholder="Max" value={initialFilters.maxPrice ?? ""}
                        onChange={(e) => updateFilter("maxPrice", e.target.value || undefined)}
                        className="text-xs h-8" />
                    </div>
                  </div>

                  <Button variant="outline" size="sm" onClick={clearAllFilters} className="w-full text-xs">
                    Clear All Filters
                  </Button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Mobile filter sheet */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="sm:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setIsFilterOpen(false)}>
                <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl overflow-y-auto p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-semibold text-neutral-900">Filters</h2>
                    <button onClick={() => setIsFilterOpen(false)} className="p-1 text-neutral-500">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2.5">Category</h3>
                      <div className="space-y-2">
                        {categories.map((cat) => (
                          <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer">
                            <input type="radio" name="category-mobile" value={cat.slug}
                              checked={initialFilters.category === cat.slug}
                              onChange={() => { updateFilter("category", cat.slug); setIsFilterOpen(false); }}
                              className="accent-neutral-900 h-4 w-4" />
                            <span className="text-sm text-neutral-700">{cat.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2.5">Brand</h3>
                      <div className="space-y-2">
                        {brands.map((brand) => (
                          <label key={brand.id} className="flex items-center gap-2.5 cursor-pointer">
                            <input type="checkbox"
                              checked={initialFilters.brand === brand.slug}
                              onChange={(e) => { updateFilter("brand", e.target.checked ? brand.slug : undefined); }}
                              className="accent-neutral-900 h-4 w-4" />
                            <span className="text-sm text-neutral-700">{brand.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <Button onClick={() => { clearAllFilters(); setIsFilterOpen(false); }} variant="outline" className="w-full">
                      Clear All
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={initialProducts} columns={isFilterOpen ? 3 : 4} />
          </div>
        </div>
      </div>
    </div>
  );
}
