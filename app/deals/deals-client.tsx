"use client";

import { useState, useEffect } from "react";
import { Zap, Sun, Gift, Package, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { ProductGrid } from "@/components/products/product-grid";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface DealsClientProps {
  flashProducts: Product[];
  flashSaleEnd: Date;
  dailyDeals: Product[];
  ramadanProducts: Product[];
  bundleProducts: Product[];
}

function useCountdown(end: Date) {
  const [t, setT] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = end.getTime() - Date.now();
      if (diff <= 0) { setT({ h: 0, m: 0, s: 0 }); return; }
      setT({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [end]);
  return t;
}

function Digit({ v, label }: { v: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur text-white text-2xl font-black tabular-nums border border-white/20">
        {String(v).padStart(2, "0")}
      </div>
      <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/60">
        {label}
      </span>
    </div>
  );
}

const tabs = [
  { id: "flash", label: "Flash Sale", icon: Zap },
  { id: "daily", label: "Daily Deals", icon: Tag },
  { id: "ramadan", label: "Ramadan", icon: Sun },
  { id: "bundle", label: "Bundles", icon: Package },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function DealsClient({
  flashProducts,
  flashSaleEnd,
  dailyDeals,
  ramadanProducts,
  bundleProducts,
}: DealsClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("flash");
  const { h, m, s } = useCountdown(flashSaleEnd);

  const productMap: Record<TabId, Product[]> = {
    flash: flashProducts,
    daily: dailyDeals,
    ramadan: ramadanProducts,
    bundle: bundleProducts,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-neutral-950 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/30 via-neutral-950 to-neutral-950" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-6">
              <Zap className="h-3.5 w-3.5 fill-amber-400" />
              Limited Time Offers
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight">
              Deals &amp; Offers
            </h1>
            <p className="mt-4 text-neutral-400 max-w-lg mx-auto">
              Incredible savings every day — flash sales, seasonal specials, and exclusive bundles.
            </p>
          </motion.div>

          {/* Flash sale countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 inline-flex flex-col items-center gap-4"
          >
            <p className="text-sm font-medium text-white/70">Flash sale ends in</p>
            <div className="flex items-center gap-3">
              <Digit v={h} label="Hours" />
              <span className="text-3xl font-black text-white/40 mb-5">:</span>
              <Digit v={m} label="Mins" />
              <span className="text-3xl font-black text-white/40 mb-5">:</span>
              <Digit v={s} label="Secs" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Offer type cards */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Zap, label: "Flash Sale", sub: "Up to 40% off", color: "bg-amber-500", id: "flash" },
            { icon: Tag, label: "Daily Deals", sub: "New deals daily", color: "bg-blue-500", id: "daily" },
            { icon: Sun, label: "Ramadan Sale", sub: "Special offers", color: "bg-emerald-500", id: "ramadan" },
            { icon: Gift, label: "Bundle Deals", sub: "Buy more, save more", color: "bg-violet-500", id: "bundle" },
          ].map((card) => (
            <button
              key={card.id}
              onClick={() => setActiveTab(card.id as TabId)}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200",
                activeTab === card.id
                  ? "border-neutral-900 bg-neutral-900 text-white shadow-lg"
                  : "border-neutral-100 bg-white hover:border-neutral-300 hover:shadow-sm"
              )}
            >
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${card.color}`}>
                <card.icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className={cn("text-sm font-semibold truncate", activeTab === card.id ? "text-white" : "text-neutral-900")}>
                  {card.label}
                </p>
                <p className={cn("text-xs truncate", activeTab === card.id ? "text-neutral-300" : "text-neutral-500")}>
                  {card.sub}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab nav */}
        <div className="flex items-center gap-1 border-b border-neutral-100 mb-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors",
                activeTab === tab.id
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "flash" && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
                <h2 className="text-xl font-bold text-neutral-900">Flash Sale</h2>
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                  Up to 40% OFF
                </span>
              </div>
              <ProductGrid products={flashProducts} columns={4} />
            </div>
          )}

          {activeTab === "daily" && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Tag className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-bold text-neutral-900">Today&apos;s Deals</h2>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                  Refreshed Daily
                </span>
              </div>
              <ProductGrid products={dailyDeals} columns={4} />
            </div>
          )}

          {activeTab === "ramadan" && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Sun className="h-5 w-5 text-emerald-500" />
                <h2 className="text-xl font-bold text-neutral-900">Ramadan Special</h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                  Up to 30% OFF
                </span>
              </div>
              <ProductGrid products={ramadanProducts} columns={4} />
            </div>
          )}

          {activeTab === "bundle" && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Package className="h-5 w-5 text-violet-500" />
                <h2 className="text-xl font-bold text-neutral-900">Bundle Deals</h2>
                <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-600">
                  Buy More, Save More
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {[
                  { title: "Buy 2 Get 1 Free", desc: "On selected fashion items", badge: "BOGO", color: "bg-amber-500" },
                  { title: "Bundle & Save 25%", desc: "Mix & match any 3 products", badge: "25% OFF", color: "bg-violet-500" },
                ].map((offer) => (
                  <div
                    key={offer.title}
                    className="flex items-center gap-4 rounded-xl border border-neutral-100 bg-neutral-50 p-5"
                  >
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${offer.color} text-white text-xs font-black`}>
                      {offer.badge}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">{offer.title}</p>
                      <p className="text-sm text-neutral-500">{offer.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <ProductGrid products={bundleProducts} columns={4} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
