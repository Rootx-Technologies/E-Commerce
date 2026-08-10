import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesBar } from "@/components/home/features-bar";
import { CategoriesSection } from "@/components/home/categories-section";
import { ProductGrid } from "@/components/products/product-grid";
import { SectionHeader } from "@/components/home/section-header";
import { FlashSaleSection } from "@/components/home/flash-sale-section";
import { PromotionalBanner } from "@/components/home/promotional-banner";
import { AnnouncementBar } from "@/components/home/announcement-bar";
import { BrandShowcase } from "@/components/home/brand-showcase";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { db } from "@/lib/db";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import type { Product, Category, Brand } from "@/types";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Premium E-Commerce`,
  description: SITE_DESCRIPTION,
};

export const revalidate = 300;

export default async function HomePage() {
  const [
    featuredProducts,
    newArrivals,
    bestSellers,
    trending,
    categories,
    brands,
    banners,
  ] = await Promise.all([
    db.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { images: true, variants: true, category: true, brand: true },
    }),
    db.product.findMany({
      where: { isActive: true, isNew: true },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { images: true, variants: true, category: true, brand: true },
    }),
    db.product.findMany({
      where: { isActive: true, isBestSeller: true },
      take: 8,
      orderBy: { reviewCount: "desc" },
      include: { images: true, variants: true, category: true, brand: true },
    }),
    db.product.findMany({
      where: { isActive: true, isTrending: true },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { images: true, variants: true, category: true, brand: true },
    }),
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.brand.findMany({ orderBy: { name: "asc" } }),
    db.banner.findMany({
      where: { isActive: true },
      orderBy: { position: "asc" },
    }),
  ]);

  // Flash sale — top 5 featured products with extra discount
  const flashSaleProducts = featuredProducts.slice(0, 5).map((p) => ({
    ...p,
    comparePrice: p.comparePrice ?? Math.round(p.price * 1.4),
    price: Math.round(p.price * 0.75),
  }));

  const flashSaleEnd = new Date(Date.now() + 8 * 60 * 60 * 1000);

  // Top banner for announcement bar (position 0 or first banner with no link used as announcement)
  const announcementBanner = banners.find((b) => b.position === 0);
  const promotionalBanners = banners.filter((b) => b.position !== 0);

  return (
    <>
      {/* Announcement Bar — admin se add/control karo */}
      {announcementBanner && (
        <AnnouncementBar
          message={`🇵🇰 ${announcementBanner.title}${announcementBanner.subtitle ? ` — ${announcementBanner.subtitle}` : ""}`}
          link={announcementBanner.link}
          bgColor="bg-green-700"
        />
      )}

      <HeroSection />
      <FeaturesBar />

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Featured Products"
              subtitle="Handpicked"
              viewAllHref="/products?filter=featured"
            />
            <ProductGrid products={featuredProducts as unknown as Product[]} columns={4} />
          </div>
        </section>
      )}

      <CategoriesSection categories={categories as unknown as Category[]} />

      {/* Flash Sale */}
      {flashSaleProducts.length > 0 && (
        <FlashSaleSection
          products={flashSaleProducts as unknown as Product[]}
          endTime={flashSaleEnd}
        />
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="New Arrivals"
              subtitle="Just In"
              viewAllHref="/products?filter=new"
            />
            <ProductGrid products={newArrivals as unknown as Product[]} columns={4} />
          </div>
        </section>
      )}

      {/* Promotional Banners — DB se (admin se control karo) */}
      <PromotionalBanner banners={promotionalBanners} />

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="py-16 bg-neutral-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Best Sellers"
              subtitle="Top Picks"
              viewAllHref="/products?filter=bestseller"
            />
            <ProductGrid products={bestSellers as unknown as Product[]} columns={4} />
          </div>
        </section>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Trending Now"
              subtitle="Hot Right Now"
              viewAllHref="/products?filter=trending"
            />
            <ProductGrid products={trending as unknown as Product[]} columns={4} />
          </div>
        </section>
      )}

      <BrandShowcase brands={brands as unknown as Brand[]} />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
