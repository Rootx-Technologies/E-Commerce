/**
 * Prisma Seed Script — Fresh 5 Main Categories & Subcategories + New Products
 * Run: npx tsx prisma/seed.ts
 */

import fs from "fs";
import path from "path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

let dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    const match = content.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
    if (match) dbUrl = match[1];
  }
}
if (!dbUrl) {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    const match = content.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
    if (match) dbUrl = match[1];
  }
}

const adapter = new PrismaPg({ connectionString: dbUrl ?? "" });
const prisma = new PrismaClient({ adapter });

const MAIN_CATEGORIES_TREE = [
  {
    name: "Clothing",
    slug: "clothing",
    image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&q=80",
    description: "Premium fashion for Men, Women and Kids",
    subs: [
      { name: "Men",   slug: "clothing-men",   image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&q=80" },
      { name: "Women", slug: "clothing-women", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80" },
      { name: "Kids",  slug: "clothing-kids",  image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&q=80" },
    ],
  },
  {
    name: "Shoes",
    slug: "shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    description: "Footwear collection for Men, Women and Kids",
    subs: [
      { name: "Men",   slug: "shoes-men",   image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&q=80" },
      { name: "Women", slug: "shoes-women", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80" },
      { name: "Kids",  slug: "shoes-kids",  image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&q=80" },
    ],
  },
  {
    name: "Bags",
    slug: "bags",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    description: "Handbags, Backpacks and Wallets",
    subs: [
      { name: "Handbags",  slug: "bags-handbags",  image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80" },
      { name: "Backpacks", slug: "bags-backpacks", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80" },
      { name: "Wallets",   slug: "bags-wallets",   image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80" },
    ],
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    description: "Caps, Belts, Sunglasses and Jewelry",
    subs: [
      { name: "Caps",       slug: "accessories-caps",       image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80" },
      { name: "Belts",      slug: "accessories-belts",      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80" },
      { name: "Sunglasses", slug: "accessories-sunglasses", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80" },
      { name: "Jewelry",    slug: "accessories-jewelry",    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80" },
    ],
  },
  {
    name: "Perfumes",
    slug: "perfumes",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80",
    description: "Luxury fragrances for Men, Women and Unisex",
    subs: [
      { name: "Men",    slug: "perfumes-men",    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80" },
      { name: "Women",  slug: "perfumes-women",  image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80" },
      { name: "Unisex", slug: "perfumes-unisex", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80" },
    ],
  },
];

const BRANDS = [
  { name: "Khaadi",            slug: "khaadi" },
  { name: "Gul Ahmed",         slug: "gul-ahmed" },
  { name: "Bonanza Satrangi",  slug: "bonanza-satrangi" },
  { name: "Sapphire",          slug: "sapphire" },
  { name: "Alkaram",           slug: "alkaram" },
  { name: "Sana Safinaz",      slug: "sana-safinaz" },
  { name: "Zara",              slug: "zara" },
  { name: "Nike",              slug: "nike" },
  { name: "Adidas",            slug: "adidas" },
];

const FRESH_PRODUCTS = [
  // Clothing - Men
  {
    name: "Men's Designer Embroidered Kurta",
    slug: "mens-designer-embroidered-kurta",
    description: "Premium cotton designer kurta crafted with intricate embroidery for formal and festive occasions.",
    price: 3800, comparePrice: 5200,
    categorySlug: "clothing-men", brandSlug: "khaadi",
    tags: ["kurta", "men", "festive", "cotton"],
    stock: 45, rating: 4.8, reviewCount: 124,
    isFeatured: true, isNew: true, isBestSeller: true, isTrending: false,
    images: [{ url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", alt: "Men's Kurta", isPrimary: true }],
  },
  {
    name: "Slim Fit Casual Cotton Shirt",
    slug: "slim-fit-casual-cotton-shirt",
    description: "Classic slim fit button-up cotton shirt designed for everyday modern style.",
    price: 2900, comparePrice: 4000,
    categorySlug: "clothing-men", brandSlug: "zara",
    tags: ["shirt", "men", "casual"],
    stock: 50, rating: 4.6, reviewCount: 88,
    isFeatured: false, isNew: true, isBestSeller: false, isTrending: true,
    images: [{ url: "https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=600&q=80", alt: "Casual Shirt", isPrimary: true }],
  },

  // Clothing - Women
  {
    name: "Embroidered Chiffon 3-Piece Suit",
    slug: "embroidered-chiffon-3-piece-suit",
    description: "Luxury embroidered 3-piece chiffon lawn suit with hand-printed silk dupatta.",
    price: 6800, comparePrice: 9500,
    categorySlug: "clothing-women", brandSlug: "gul-ahmed",
    tags: ["suit", "chiffon", "women", "lawn"],
    stock: 30, rating: 4.9, reviewCount: 210,
    isFeatured: true, isNew: true, isBestSeller: true, isTrending: true,
    images: [{ url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80", alt: "Chiffon Suit", isPrimary: true }],
  },
  {
    name: "Handwoven Kashmiri Shawl",
    slug: "handwoven-kashmiri-shawl",
    description: "Elegant traditional handwoven Kashmiri wool shawl with rich floral embroidery.",
    price: 5200, comparePrice: 7500,
    categorySlug: "clothing-women", brandSlug: "sana-safinaz",
    tags: ["shawl", "women", "kashmiri"],
    stock: 25, rating: 4.7, reviewCount: 95,
    isFeatured: false, isNew: false, isBestSeller: true, isTrending: false,
    images: [{ url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80", alt: "Kashmiri Shawl", isPrimary: true }],
  },

  // Clothing - Kids
  {
    name: "Kids Festive Cotton Kurta Set",
    slug: "kids-festive-cotton-kurta-set",
    description: "Soft breathable cotton festive kurta and pajama set for boys.",
    price: 2400, comparePrice: 3200,
    categorySlug: "clothing-kids", brandSlug: "bonanza-satrangi",
    tags: ["kids", "kurta", "festive"],
    stock: 40, rating: 4.7, reviewCount: 56,
    isFeatured: false, isNew: true, isBestSeller: false, isTrending: false,
    images: [{ url: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80", alt: "Kids Kurta Set", isPrimary: true }],
  },

  // Shoes - Men
  {
    name: "Handcrafted Leather Oxford Shoes",
    slug: "handcrafted-leather-oxford-shoes",
    description: "Genuine leather Oxford formal shoes with anti-slip cushioned sole.",
    price: 9800, comparePrice: 14000,
    categorySlug: "shoes-men", brandSlug: "zara",
    tags: ["shoes", "leather", "oxford", "formal"],
    stock: 20, rating: 4.8, reviewCount: 164,
    isFeatured: true, isNew: false, isBestSeller: true, isTrending: false,
    images: [{ url: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80", alt: "Oxford Shoes", isPrimary: true }],
  },
  {
    name: "Pro Performance Running Sneakers",
    slug: "pro-performance-running-sneakers",
    description: "High-performance breathable running shoes with ultra-boost comfort response.",
    price: 8600, comparePrice: 12000,
    categorySlug: "shoes-men", brandSlug: "nike",
    tags: ["sneakers", "running", "sports"],
    stock: 35, rating: 4.9, reviewCount: 420,
    isFeatured: true, isNew: true, isBestSeller: false, isTrending: true,
    images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", alt: "Running Sneakers", isPrimary: true }],
  },

  // Shoes - Women
  {
    name: "Embellished Traditional Khussa",
    slug: "embellished-traditional-khussa",
    description: "Handmade velvet embroidered traditional khussa with comfortable inner lining.",
    price: 3400, comparePrice: 4800,
    categorySlug: "shoes-women", brandSlug: "alkaram",
    tags: ["khussa", "women", "shoes", "traditional"],
    stock: 40, rating: 4.6, reviewCount: 112,
    isFeatured: false, isNew: true, isBestSeller: true, isTrending: false,
    images: [{ url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80", alt: "Embellished Khussa", isPrimary: true }],
  },

  // Shoes - Kids
  {
    name: "Kids Light-Up Sports Sneakers",
    slug: "kids-light-up-sports-sneakers",
    description: "Durable and lightweight sport sneakers with LED lights for active kids.",
    price: 3200, comparePrice: 4500,
    categorySlug: "shoes-kids", brandSlug: "adidas",
    tags: ["kids", "sneakers", "sports"],
    stock: 30, rating: 4.5, reviewCount: 68,
    isFeatured: false, isNew: true, isBestSeller: false, isTrending: false,
    images: [{ url: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&q=80", alt: "Kids Sneakers", isPrimary: true }],
  },

  // Bags - Handbags
  {
    name: "Italian Leather Designer Tote Handbag",
    slug: "italian-leather-designer-tote-handbag",
    description: "Luxurious genuine leather tote bag with gold-plated metallic hardware.",
    price: 12800, comparePrice: 17500,
    categorySlug: "bags-handbags", brandSlug: "zara",
    tags: ["handbag", "leather", "women", "tote"],
    stock: 18, rating: 4.9, reviewCount: 155,
    isFeatured: true, isNew: true, isBestSeller: true, isTrending: false,
    images: [{ url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", alt: "Leather Handbag", isPrimary: true }],
  },

  // Bags - Backpacks
  {
    name: "Water-Resistant Laptop Backpack",
    slug: "water-resistant-laptop-backpack",
    description: "Ergonomic 30L laptop travel backpack with USB charging port and anti-theft pocket.",
    price: 5600, comparePrice: 7800,
    categorySlug: "bags-backpacks", brandSlug: "nike",
    tags: ["backpack", "laptop", "bag"],
    stock: 28, rating: 4.7, reviewCount: 190,
    isFeatured: false, isNew: false, isBestSeller: true, isTrending: true,
    images: [{ url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", alt: "Laptop Backpack", isPrimary: true }],
  },

  // Bags - Wallets
  {
    name: "Bifold Genuine Leather Wallet",
    slug: "bifold-genuine-leather-wallet",
    description: "Slim RFID-blocking genuine cowhide leather wallet with multiple card slots.",
    price: 2400, comparePrice: 3500,
    categorySlug: "bags-wallets", brandSlug: "zara",
    tags: ["wallet", "leather", "accessories"],
    stock: 55, rating: 4.8, reviewCount: 230,
    isFeatured: false, isNew: true, isBestSeller: false, isTrending: false,
    images: [{ url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80", alt: "Leather Wallet", isPrimary: true }],
  },

  // Accessories - Caps
  {
    name: "Adjustable Embroidered Baseball Cap",
    slug: "adjustable-embroidered-baseball-cap",
    description: "Classic 100% cotton adjustable baseball cap with breathable eyelets.",
    price: 1800, comparePrice: 2600,
    categorySlug: "accessories-caps", brandSlug: "nike",
    tags: ["cap", "baseball", "accessories"],
    stock: 60, rating: 4.5, reviewCount: 78,
    isFeatured: false, isNew: true, isBestSeller: false, isTrending: false,
    images: [{ url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80", alt: "Baseball Cap", isPrimary: true }],
  },

  // Accessories - Belts
  {
    name: "Reversible Genuine Leather Belt",
    slug: "reversible-genuine-leather-belt",
    description: "Premium reversible black and brown leather belt with polished alloy buckle.",
    price: 2600, comparePrice: 3800,
    categorySlug: "accessories-belts", brandSlug: "zara",
    tags: ["belt", "leather", "accessories"],
    stock: 40, rating: 4.6, reviewCount: 104,
    isFeatured: false, isNew: false, isBestSeller: true, isTrending: false,
    images: [{ url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", alt: "Leather Belt", isPrimary: true }],
  },

  // Accessories - Sunglasses
  {
    name: "Polarized Classic Aviator Sunglasses",
    slug: "polarized-classic-aviator-sunglasses",
    description: "UV400 protection polarized classic metal frame aviator sunglasses.",
    price: 4500, comparePrice: 6500,
    categorySlug: "accessories-sunglasses", brandSlug: "zara",
    tags: ["sunglasses", "aviator", "accessories"],
    stock: 35, rating: 4.8, reviewCount: 142,
    isFeatured: true, isNew: true, isBestSeller: false, isTrending: true,
    images: [{ url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80", alt: "Aviator Sunglasses", isPrimary: true }],
  },

  // Accessories - Jewelry
  {
    name: "18K Gold Plated Crystal Heart Ring Set",
    slug: "18k-gold-plated-crystal-heart-ring-set",
    description: "Exquisite 18k gold-plated stackable ring set with sparkling zirconia crystals.",
    price: 3900, comparePrice: 5800,
    categorySlug: "accessories-jewelry", brandSlug: "sapphire",
    tags: ["jewelry", "ring", "gold", "women"],
    stock: 30, rating: 4.9, reviewCount: 188,
    isFeatured: true, isNew: true, isBestSeller: true, isTrending: false,
    images: [{ url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80", alt: "Gold Ring Set", isPrimary: true }],
  },

  // Perfumes - Men
  {
    name: "Royal Oud Intense EDP 100ml",
    slug: "royal-oud-intense-edp-100ml",
    description: "Sophisticated long-lasting wood and spice EDP cologne for men.",
    price: 5800, comparePrice: 8200,
    categorySlug: "perfumes-men", brandSlug: "alkaram",
    tags: ["perfume", "oud", "men", "fragrance"],
    stock: 45, rating: 4.9, reviewCount: 290,
    isFeatured: true, isNew: true, isBestSeller: true, isTrending: true,
    images: [{ url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80", alt: "Royal Oud Perfume", isPrimary: true }],
  },

  // Perfumes - Women
  {
    name: "Velvet Rose & Jasmine EDP 100ml",
    slug: "velvet-rose-jasmine-edp-100ml",
    description: "Enchanting floral oriental EDP fragrance infused with wild rose and vanilla.",
    price: 5200, comparePrice: 7500,
    categorySlug: "perfumes-women", brandSlug: "sapphire",
    tags: ["perfume", "rose", "women", "fragrance"],
    stock: 40, rating: 4.8, reviewCount: 215,
    isFeatured: true, isNew: false, isBestSeller: true, isTrending: false,
    images: [{ url: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80", alt: "Velvet Rose Perfume", isPrimary: true }],
  },

  // Perfumes - Unisex
  {
    name: "Smokey Amber & White Musk Cologne",
    slug: "smokey-amber-white-musk-cologne",
    description: "Luxurious oriental unisex fragrance with warm amber and velvety musk notes.",
    price: 6200, comparePrice: 9000,
    categorySlug: "perfumes-unisex", brandSlug: "khaadi",
    tags: ["perfume", "amber", "unisex", "fragrance"],
    stock: 35, rating: 4.7, reviewCount: 175,
    isFeatured: false, isNew: true, isBestSeller: false, isTrending: true,
    images: [{ url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80", alt: "Amber Cologne", isPrimary: true }],
  },
];

async function main() {
  console.log("🌱 Clearing old database items & Seeding fresh data...\n");

  // 1. Admin User
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
  console.log("✅ Admin user verified:", admin.email);

  // 2. Clear old database items (Reviews, OrderItems, WishlistItems, ProductImages, ProductVariants, Products, Categories)
  await prisma.review.deleteMany({}).catch(() => {});
  await prisma.orderItem.deleteMany({}).catch(() => {});
  await prisma.wishlistItem.deleteMany({}).catch(() => {});
  await prisma.productImage.deleteMany({}).catch(() => {});
  await prisma.productVariant.deleteMany({}).catch(() => {});
  await prisma.product.deleteMany({}).catch(() => {});
  await prisma.category.deleteMany({}).catch(() => {});
  console.log("🗑️ Cleared all old products & categories.");

  // 3. Seed Brands
  const createdBrandMap: Record<string, string> = {};
  for (const b of BRANDS) {
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name },
      create: { name: b.name, slug: b.slug },
    });
    createdBrandMap[b.slug] = brand.id;
  }
  console.log(`✅ ${BRANDS.length} brands ready.`);

  // 4. Seed 5 Main Categories + 16 Subcategories
  const createdSubMap: Record<string, string> = {};
  for (const mainCat of MAIN_CATEGORIES_TREE) {
    const parent = await prisma.category.create({
      data: {
        name: mainCat.name,
        slug: mainCat.slug,
        image: mainCat.image,
        description: mainCat.description,
      },
    });

    for (const sub of mainCat.subs) {
      const child = await prisma.category.create({
        data: {
          name: sub.name,
          slug: sub.slug,
          image: sub.image,
          parentId: parent.id,
        },
      });
      createdSubMap[sub.slug] = child.id;
    }
  }
  console.log("✅ 5 Main Categories & 16 Subcategories created.");

  // 5. Seed Fresh Products
  let count = 0;
  for (const p of FRESH_PRODUCTS) {
    const categoryId = createdSubMap[p.categorySlug];
    const brandId = createdBrandMap[p.brandSlug];

    if (!categoryId) {
      console.warn(`⚠️ Category not found for ${p.categorySlug}`);
      continue;
    }

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
      },
    });
    count++;
  }

  console.log(`✅ ${count} fresh products seeded across all subcategories!`);
  console.log("\n─────────────────────────────────────");
  console.log("🎉 Database seeding complete!");
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
