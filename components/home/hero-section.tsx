"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#1a56a8]">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-banner.png"
          alt="Modern East West Co-Ord in sky blue"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#1a56a8]/25 sm:bg-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[min(92%,42rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#1a56a8]/35 to-transparent sm:via-[#1a56a8]/15" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[520px] w-full max-w-3xl flex-col items-center justify-center px-5 py-16 text-center sm:min-h-[600px] sm:px-8 lg:min-h-[680px] lg:py-20">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white sm:text-xs"
        >
          Cool Comfort in Sky Blue
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className={cn(
            playfair.className,
            "mt-4 text-[2rem] font-medium leading-tight text-white sm:text-5xl lg:text-[3.5rem]"
          )}
        >
          Modern East West{" "}
          <span className="relative inline-block whitespace-nowrap px-2">
            Co-Ord
            <svg
              aria-hidden
              viewBox="0 0 140 56"
              preserveAspectRatio="none"
              className="pointer-events-none absolute -inset-x-1 -inset-y-1 h-[calc(100%+0.55rem)] w-[calc(100%+0.4rem)]"
            >
              <ellipse
                cx="70"
                cy="28"
                rx="64"
                ry="20"
                fill="none"
                stroke="#c45c26"
                strokeWidth="2.4"
                transform="rotate(-6 70 28)"
              />
            </svg>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-5 max-w-lg text-[13px] leading-relaxed text-white/95 sm:mt-6 sm:text-[15px]"
        >
          Crafted in a breezy sky-blue textured finish with subtle neck pleats and wide-leg trousers, this versatile two-piece co-ord set delivers complete everyday elegance for just Rs. 3,499
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="mt-7 sm:mt-8"
        >
          <Link
            href="/products"
            className="inline-flex h-11 items-center justify-center bg-white px-8 text-[12px] font-semibold uppercase tracking-[0.18em] text-neutral-950 transition-colors hover:bg-neutral-100 sm:h-12 sm:px-10 sm:text-[13px]"
          >
            Shop Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
