"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroStats = [
  { label: "Products", value: "10K+" },
  { label: "Brands", value: "500+" },
  { label: "Happy Buyers", value: "50K+" },
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-[72vh] items-center overflow-hidden bg-neutral-950 sm:min-h-[82vh]">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
          alt="Hero background"
          fill
          className="object-cover opacity-25"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_35%),linear-gradient(90deg,_rgba(10,10,10,0.95),_rgba(10,10,10,0.84),_rgba(10,10,10,0.42),_transparent)]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-amber-300 sm:text-xs">
                <Sparkles className="h-3.5 w-3.5 fill-amber-300" />
                New Season
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-black leading-[0.96] tracking-[-0.06em] text-white sm:text-5xl lg:text-7xl"
            >
              Luxury
              <span className="block bg-gradient-to-r from-amber-300 via-yellow-100 to-orange-300 bg-clip-text text-transparent">
                Redefined
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-3 text-sm font-medium tracking-[0.22em] text-amber-300 uppercase sm:text-base"
            >
              New Collection 2025
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 max-w-md text-sm leading-relaxed text-neutral-300 sm:text-base"
            >
              Premium fashion, electronics, and lifestyle essentials curated for people who expect more from every purchase.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <Link href="/products">
                <Button size="lg" variant="gold" className="group h-11 gap-2 px-6 text-sm shadow-[0_12px_30px_rgba(245,158,11,0.35)] sm:h-12 sm:px-8 sm:text-base">
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                  Shop Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="outline"
                  className="h-11 border-white/25 bg-white/5 px-6 text-sm text-white hover:border-white/50 hover:bg-white/10 sm:h-12 sm:px-8 sm:text-base">
                  Explore
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-5 sm:gap-8"
            >
              {heroStats.map((s) => (
                <div key={s.label} className="min-w-[90px]">
                  <p className="text-xl font-black text-white sm:text-2xl">{s.value}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-neutral-400 sm:text-xs">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto w-full max-w-md lg:justify-self-end"
          >
            <div className="absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-amber-400/20 via-orange-500/10 to-transparent blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-[#f9f6f2]">
                <Image
                  src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&q=80"
                  alt="Featured product"
                  width={900}
                  height={1100}
                  className="h-[470px] w-full object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/20 to-transparent p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100">
                      <Star className="mr-1 h-3 w-3 fill-amber-300" />
                      Best Seller
                    </span>
                    <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-white">
                      30% OFF
                    </span>
                  </div>

                  <div className="space-y-1 text-white">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-300">Signature Collection</p>
                    <h3 className="text-2xl font-black tracking-tight">Sapphire Luxe</h3>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-lg font-bold text-amber-300">₨ 18,999</span>
                      <span className="text-sm text-neutral-200 line-through">₨ 27,999</span>
                    </div>
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
