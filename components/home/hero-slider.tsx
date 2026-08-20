"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Banner } from "@/types";

// ─── Fallback slides (used when DB has no HERO banners) ───────────────────────
const FALLBACK_SLIDES: Banner[] = [
  {
    id: "fallback-1",
    type: "HERO",
    title: "Activewear Tee Shirt",
    brandName: "POLO REPUBLICA",
    subtitle:
      "Crafted from lightweight, breathable fabric, it delivers a modern performance fit available in four versatile colors — Dark Grey, Plum, White, and Turquoise — making it a reliable staple for both gym sessions and casual wear.",
    image: "/images/hero-slide-1.jpg",
    link: "/products",
    isActive: true,
    position: 1,
  },
  {
    id: "fallback-2",
    type: "HERO",
    title: "New Arrivals",
    brandName: "EAST WEST",
    subtitle:
      "The ultimate two-piece power pairing. Designed with a tailored vest top and fluid wide-leg trousers for a sharp, seamless silhouette that offers all-day comfort.",
    image: "/images/hero-slide-2.jpg",
    link: "/products",
    isActive: true,
    position: 2,
  },
  {
    id: "fallback-3",
    type: "HERO",
    // No overlay text for this promotional image — it has text baked in
    title: "",
    brandName: "",
    subtitle: "",
    image: "/images/hero-slide-3.jpg",
    link: "/products",
    isActive: true,
    position: 3,
  },
];

// ─── Animation variants ───────────────────────────────────────────────────────
const textContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 as const } },
};

const textItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.22, ease: "easeIn" as const },
  },
};

// ─── Per-slide image positioning ──────────────────────────────────────────────
// Slide 1: runner is on the left — keep him left, text goes right
// Slide 2: models on left/right edges — text centre overlay
// Slide 3: pure promo image — fill completely, no text
const SLIDE_CONFIG: Record<
  string,
  { objectPosition: string; textSide: "right" | "center" | "none" }
> = {
  "fallback-1": { objectPosition: "left center", textSide: "right" },
  "fallback-2": { objectPosition: "center center", textSide: "center" },
  "fallback-3": { objectPosition: "center center", textSide: "none" },
};

function getConfig(id: string) {
  return (
    SLIDE_CONFIG[id] ?? { objectPosition: "center center", textSide: "right" }
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface HeroSliderProps {
  slides: Banner[];
}

const AUTOPLAY_DELAY = 5000;

export function HeroSlider({ slides }: HeroSliderProps) {
  const displaySlides = slides.length > 0 ? slides : FALLBACK_SLIDES;

  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % displaySlides.length);
    }, AUTOPLAY_DELAY);
  }, [displaySlides.length]);

  // Start autoplay on mount
  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const handleDotClick = useCallback(
    (index: number) => {
      setCurrent(index);
      startTimer(); // reset timer on manual navigate
    },
    [startTimer]
  );

  const slide = displaySlides[current];
  const cfg = getConfig(slide.id);
  const hasText = !!(slide.title || slide.brandName || slide.subtitle);

  return (
    <section
      aria-label="Hero banner slider"
      className="relative w-full select-none overflow-hidden bg-neutral-200"
    >
      {/* ── Images: crossfade via absolute stacking ── */}
      <div className="relative h-[420px] w-full sm:h-[540px] lg:h-[660px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={`img-${current}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: "easeInOut" as const }}
            className="absolute inset-0"
          >
            <Image
              src={slide.image}
              alt={slide.title || "Hero banner"}
              fill
              priority={current === 0}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: cfg.objectPosition }}
              draggable={false}
            />

            {/* Overlay — only when there's text to show */}
            {hasText && cfg.textSide !== "none" && (
              <>
                {cfg.textSide === "right" ? (
                  /* Right-side gradient: image visible on left, dark on right */
                  <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/25 to-transparent" />
                ) : (
                  /* Centre overlay: even dimming for center-text layout */
                  <div className="absolute inset-0 bg-black/30" />
                )}
              </>
            )}

            {/* Bottom fade so dot indicators are legible */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* ── Text overlay ── */}
        {hasText && cfg.textSide !== "none" && (
          <div
            className={cn(
              "absolute inset-0 z-10 flex items-center px-6 sm:px-12 lg:px-20",
              cfg.textSide === "right" && "justify-end",
              cfg.textSide === "center" && "justify-center"
            )}
          >
            <div
              className={cn(
                "w-full",
                cfg.textSide === "right" &&
                  "max-w-[320px] text-center sm:max-w-[380px] lg:max-w-[420px]",
                cfg.textSide === "center" &&
                  "max-w-[340px] text-center sm:max-w-[440px]"
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`text-${current}`}
                  variants={textContainer}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="flex flex-col items-center"
                >
                  {/* Brand name */}
                  {slide.brandName && (
                    <motion.p
                      variants={textItem}
                      className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/75 sm:text-[11px]"
                    >
                      {slide.brandName}
                    </motion.p>
                  )}

                  {/* Title */}
                  {slide.title && (
                    <motion.h1
                      variants={textItem}
                      className="text-[1.6rem] font-bold uppercase leading-tight tracking-wide text-white sm:text-[2.4rem] lg:text-[2.8rem]"
                    >
                      {slide.title}
                    </motion.h1>
                  )}

                  {/* Subtitle */}
                  {slide.subtitle && (
                    <motion.p
                      variants={textItem}
                      className="mt-3.5 text-[12.5px] leading-relaxed text-white/85 sm:text-[13.5px]"
                    >
                      {slide.subtitle}
                    </motion.p>
                  )}

                  {/* Shop Now CTA */}
                  <motion.div variants={textItem} className="mt-6 sm:mt-7">
                    <Link
                      href={slide.link ?? "/products"}
                      className="inline-flex h-10 items-center justify-center border border-white/55 bg-white/10 px-8 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-[2px] transition-all duration-200 hover:bg-white hover:text-neutral-900 sm:h-11 sm:px-10 sm:text-[11.5px]"
                    >
                      Shop Now
                    </Link>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Shop Now for promo slides with no text overlay */}
        {cfg.textSide === "none" && (
          <div className="absolute inset-x-0 bottom-12 z-10 flex justify-center sm:bottom-14">
            <Link
              href={slide.link ?? "/products"}
              className="inline-flex h-10 items-center justify-center border border-white/55 bg-white/10 px-8 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-[2px] transition-all duration-200 hover:bg-white hover:text-neutral-900 sm:h-11 sm:px-10 sm:text-[11.5px]"
            >
              Shop Now
            </Link>
          </div>
        )}
      </div>

      {/* ── Dot indicators ── */}
      {displaySlides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-[7px] sm:bottom-5">
          {displaySlides.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "rounded-full transition-all duration-300",
                i === current
                  ? "h-[5px] w-6 bg-white shadow-sm"
                  : "h-[5px] w-[5px] bg-white/45 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
