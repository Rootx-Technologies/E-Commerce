"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Banner } from "@/types";

interface PromotionalBannerProps {
  banners: Banner[];
}

// Fallback banners jab DB mein koi PROMOTIONAL banner na ho
const fallbackBanners: Banner[] = [
  {
    id: "f1",
    type: "PROMOTIONAL",
    title: "New Season Collection",
    subtitle: "Up to 50% off selected items",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    link: "/deals",
    isActive: true,
    position: 1,
  },
  {
    id: "f2",
    type: "PROMOTIONAL",
    title: "New Electronics",
    subtitle: "Latest gadgets at best prices",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
    link: "/products?category=electronics",
    isActive: true,
    position: 2,
  },
];

const gradients = [
  "from-amber-900/80 to-amber-700/70",
  "from-neutral-900/80 to-neutral-700/70",
  "from-emerald-900/80 to-emerald-700/70",
  "from-blue-900/80 to-blue-700/70",
  "from-violet-900/80 to-violet-700/70",
  "from-rose-900/80 to-rose-700/70",
];

export function PromotionalBanner({ banners }: PromotionalBannerProps) {
  const displayBanners = banners.length > 0 ? banners : fallbackBanners;
  // Show max 2 banners side by side (or 1 if only 1 exists — full width)
  const visible = displayBanners.slice(0, 2);

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 gap-4 sm:gap-6 ${visible.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {visible.map((banner, i) => (
            <Link
              key={banner.id}
              href={banner.link ?? "/products"}
              className="relative"
            >
              <motion.div
                className="group relative overflow-hidden rounded-2xl h-40 sm:h-52 lg:h-64"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${gradients[i % gradients.length]}`} />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8">
                  <h3 className="text-lg sm:text-2xl font-bold text-white leading-tight">
                    {banner.title}
                  </h3>
                  {banner.subtitle && (
                    <p className="mt-1 text-xs sm:text-sm text-white/80 max-w-xs">
                      {banner.subtitle}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white group-hover:gap-3 transition-all duration-200">
                    Shop Now
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
