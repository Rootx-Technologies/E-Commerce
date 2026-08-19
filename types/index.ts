// ─── User & Auth ────────────────────────────────────────────────────────────

export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  credits: number;
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  colorHex?: string;
  stock: number;
  price?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  parentId?: string | null;
  parent?: { id: string; name: string } | null;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  images: ProductImage[];
  variants: ProductVariant[];
  category: Category;
  brand?: Brand | null;
  tags: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  discount?: number | null;
  createdAt: string;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  product: Product;
  variantId?: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type PaymentMethod = "STRIPE" | "COD";

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  user: User;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  creditsUsed: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  user: Pick<User, "id" | "name" | "image">;
  product: Pick<Product, "id" | "name">;
  rating: number;
  title?: string;
  body: string;
  isVerified: boolean;
  createdAt: string;
}

// ─── Coupon ───────────────────────────────────────────────────────────────────

export type DiscountType = "PERCENTAGE" | "FIXED";

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

// ─── Offer / Banner ───────────────────────────────────────────────────────────

export type OfferType =
  | "FLASH_SALE"
  | "DAILY_DEAL"
  | "BUNDLE"
  | "BOGO"
  | "SEASONAL";

export interface Offer {
  id: string;
  title: string;
  description?: string;
  type: OfferType;
  discountValue: number;
  discountType: DiscountType;
  startDate: string;
  endDate: string;
  isActive: boolean;
  products: Product[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  isActive: boolean;
  position: number;
}

// ─── Loyalty Credits ──────────────────────────────────────────────────────────

export type CreditTransactionType =
  | "EARNED_PURCHASE"
  | "EARNED_REFERRAL"
  | "EARNED_PROMOTION"
  | "REDEEMED"
  | "EXPIRED";

export interface CreditTransaction {
  id: string;
  userId: string;
  type: CreditTransactionType;
  amount: number;
  description: string;
  createdAt: string;
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export type NotificationType =
  | "ORDER_UPDATE"
  | "DELIVERY_UPDATE"
  | "PROMOTION"
  | "CREDIT"
  | "SYSTEM";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  search?: string;
  sort?: ProductSortOption;
  page?: number;
  limit?: number;
}

export type ProductSortOption =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "popular"
  | "discount";

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
  recentOrders: Order[];
  topProducts: Product[];
  salesByMonth: { month: string; revenue: number; orders: number }[];
}
