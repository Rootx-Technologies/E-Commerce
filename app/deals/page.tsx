import type { Metadata } from "next";
import { DealsClient } from "./deals-client";
import { db } from "@/lib/db";
import { SITE_NAME } from "@/lib/constants";
import type { Product } from "@/types";

export const metadata: Metadata = {
  title: "Deals & Offers",
  description: `Flash sales, daily deals and exclusive discounts at ${SITE_NAME}.`,
};

export const revalidate = 60;

export default async function DealsPage() {
  const flashSaleEnd = new Date(Date.now() + 6 * 60 * 60 * 1000);

  // Fetch all active products with discounts
  const allProducts = await db.product.findMany({
    where: { isActive: true, comparePrice: { not: null } },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { images: true, variants: true, category: true, brand: true },
  });

  // If not enough discounted products, use all active products
  const fallback = await db.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { images: true, variants: true, category: true, brand: true },
  });

  const pool = allProducts.length >= 6 ? allProducts : fallback;

  // Flash sale — extra 25% off
  const flashProducts = pool.slice(0, 6).map((p) => ({
    ...p,
    comparePrice: p.comparePrice ?? Math.round(p.price * 1.6),
    price: Math.round(p.price * 0.75),
  }));

  // Daily deals — 20% off
  const dailyDeals = pool.slice(0, 8).map((p) => ({
    ...p,
    comparePrice: p.comparePrice ?? Math.round(p.price * 1.25),
    price: Math.round(p.price * 0.8),
  }));

  // Women / Fashion specials
  const specialProducts = await db.product.findMany({
    where: {
      isActive: true,
      category: { slug: { in: ["womens-fashion", "fragrances"] } },
    },
    take: 6,
    include: { images: true, variants: true, category: true, brand: true },
  });

  const seasonalProducts = specialProducts.length > 0 ? specialProducts.map((p) => ({
    ...p,
    comparePrice: p.comparePrice ?? Math.round(p.price * 1.5),
    price: Math.round(p.price * 0.7),
  })) : dailyDeals.slice(0, 4);

  // Bundle deals
  const bundleProducts = pool.slice(4, 8);

  return (
    <DealsClient
      flashProducts={flashProducts as unknown as Product[]}
      flashSaleEnd={flashSaleEnd}
      dailyDeals={dailyDeals as unknown as Product[]}
      ramadanProducts={seasonalProducts as unknown as Product[]}
      bundleProducts={bundleProducts as unknown as Product[]}
    />
  );
}
