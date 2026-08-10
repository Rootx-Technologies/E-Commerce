"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, X, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/ui.store";
import { formatPrice, debounce } from "@/lib/utils";
import type { Product } from "@/types";

const POPULAR_SEARCHES = ["Men's Kurta", "Women's Dress", "Sneakers", "Perfume", "Watches", "Handbags"];

export function SearchModal() {
  const router = useRouter();
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      const stored = localStorage.getItem("Marqet-recent-searches");
      if (stored) setRecentSearches(JSON.parse(stored));
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isSearchOpen]);

  const searchProducts = useCallback(
    debounce(async (q: string) => {
      if (!q.trim() || q.length < 2) { setResults([]); setIsLoading(false); return; }
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}&limit=6`);
        const data = await res.json();
        setResults(data.data ?? []);
      } catch { setResults([]); }
      finally { setIsLoading(false); }
    }, 350), []);

  useEffect(() => { searchProducts(query); }, [query, searchProducts]);

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...recentSearches.filter((s) => s !== q)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("Marqet-recent-searches", JSON.stringify(updated));
    router.push(`/products?search=${encodeURIComponent(q)}`);
    closeSearch();
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeSearch} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 right-0 top-0 z-50 mx-auto max-w-2xl px-3 sm:px-4 pt-3 sm:pt-8"
            role="dialog" aria-label="Search" aria-modal="true">
            <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4 border-b border-neutral-100">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearch(query); if (e.key === "Escape") closeSearch(); }}
                  placeholder="Search products, brands..."
                  className="flex-1 text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 outline-none bg-transparent min-w-0"
                  aria-label="Search"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-neutral-400 hover:text-neutral-600 p-1" aria-label="Clear">
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button onClick={closeSearch}
                  className="text-xs text-neutral-500 hover:text-neutral-700 border border-neutral-200 rounded px-2 py-1 flex-shrink-0">
                  ESC
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[65vh] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-2 sm:p-3">
                    <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Products</p>
                    <ul>
                      {results.map((product) => (
                        <li key={product.id}>
                          <Link href={`/products/${product.slug}`} onClick={closeSearch}
                            className="flex items-center gap-3 rounded-lg px-2 sm:px-3 py-2.5 hover:bg-neutral-50 transition-colors">
                            <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100">
                              {product.images[0] && (
                                <Image src={product.images[0].url} alt={product.name} fill className="object-cover" sizes="48px" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-neutral-900 truncate">{product.name}</p>
                              <p className="text-[10px] sm:text-xs text-neutral-500">{product.category.name}</p>
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-neutral-900 flex-shrink-0">{formatPrice(product.price)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => handleSearch(query)}
                      className="flex w-full items-center justify-between rounded-lg px-2 sm:px-3 py-2.5 text-xs sm:text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors mt-1">
                      <span>See all results for &ldquo;{query}&rdquo;</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-4 sm:p-5 space-y-4">
                    {recentSearches.length > 0 && (
                      <div>
                        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                          <Clock className="h-3 w-3" /> Recent
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((s) => (
                            <button key={s} onClick={() => { setQuery(s); handleSearch(s); }}
                              className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 transition-colors">
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                        <TrendingUp className="h-3 w-3" /> Popular
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_SEARCHES.map((s) => (
                          <button key={s} onClick={() => { setQuery(s); handleSearch(s); }}
                            className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700 hover:bg-neutral-200 transition-colors">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
