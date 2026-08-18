"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Star, Sparkles, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroStats = [
  { label: "Items Stocked", value: "15K+" },
  { label: "Original Brands", value: "100%" },
  { label: "Happy Customers", value: "50K+" },
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-[75vh] items-center overflow-hidden bg-neutral-950 sm:min-h-[85vh]">
      {/* Background Lighting & Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
          alt="Hero background"
          fill
          className="object-cover opacity-20 filter blur-[2px]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(245,158,11,0.22),_transparent_50%),linear-gradient(90deg,_rgba(10,10,10,0.96)_0%,_rgba(10,10,10,0.85)_50%,_rgba(10,10,10,0.6)_100%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Hero Content */}
          <div className="max-w-xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300 sm:text-xs">
                <Sparkles className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                Premium Fashion & Lifestyle
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Discover Modern
              <span className="block bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-500 bg-clip-text text-transparent">
                Style & Elegance
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-sm leading-relaxed text-neutral-300 sm:text-base max-w-md"
            >
              Explore our luxury curated collection of Clothing, Shoes, Bags, Accessories, and Perfumes. Handpicked quality crafted for your lifestyle.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link href="/products">
                <Button size="lg" variant="gold" className="group h-12 gap-2.5 px-7 text-sm shadow-[0_12px_35px_rgba(245,158,11,0.35)] sm:h-13 sm:px-8 sm:text-base rounded-2xl">
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                  Shop Collection
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="outline"
                  className="h-12 border-white/25 bg-white/5 px-6 text-sm text-white hover:border-white/50 hover:bg-white/10 sm:h-13 sm:px-7 sm:text-base rounded-2xl">
                  Explore 5 Categories
                </Button>
              </Link>
            </motion.div>

            {/* E-Commerce Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6 text-xs text-neutral-400"
            >
              <div className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-amber-400" />
                <span>Free Nationwide Shipping</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span>100% Authentic Brands</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="h-4 w-4 text-amber-400" />
                <span>7-Day Easy Returns</span>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 flex flex-wrap items-center gap-6 sm:gap-10"
            >
              {heroStats.map((s) => (
                <div key={s.label}>
                  <p className="text-xl font-black text-white sm:text-2xl">{s.value}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-neutral-400 sm:text-xs">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Side Visual Showcase Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            {/* Glow Aura */}
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-amber-500/25 via-yellow-500/10 to-transparent blur-3xl" />

            {/* Card Container */}
            <div className="relative overflow-hidden rounded-[2.2rem] border border-white/20 bg-neutral-900/80 p-3.5 shadow-2xl backdrop-blur-xl">
              <div className="relative h-[480px] w-full overflow-hidden rounded-[1.6rem] bg-neutral-900">
                <Image
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80"
                  alt="Luxury Fashion Collection"
                  fill
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />

                {/* Floating Top Card */}
                <div className="absolute top-4 left-4 rounded-2xl border border-white/20 bg-neutral-950/80 px-3.5 py-2.5 shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
                      <Star className="h-4 w-4 fill-amber-300" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-white leading-none">Top Rated Store</p>
                      <p className="text-[10px] text-amber-300 mt-0.5">4.9 ★★★★★ (2.5k+ Reviews)</p>
                    </div>
                  </div>
                </div>

                {/* Floating Product Tag (Bottom) */}
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/15 bg-neutral-950/85 p-4 shadow-xl backdrop-blur-md">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="inline-flex items-center rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      New Season Featured
                    </span>
                    <span className="rounded-full bg-red-500/80 px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                      28% OFF
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Embroidered Chiffon & Silk Collection
                  </h3>
                  <div className="mt-2 flex items-center justify-between pt-1 border-t border-white/10">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-amber-400">₨ 6,800</span>
                      <span className="text-xs text-neutral-400 line-through">₨ 9,500</span>
                    </div>
                    <Link
                      href="/products?category=clothing"
                      className="text-xs font-semibold text-white underline hover:text-amber-300 transition-colors"
                    >
                      Shop Now →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
