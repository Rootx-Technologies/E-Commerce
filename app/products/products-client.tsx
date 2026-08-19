"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X, ChevronDown, Plus, Minus, Filter, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ProductGrid } from "@/components/products/product-grid";
import { Input } from "@/components/ui/input";
import { SORT_OPTIONS, PRODUCT_SIZES } from "@/lib/constants";
import type { Product, Category, Brand } from "@/types";

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
  brands: Brand[];
  initialFilters: Record<string, string | undefined>;
  total?: number;
  currentPage?: number;
}

function FilterSection({ title, isOpenDefault = true, children, activeCount = 0 }: { title: string, isOpenDefault?: boolean, children: React.ReactNode, activeCount?: number }) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  return (
    <div className="border-b border-neutral-200 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex w-full items-center justify-between text-sm font-semibold tracking-wider text-neutral-900 uppercase"
      >
        <span>{title} {activeCount > 0 && `(${activeCount})`}</span>
        {isOpen ? <Minus className="h-4 w-4 text-neutral-500" /> : <Plus className="h-4 w-4 text-neutral-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-2.5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductsClient({ initialProducts, categories, brands, initialFilters, total = 0, currentPage = 1 }: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const activeFilters = Object.entries(initialFilters).filter(([k, v]) => v && k !== "page" && k !== "sort");

  const updateFilter = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page"); // Reset page on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleFilterValue = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    const current = params.get(key);
    let values = current ? current.split(',') : [];
    
    if (values.includes(value)) {
      values = values.filter(v => v !== value);
    } else {
      values.push(value);
    }
    
    if (values.length > 0) {
      params.set(key, values.join(','));
    } else {
      params.delete(key);
    }
    
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useCallback((value: string) => {
    const params = new URLSearchParams(initialFilters as Record<string, string>);
    if (value) params.set("search", value);
    else params.delete("search");
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }, [initialFilters, router]);

  const clearAllFilters = () => router.push("/products");

  // Parse active comma-separated filters
  const activeCategorySlugs = initialFilters.category ? initialFilters.category.split(',') : [];
  const activeBrandSlugs = initialFilters.brand ? initialFilters.brand.split(',') : [];
  const activeSizes = initialFilters.size ? initialFilters.size.split(',') : [];

  // Determine current category context for page title and contextual filtering
  // If multiple are selected, we just use the first one for title/context context.
  const firstCategorySlug = activeCategorySlugs[0];
  const currentCategoryObj = firstCategorySlug ? categories.find(c => c.slug === firstCategorySlug) : undefined;
  
  // Contextual Categories Display Logic (Show ONLY subcategories of active parent)
  let displayCategories = categories;
  if (currentCategoryObj) {
    if (currentCategoryObj.parentId) {
      // It's a subcategory (e.g. men-clothing), show its siblings
      displayCategories = categories.filter(c => c.parentId === currentCategoryObj.parentId);
    } else {
      // It's a parent category (e.g. men), show its children
      displayCategories = categories.filter(c => c.parentId === currentCategoryObj.id);
    }
  } else {
    // Top-level default
    displayCategories = categories.filter(c => !c.parentId);
  }

  const pageTitle = currentCategoryObj 
    ? (currentCategoryObj.parent ? `${currentCategoryObj.parent.name} > ${currentCategoryObj.name}` : currentCategoryObj.name)
    : "All Products";

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-neutral-500 mb-6">
          <Link href="/" className="hover:text-neutral-900">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-neutral-900">Collections</Link>
          {currentCategoryObj && (
            <>
              <span className="mx-2">/</span>
              <span className="text-neutral-900">{currentCategoryObj.name}</span>
            </>
          )}
        </nav>

        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl font-normal mb-8 sm:mb-12">{pageTitle}</h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex items-center justify-between border-y border-neutral-200 py-3">
            <button onClick={() => setIsMobileFilterOpen(true)} className="flex items-center gap-2 text-sm font-medium">
              <SlidersHorizontal className="h-4 w-4" /> Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
            </button>
            <div className="text-sm text-neutral-500">{initialProducts.length} products</div>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[260px] shrink-0">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-2">
              <h2 className="text-base font-medium">Filters {activeFilters.length > 0 && `(${activeFilters.length})`}</h2>
              {activeFilters.length > 0 && (
                <button onClick={clearAllFilters} className="text-xs text-neutral-500 underline hover:text-neutral-900">
                  Clear all
                </button>
              )}
            </div>

            <FilterSection title="Categories" isOpenDefault={true} activeCount={activeCategorySlugs.length}>
              <div className="space-y-2.5">
                {displayCategories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      name="category" 
                      value={cat.slug}
                      checked={activeCategorySlugs.includes(cat.slug)}
                      onChange={() => toggleFilterValue("category", cat.slug)}
                      className="accent-neutral-900 h-4 w-4 rounded-sm border-neutral-300" 
                    />
                    <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Size" isOpenDefault={true} activeCount={activeSizes.length}>
              <div className="space-y-2.5">
                {PRODUCT_SIZES.map((size) => (
                  <label key={size} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      name="size" 
                      value={size}
                      checked={activeSizes.includes(size)}
                      onChange={() => toggleFilterValue("size", size)}
                      className="accent-neutral-900 h-4 w-4 rounded-sm border-neutral-300" 
                    />
                    <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                      {size}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Brands" isOpenDefault={false} activeCount={activeBrandSlugs.length}>
              <div className="space-y-2.5">
                {brands.map((brand) => (
                  <label key={brand.id} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox"
                      checked={activeBrandSlugs.includes(brand.slug)}
                      onChange={() => toggleFilterValue("brand", brand.slug)}
                      className="accent-neutral-900 h-4 w-4 rounded-sm border-neutral-300" />
                    <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">{brand.name}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Price" isOpenDefault={false} activeCount={(initialFilters.minPrice || initialFilters.maxPrice) ? 1 : 0}>
              <div className="flex items-center gap-3">
                <Input type="number" placeholder="Min" value={initialFilters.minPrice ?? ""}
                  onChange={(e) => updateFilter("minPrice", e.target.value || undefined)}
                  className="text-xs h-10 bg-neutral-50 border-neutral-200" />
                <span className="text-neutral-400">to</span>
                <Input type="number" placeholder="Max" value={initialFilters.maxPrice ?? ""}
                  onChange={(e) => updateFilter("maxPrice", e.target.value || undefined)}
                  className="text-xs h-10 bg-neutral-50 border-neutral-200" />
              </div>
            </FilterSection>
          </aside>

          {/* Main Content (Products Grid) */}
          <div className="flex-1 min-w-0">
            {/* Top Bar for Desktop */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-500">Sort by</span>
                <div className="relative">
                  <select
                    value={initialFilters.sort ?? "newest"}
                    onChange={(e) => updateFilter("sort", e.target.value)}
                    className="appearance-none bg-transparent pr-5 text-sm font-medium text-neutral-900 focus:outline-none cursor-pointer hover:text-neutral-600"
                    aria-label="Sort products">
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-900" />
                </div>
              </div>
              <div className="text-sm text-neutral-500">
                {initialProducts.length} {initialProducts.length === 1 ? 'product' : 'products'}
              </div>
            </div>

            {/* Mobile Sort Dropdown (visible only on mobile) */}
            <div className="lg:hidden flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">Sort by:</span>
                <div className="relative">
                  <select
                    value={initialFilters.sort ?? "newest"}
                    onChange={(e) => updateFilter("sort", e.target.value)}
                    className="appearance-none bg-transparent pr-5 text-sm font-medium text-neutral-900 focus:outline-none cursor-pointer"
                    aria-label="Sort products">
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-900" />
                </div>
              </div>
            </div>

            {/* Active Chips (Mobile only, desktop uses sidebar) */}
            <div className="lg:hidden flex flex-wrap gap-2 mb-6">
              {activeFilters.map(([key, value]) => (
                <button key={key} onClick={() => updateFilter(key, undefined)}
                  className="flex items-center gap-1.5 rounded bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700">
                  {value} <X className="h-3 w-3" />
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <ProductGrid products={initialProducts} columns={4} />
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileFilterOpen(false)}>
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl flex flex-col">
              
              <div className="flex items-center justify-between p-5 border-b border-neutral-200">
                <h2 className="text-lg font-medium">Filters {activeFilters.length > 0 && `(${activeFilters.length})`}</h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-neutral-500">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5">
                <FilterSection title="Categories" isOpenDefault={true} activeCount={activeCategorySlugs.length}>
                  <div className="space-y-2.5">
                    {displayCategories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          name="category-mobile" 
                          value={cat.slug}
                          checked={activeCategorySlugs.includes(cat.slug)}
                          onChange={() => toggleFilterValue("category", cat.slug)}
                          className="accent-neutral-900 h-4 w-4 rounded-sm border-neutral-300" 
                        />
                        <span className="text-sm text-neutral-600">
                          {cat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Size" isOpenDefault={true} activeCount={activeSizes.length}>
                  <div className="space-y-2.5">
                    {PRODUCT_SIZES.map((size) => (
                      <label key={size} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          name="size-mobile" 
                          value={size}
                          checked={activeSizes.includes(size)}
                          onChange={() => toggleFilterValue("size", size)}
                          className="accent-neutral-900 h-4 w-4 rounded-sm border-neutral-300" 
                        />
                        <span className="text-sm text-neutral-600">
                          {size}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Brands" isOpenDefault={false} activeCount={activeBrandSlugs.length}>
                  <div className="space-y-2.5">
                    {brands.map((brand) => (
                      <label key={brand.id} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox"
                          checked={activeBrandSlugs.includes(brand.slug)}
                          onChange={() => toggleFilterValue("brand", brand.slug)}
                          className="accent-neutral-900 h-4 w-4 rounded-sm border-neutral-300" />
                        <span className="text-sm text-neutral-600">{brand.name}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Price" isOpenDefault={false}>
                   <div className="flex items-center gap-3">
                    <Input type="number" placeholder="Min" value={initialFilters.minPrice ?? ""}
                      onChange={(e) => updateFilter("minPrice", e.target.value || undefined)}
                      className="text-xs h-10" />
                    <span className="text-neutral-400">to</span>
                    <Input type="number" placeholder="Max" value={initialFilters.maxPrice ?? ""}
                      onChange={(e) => updateFilter("maxPrice", e.target.value || undefined)}
                      className="text-xs h-10" />
                  </div>
                </FilterSection>
              </div>

              <div className="p-5 border-t border-neutral-200">
                <button 
                  onClick={() => { clearAllFilters(); setIsMobileFilterOpen(false); }} 
                  className="w-full rounded bg-neutral-900 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
                >
                  Apply & Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
