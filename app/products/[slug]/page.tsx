import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductDetailClient } from "./product-detail-client";
import { ProductGrid } from "@/components/products/product-grid";
import { SectionHeader } from "@/components/home/section-header";
import { RecentlyViewed } from "@/components/products/recently-viewed";
import type { Product } from "@/types";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug, isActive: true },
    include: { images: true },
  });
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: true,
      variants: true,
      category: true,
      brand: true,
      reviews: {
        include: { user: { select: { id: true, name: true, image: true } } },
        take: 20,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) notFound();

  // Related products — same category, different product
  const related = await db.product.findMany({
    where: {
      isActive: true,
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    take: 4,
    orderBy: { rating: "desc" },
    include: { images: true, variants: true, category: true, brand: true },
  });

  return (
    <div>
      <ProductDetailClient product={product as unknown as Product} />

      {related.length > 0 && (
        <section className="py-16 border-t border-neutral-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="You May Also Like"
              subtitle="Related"
              viewAllHref={`/products?category=${product.category.slug}`}
            />
            <ProductGrid products={related as unknown as Product[]} columns={4} />
          </div>
        </section>
      )}
      <RecentlyViewed excludeId={product.id} />
    </div>
  );
}
