export const SITE_NAME = "Marqet";
export const SITE_DESCRIPTION =
  "Premium e-commerce destination for luxury fashion, footwear, and branded products.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const CURRENCY = "PKR";
export const CURRENCY_SYMBOL = "₨";

export const SHIPPING_THRESHOLD = 5000; // Free shipping above this amount
export const SHIPPING_COST = 250;
export const TAX_RATE = 0.17; // 17% GST

export const CREDITS_PER_PURCHASE = 0.02; // 2% of order value as credits
export const CREDITS_REFERRAL = 500;
export const CREDITS_VALUE = 1; // 1 credit = 1 PKR

export const ITEMS_PER_PAGE = 12;
export const SEARCH_DEBOUNCE_MS = 350;

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Brands", href: "/brands" },
  { label: "Deals", href: "/deals" },
  { label: "About", href: "/about" },
] as const;

export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Most Popular", value: "popular" },
  { label: "Biggest Discount", value: "discount" },
] as const;

export const PRODUCT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] as const;

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/faizan",
  facebook: "https://facebook.com/faizan",
  twitter: "https://twitter.com/faizan",
  youtube: "https://youtube.com/faizan",
} as const;

export const MAIN_CATEGORIES = [
  {
    name: "Clothing",
    slug: "clothing",
    emoji: "👕",
    subs: [
      { name: "Men", slug: "clothing-men" },
      { name: "Women", slug: "clothing-women" },
      { name: "Kids", slug: "clothing-kids" },
    ],
  },
  {
    name: "Shoes",
    slug: "shoes",
    emoji: "👟",
    subs: [
      { name: "Men", slug: "shoes-men" },
      { name: "Women", slug: "shoes-women" },
      { name: "Kids", slug: "shoes-kids" },
    ],
  },
  {
    name: "Bags",
    slug: "bags",
    emoji: "👜",
    subs: [
      { name: "Handbags", slug: "bags-handbags" },
      { name: "Backpacks", slug: "bags-backpacks" },
      { name: "Wallets", slug: "bags-wallets" },
    ],
  },
  {
    name: "Accessories",
    slug: "accessories",
    emoji: "🕶️",
    subs: [
      { name: "Caps", slug: "accessories-caps" },
      { name: "Belts", slug: "accessories-belts" },
      { name: "Sunglasses", slug: "accessories-sunglasses" },
      { name: "Jewelry", slug: "accessories-jewelry" },
    ],
  },
  {
    name: "Perfumes",
    slug: "perfumes",
    emoji: "🌸",
    subs: [
      { name: "Men", slug: "perfumes-men" },
      { name: "Women", slug: "perfumes-women" },
    ],
  },
] as const;

