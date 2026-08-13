"use client";

import { useState } from "react";
import { Ruler, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sizeCharts = {
  clothing: {
    headers: ["Size", "Chest (in)", "Waist (in)", "Hips (in)", "Length (in)"],
    rows: [
      ["XS", "32–34", "26–28", "34–36", "26"],
      ["S",  "34–36", "28–30", "36–38", "27"],
      ["M",  "36–38", "30–32", "38–40", "28"],
      ["L",  "38–40", "32–34", "40–42", "29"],
      ["XL", "40–42", "34–36", "42–44", "30"],
      ["XXL","42–44", "36–38", "44–46", "31"],
    ],
  },
  shoes: {
    headers: ["UK", "EU", "US", "Foot Length (cm)"],
    rows: [
      ["6",  "39", "7",  "24.5"],
      ["7",  "40", "8",  "25.4"],
      ["8",  "41", "9",  "26.2"],
      ["9",  "42", "10", "27.1"],
      ["10", "43", "11", "27.9"],
      ["11", "44", "12", "28.8"],
    ],
  },
};

interface SizeGuideProps {
  type?: "clothing" | "shoes";
}

export function SizeGuide({ type = "clothing" }: SizeGuideProps) {
  const [open, setOpen] = useState(false);
  const chart = sizeCharts[type];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 transition-colors underline underline-offset-2"
      >
        <Ruler size={12} />
        Size Guide
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-amber-500" />
                  <h2 className="text-base font-bold text-neutral-900">Size Guide</h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Table */}
              <div className="p-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50">
                      {chart.headers.map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500 first:rounded-l-lg last:rounded-r-lg">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chart.rows.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "" : "bg-neutral-50/50"}>
                        {row.map((cell, j) => (
                          <td key={j} className={`px-4 py-3 text-neutral-700 ${j === 0 ? "font-semibold text-neutral-900" : ""}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs text-amber-800">
                  <p className="font-semibold mb-1">How to measure:</p>
                  <p>Measure your body with a soft measuring tape. Keep it snug but not tight. If you&apos;re between sizes, choose the larger size for a comfortable fit.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
