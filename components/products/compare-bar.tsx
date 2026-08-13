"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, GitCompare, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCompareStore } from "@/store/compare.store";
import { formatPrice } from "@/lib/utils";

export function CompareBar() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, clear, isOpen, openDrawer, closeDrawer } = useCompareStore();

  useEffect(() => setMounted(true), []);

  if (!mounted || items.length === 0) return null;

  return (
    <>
      {/* Floating bar at bottom */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-900 border-t border-neutral-700 shadow-2xl"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                <GitCompare size={16} className="text-amber-400" />
                <span className="text-sm font-semibold">
                  Compare ({items.length}/3)
                </span>
              </div>

              {/* Product thumbnails */}
              <div className="flex items-center gap-2 flex-1">
                {items.map((p) => (
                  <div key={p.id} className="relative flex items-center gap-2 bg-neutral-800 rounded-lg px-2 py-1.5">
                    <div className="relative h-8 w-8 rounded overflow-hidden flex-shrink-0">
                      {p.images?.[0] && (
                        <Image src={p.images[0].url} alt={p.name} fill className="object-cover" sizes="32px" />
                      )}
                    </div>
                    <p className="text-xs text-white max-w-[80px] truncate hidden sm:block">{p.name}</p>
                    <button
                      onClick={() => removeItem(p.id)}
                      className="text-neutral-400 hover:text-white transition-colors ml-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {/* Empty slots */}
                {Array.from({ length: 3 - items.length }).map((_, i) => (
                  <div key={i} className="h-11 w-24 rounded-lg border border-dashed border-neutral-600 flex items-center justify-center hidden sm:flex">
                    <span className="text-xs text-neutral-500">Add product</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={clear}
                  className="text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  Clear
                </button>
                <Link
                  href="/compare"
                  className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors"
                >
                  Compare <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
