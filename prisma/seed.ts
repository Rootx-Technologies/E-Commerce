/**
 * Prisma Seed Script
 * Run: npx tsx prisma/seed.ts
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL ?? "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...\n");

  // ─── Admin User ────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@faizan.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@faizan.com",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: true,
      referralCode: "ADMIN001",
    },
  });
  console.log("✅ Admin user:", admin.email);

  // ─── Categories ────────────────────────────────────────────────────────────
  const categoriesData = [
    { name: "Men's Fashion",      slug: "mens-fashion",      image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&q=80",  description: "Shirts, kurtas, trousers and more" },
    { name: "Women's Fashion",    slug: "womens-fashion",    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80",  description: "Dresses, suits, shalwar kameez" },
    { name: "Electronics",        slug: "electronics",       image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80",  description: "Phones, laptops, accessories" },
    { name: "Footwear",           slug: "footwear",          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",    description: "Formal, casual and sports footwear" },
    { name: "Bags & Accessories", slug: "bags-accessories",  image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",    description: "Bags, wallets, belts" },
    { name: "Fragrances",         slug: "fragrances",        image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80",  description: "Perfumes and fragrances" },
    { name: "Watches",            slug: "watches",           image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",  description: "Luxury and casual watches" },
    { name: "Home & Living",      slug: "home-living",       image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",    description: "Home decor and lifestyle" },
    { name: "Kids",               slug: "kids",              image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&q=80",  description: "Clothing and toys for children" },
  ];

  const createdCats: Record<string, string> = {};
  for (const cat of categoriesData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, image: cat.image, description: cat.description },
      create: cat,
    });
    createdCats[cat.slug] = c.id;
  }
  console.log(`✅ ${categoriesData.length} categories seeded`);

  // ─── Brands ────────────────────────────────────────────────────────────────
  const brandsData = [
    { name: "Khaadi",            slug: "khaadi" },
    { name: "Gul Ahmed",         slug: "gul-ahmed" },
    { name: "Bonanza Satrangi",  slug: "bonanza-satrangi" },
    { name: "Sapphire",          slug: "sapphire" },
    { name: "Alkaram",           slug: "alkaram" },
    { name: "Sana Safinaz",      slug: "sana-safinaz" },
    { name: "Zara",              slug: "zara" },
    { name: "Samsung",           slug: "samsung" },
    { name: "Apple",             slug: "apple" },
    { name: "Nike",              slug: "nike" },
    { name: "Adidas",            slug: "adidas" },
  ];

  const createdBrands: Record<string, string> = {};
  for (const brand of brandsData) {
    const b = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    });
    createdBrands[brand.slug] = b.id;
  }
  console.log(`✅ ${brandsData.length} brands seeded`);

  // ─── Products ─────────────────────────────────────────────────────────────
  const productsData = [
    {
      name: "Premium Lawn Suit",
      slug: "premium-lawn-suit",
      description: "Premium quality lawn suit crafted with the finest materials for ultimate comfort and style.",
      price: 3500, comparePrice: 5000,
      categorySlug: "womens-fashion", brandSlug: "gul-ahmed",
      tags: ["lawn", "suit", "women", "summer"],
      stock: 38, rating: 4.8, reviewCount: 245,
      isFeatured: true, isNew: true, isBestSeller: false, isTrending: false,
      images: [
        { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80", alt: "Premium Lawn Suit", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80", alt: "Premium Lawn Suit side view", isPrimary: false },
      ],
      variants: [
        { size: "S", stock: 10 }, { size: "M", stock: 15 },
        { size: "L", stock: 8 },  { size: "XL", stock: 5 },
      ],
    },
    {
      name: "Men's Casual Kurta",
      slug: "mens-casual-kurta",
      description: "Comfortable casual kurta perfect for everyday wear, made from premium cotton fabric.",
      price: 2200, comparePrice: 3000,
      categorySlug: "mens-fashion", brandSlug: "khaadi",
      tags: ["kurta", "casual", "men", "cotton"],
      stock: 55, rating: 4.6, reviewCount: 189,
      isFeatured: false, isNew: false, isBestSeller: true, isTrending: false,
      images: [
        { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", alt: "Men's Casual Kurta", isPrimary: true },
      ],
      variants: [
        { size: "S", stock: 12 }, { size: "M", stock: 18 },
        { size: "L", stock: 15 }, { size: "XL", stock: 10 },
      ],
    },
    {
      name: "Smart Watch Pro",
      slug: "smart-watch-pro",
      description: "Advanced smartwatch with health monitoring, GPS, and 7-day battery life.",
      price: 18500, comparePrice: 25000,
      categorySlug: "electronics", brandSlug: "samsung",
      tags: ["smartwatch", "electronics", "fitness", "wearable"],
      stock: 25, rating: 4.7, reviewCount: 312,
      isFeatured: false, isNew: false, isBestSeller: false, isTrending: true,
      images: [
        { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", alt: "Smart Watch Pro", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80", alt: "Smart Watch Pro side", isPrimary: false },
      ],
      variants: [],
    },
    {
      name: "Running Sneakers",
      slug: "running-sneakers",
      description: "High-performance running sneakers with superior cushioning and breathable mesh upper.",
      price: 8500, comparePrice: 12000,
      categorySlug: "footwear", brandSlug: "nike",
      tags: ["sneakers", "running", "sports", "shoes"],
      stock: 42, rating: 4.9, reviewCount: 567,
      isFeatured: true, isNew: false, isBestSeller: true, isTrending: false,
      images: [
        { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", alt: "Running Sneakers", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&q=80", alt: "Running Sneakers top view", isPrimary: false },
      ],
      variants: [
        { size: "40", stock: 8 }, { size: "41", stock: 10 },
        { size: "42", stock: 12 }, { size: "43", stock: 8 },
        { size: "44", stock: 4 },
      ],
    },
    {
      name: "Leather Handbag",
      slug: "leather-handbag",
      description: "Elegant genuine leather handbag with multiple compartments and premium stitching.",
      price: 12000, comparePrice: 16000,
      categorySlug: "bags-accessories", brandSlug: "zara",
      tags: ["handbag", "leather", "women", "accessories"],
      stock: 20, rating: 4.5, reviewCount: 98,
      isFeatured: false, isNew: true, isBestSeller: false, isTrending: false,
      images: [
        { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", alt: "Leather Handbag", isPrimary: true },
      ],
      variants: [],
    },
    {
      name: "Oud Perfume 100ml",
      slug: "oud-perfume-100ml",
      description: "Luxurious oud-based fragrance with rich woody notes. Long-lasting 24-hour scent.",
      price: 4500, comparePrice: 6000,
      categorySlug: "fragrances", brandSlug: "alkaram",
      tags: ["perfume", "oud", "fragrance", "luxury"],
      stock: 60, rating: 4.8, reviewCount: 203,
      isFeatured: false, isNew: false, isBestSeller: false, isTrending: true,
      images: [
        { url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80", alt: "Oud Perfume", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80", alt: "Oud Perfume bottle", isPrimary: false },
      ],
      variants: [],
    },
    {
      name: "Wireless Earbuds",
      slug: "wireless-earbuds",
      description: "Premium wireless earbuds with active noise cancellation and 30-hour total battery life.",
      price: 7500, comparePrice: 10000,
      categorySlug: "electronics", brandSlug: "apple",
      tags: ["earbuds", "wireless", "audio", "electronics"],
      stock: 35, rating: 4.6, reviewCount: 445,
      isFeatured: true, isNew: false, isBestSeller: false, isTrending: false,
      images: [
        { url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80", alt: "Wireless Earbuds", isPrimary: true },
      ],
      variants: [],
    },
    {
      name: "Embroidered Shawl",
      slug: "embroidered-shawl",
      description: "Beautifully embroidered kashmiri shawl, perfect for winter and formal occasions.",
      price: 5500, comparePrice: 7500,
      categorySlug: "womens-fashion", brandSlug: "sana-safinaz",
      tags: ["shawl", "embroidered", "women", "winter"],
      stock: 30, rating: 4.7, reviewCount: 156,
      isFeatured: false, isNew: true, isBestSeller: true, isTrending: false,
      images: [
        { url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80", alt: "Embroidered Shawl", isPrimary: true },
      ],
      variants: [],
    },
    {
      name: "Denim Jacket",
      slug: "denim-jacket",
      description: "Classic denim jacket with modern fit. Versatile style for casual and semi-formal looks.",
      price: 6500, comparePrice: 9000,
      categorySlug: "mens-fashion", brandSlug: "zara",
      tags: ["denim", "jacket", "men", "casual"],
      stock: 28, rating: 4.4, reviewCount: 87,
      isFeatured: false, isNew: false, isBestSeller: false, isTrending: true,
      images: [
        { url: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80", alt: "Denim Jacket", isPrimary: true },
      ],
      variants: [
        { size: "S", stock: 6 }, { size: "M", stock: 10 },
        { size: "L", stock: 8 }, { size: "XL", stock: 4 },
      ],
    },
    {
      name: "Luxury Watch",
      slug: "luxury-watch",
      description: "Swiss-inspired luxury timepiece with sapphire crystal glass and genuine leather strap.",
      price: 45000, comparePrice: 60000,
      categorySlug: "watches", brandSlug: "alkaram",
      tags: ["watch", "luxury", "men", "accessories"],
      stock: 12, rating: 4.9, reviewCount: 78,
      isFeatured: true, isNew: false, isBestSeller: false, isTrending: false,
      images: [
        { url: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80", alt: "Luxury Watch", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", alt: "Luxury Watch close up", isPrimary: false },
      ],
      variants: [],
    },
    {
      name: "Silk Dupatta",
      slug: "silk-dupatta",
      description: "Pure silk dupatta with hand-printed floral patterns. Elegant and lightweight.",
      price: 2800, comparePrice: 4000,
      categorySlug: "womens-fashion", brandSlug: "gul-ahmed",
      tags: ["dupatta", "silk", "women", "traditional"],
      stock: 45, rating: 4.5, reviewCount: 134,
      isFeatured: false, isNew: true, isBestSeller: false, isTrending: false,
      images: [
        { url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80", alt: "Silk Dupatta", isPrimary: true },
      ],
      variants: [],
    },
    {
      name: "Formal Oxford Shoes",
      slug: "formal-oxford-shoes",
      description: "Classic Oxford shoes crafted from genuine leather. Perfect for office and formal events.",
      price: 9500, comparePrice: 13000,
      categorySlug: "footwear", brandSlug: "adidas",
      tags: ["shoes", "formal", "oxford", "leather"],
      stock: 22, rating: 4.6, reviewCount: 221,
      isFeatured: false, isNew: false, isBestSeller: true, isTrending: false,
      images: [
        { url: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80", alt: "Formal Oxford Shoes", isPrimary: true },
      ],
      variants: [
        { size: "40", stock: 4 }, { size: "41", stock: 6 },
        { size: "42", stock: 6 }, { size: "43", stock: 4 },
        { size: "44", stock: 2 },
      ],
    },
    {
      name: "Unstitched Fabric 3 Piece",
      slug: "unstitched-fabric-3-piece",
      description: "Premium unstitched lawn 3-piece suit with embroidered neckline. Ready to stitch.",
      price: 4200, comparePrice: 6500,
      categorySlug: "womens-fashion", brandSlug: "bonanza-satrangi",
      tags: ["unstitched", "lawn", "3piece", "women"],
      stock: 50, rating: 4.7, reviewCount: 178,
      isFeatured: true, isNew: true, isBestSeller: false, isTrending: false,
      images: [
        { url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80", alt: "Unstitched Fabric 3 Piece", isPrimary: true },
      ],
      variants: [],
    },
    {
      name: "Polo T-Shirt",
      slug: "polo-t-shirt",
      description: "Classic polo t-shirt in premium pique cotton. Available in multiple colors.",
      price: 1800, comparePrice: 2500,
      categorySlug: "mens-fashion", brandSlug: "adidas",
      tags: ["polo", "tshirt", "men", "casual", "cotton"],
      stock: 80, rating: 4.3, reviewCount: 342,
      isFeatured: false, isNew: false, isBestSeller: true, isTrending: false,
      images: [
        { url: "https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=600&q=80", alt: "Polo T-Shirt", isPrimary: true },
      ],
      variants: [
        { size: "S", stock: 20 }, { size: "M", stock: 25 },
        { size: "L", stock: 20 }, { size: "XL", stock: 15 },
      ],
    },
    {
      name: "Smartphone 128GB",
      slug: "smartphone-128gb",
      description: "Latest flagship smartphone with 50MP camera, 5G connectivity and 5000mAh battery.",
      price: 65000, comparePrice: 80000,
      categorySlug: "electronics", brandSlug: "samsung",
      tags: ["smartphone", "5g", "samsung", "electronics"],
      stock: 18, rating: 4.8, reviewCount: 523,
      isFeatured: true, isNew: true, isBestSeller: false, isTrending: true,
      images: [
        { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80", alt: "Smartphone 128GB", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80", alt: "Smartphone back", isPrimary: false },
      ],
      variants: [],
    },
    {
      name: "Laptop Backpack",
      slug: "laptop-backpack",
      description: "Water-resistant laptop backpack with USB charging port and 30L capacity.",
      price: 5500, comparePrice: 7000,
      categorySlug: "bags-accessories", brandSlug: "nike",
      tags: ["backpack", "laptop", "bag", "travel"],
      stock: 35, rating: 4.5, reviewCount: 167,
      isFeatured: false, isNew: false, isBestSeller: false, isTrending: true,
      images: [
        { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", alt: "Laptop Backpack", isPrimary: true },
      ],
      variants: [],
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const p of productsData) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) { skipped++; continue; }

    const categoryId = createdCats[p.categorySlug];
    const brandId = createdBrands[p.brandSlug];

    if (!categoryId) { console.warn(`⚠️  Category not found: ${p.categorySlug}`); continue; }

    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        comparePrice: p.comparePrice,
        categoryId,
        brandId: brandId ?? null,
        tags: p.tags,
        stock: p.stock,
        rating: p.rating,
        reviewCount: p.reviewCount,
        isFeatured: p.isFeatured,
        isNew: p.isNew,
        isBestSeller: p.isBestSeller,
        isTrending: p.isTrending,
        isActive: true,
        images: {
          create: p.images.map((img) => ({
            url: img.url,
            alt: img.alt,
            isPrimary: img.isPrimary,
          })),
        },
        variants: {
          create: p.variants.map((v) => ({
            size: v.size,
            stock: v.stock,
          })),
        },
      },
    });
    created++;
  }

  console.log(`✅ ${created} products seeded, ${skipped} already existed`);

  console.log("\n─────────────────────────────────────");
  console.log("✅ Seeding complete!");
  console.log("\nAdmin Login:");
  console.log("  URL:      http://localhost:3000/admin/login");
  console.log("  Email:    admin@faizan.com");
  console.log("  Password: Admin@123");
  console.log("─────────────────────────────────────\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
