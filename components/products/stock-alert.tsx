"use client";

import { useState } from "react";
import { Bell, BellRing, X, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface StockAlertProps {
  productId: string;
  productName: string;
}

export function StockAlert({ productId, productName }: StockAlertProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/stock-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, email: email.trim() }),
      });
      setSubscribed(true);
      toast.success("We'll notify you when it's back in stock!");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors"
      >
        <BellRing size={15} />
        Notify Me When Available
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
              >
                <X size={16} />
              </button>

              {subscribed ? (
                <div className="text-center py-4">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900">You&apos;re on the list!</h3>
                  <p className="text-sm text-neutral-500 mt-2">
                    We&apos;ll send you an email at <strong>{email}</strong> as soon as <strong>{productName}</strong> is back in stock.
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="mt-5 w-full rounded-xl bg-neutral-900 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100">
                      <Bell className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-neutral-900">Stock Alert</h3>
                      <p className="text-xs text-neutral-500">Get notified when available</p>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-600 mb-4">
                    <strong className="text-neutral-900">{productName}</strong> is currently out of stock. Enter your email to be the first to know when it&apos;s back.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors disabled:opacity-60"
                    >
                      {loading && <Loader2 size={14} className="animate-spin" />}
                      Notify Me
                    </button>
                  </form>

                  <p className="mt-3 text-center text-xs text-neutral-400">
                    No spam. One email only when back in stock.
                  </p>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
