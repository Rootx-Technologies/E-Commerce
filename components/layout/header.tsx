"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag, Heart, Search, Menu, X, User, LogOut, ShieldCheck, ChevronDown, ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { cn, getInitials } from "@/lib/utils";
import { SITE_NAME, NAV_LINKS, MAIN_CATEGORIES } from "@/lib/constants";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";

// Main category cards
const CATEGORY_IMAGES: Record<string, { url: string; label: string; href: string }[]> = {
  clothing: [
    { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80", label: "Women's Collection", href: "/products?category=clothing-women" },
    { url: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=500&q=80", label: "Men's Collection", href: "/products?category=clothing-men" },
    { url: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&q=80", label: "Kids Collection", href: "/products?category=clothing-kids" },
  ],
  shoes: [
    { url: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&q=80", label: "Men's Shoes", href: "/products?category=shoes-men" },
    { url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80", label: "Women's Shoes", href: "/products?category=shoes-women" },
    { url: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=500&q=80", label: "Kids Shoes", href: "/products?category=shoes-kids" },
  ],
  bags: [
    { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80", label: "Handbags", href: "/products?category=bags-handbags" },
    { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80", label: "Backpacks", href: "/products?category=bags-backpacks" },
    { url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80", label: "Wallets", href: "/products?category=bags-wallets" },
  ],
  accessories: [
    { url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80", label: "Caps & Hats", href: "/products?category=accessories-caps" },
    { url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80", label: "Sunglasses", href: "/products?category=accessories-sunglasses" },
    { url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80", label: "Jewelry", href: "/products?category=accessories-jewelry" },
  ],
  perfumes: [
    { url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&q=80", label: "Men's Fragrances", href: "/products?category=perfumes-men" },
    { url: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=500&q=80", label: "Women's Perfumes", href: "/products?category=perfumes-women" },
    { url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80", label: "Luxury Gift Sets", href: "/products?category=perfumes-women" },
  ],
};

// Sub-category specific cards (when hovering over a specific subcategory like Men/Women/Kids)
const SUBCATEGORY_CARDS: Record<string, { url: string; label: string; href: string }[]> = {
  "clothing-men": [
    { url: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=500&q=80", label: "Men's Kurta", href: "/products?category=clothing-men" },
    { url: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=500&q=80", label: "Casual Shirts", href: "/products?category=clothing-men" },
    { url: "https://images.unsplash.com/photo-1594938298603-c8148c4b5b58?w=500&q=80", label: "Formal Suits", href: "/products?category=clothing-men" },
  ],
  "clothing-women": [
    { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80", label: "Women's Lawn", href: "/products?category=clothing-women" },
    { url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80", label: "Party Dresses", href: "/products?category=clothing-women" },
    { url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&q=80", label: "Pret & Casuals", href: "/products?category=clothing-women" },
  ],
  "clothing-kids": [
    { url: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&q=80", label: "Kids Festive", href: "/products?category=clothing-kids" },
    { url: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500&q=80", label: "Boys Wear", href: "/products?category=clothing-kids" },
    { url: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500&q=80", label: "Girls Dresses", href: "/products?category=clothing-kids" },
  ],
  "shoes-men": [
    { url: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&q=80", label: "Men's Formal Shoes", href: "/products?category=shoes-men" },
    { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", label: "Men's Sneakers", href: "/products?category=shoes-men" },
    { url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", label: "Leather Loafers", href: "/products?category=shoes-men" },
  ],
  "shoes-women": [
    { url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80", label: "High Heels", href: "/products?category=shoes-women" },
    { url: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=500&q=80", label: "Sandals & Flats", href: "/products?category=shoes-women" },
    { url: "https://images.unsplash.com/photo-1583304235194-cb5b3a08b8dc?w=500&q=80", label: "Casual Sneakers", href: "/products?category=shoes-women" },
  ],
  "shoes-kids": [
    { url: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=500&q=80", label: "Kids Sneakers", href: "/products?category=shoes-kids" },
    { url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80", label: "Sport Shoes", href: "/products?category=shoes-kids" },
    { url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&q=80", label: "School Shoes", href: "/products?category=shoes-kids" },
  ],
  "bags-handbags": [
    { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80", label: "Shoulder Bags", href: "/products?category=bags-handbags" },
    { url: "https://images.unsplash.com/photo-1566150905458-1bf1a5bf08b2?w=500&q=80", label: "Tote Bags", href: "/products?category=bags-handbags" },
    { url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80", label: "Clutch Bags", href: "/products?category=bags-handbags" },
  ],
  "bags-backpacks": [
    { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80", label: "Travel Backpacks", href: "/products?category=bags-backpacks" },
    { url: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&q=80", label: "Laptop Bags", href: "/products?category=bags-backpacks" },
    { url: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=500&q=80", label: "Daypacks", href: "/products?category=bags-backpacks" },
  ],
  "bags-wallets": [
    { url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80", label: "Leather Wallets", href: "/products?category=bags-wallets" },
    { url: "https://images.unsplash.com/photo-1559841644-08984562005b?w=500&q=80", label: "Card Holders", href: "/products?category=bags-wallets" },
    { url: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&q=80", label: "Clutch Wallets", href: "/products?category=bags-wallets" },
  ],
  "accessories-caps": [
    { url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80", label: "Baseball Caps", href: "/products?category=accessories-caps" },
    { url: "https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=500&q=80", label: "Summer Hats", href: "/products?category=accessories-caps" },
    { url: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&q=80", label: "Beanies", href: "/products?category=accessories-caps" },
  ],
  "accessories-belts": [
    { url: "https://images.unsplash.com/photo-1624222247344-550d27dbd37e?w=500&q=80", label: "Leather Belts", href: "/products?category=accessories-belts" },
    { url: "https://images.unsplash.com/photo-1604652716179-3cdf17c15f41?w=500&q=80", label: "Casual Belts", href: "/products?category=accessories-belts" },
    { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80", label: "Formal Belts", href: "/products?category=accessories-belts" },
  ],
  "accessories-sunglasses": [
    { url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80", label: "Aviator Shades", href: "/products?category=accessories-sunglasses" },
    { url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80", label: "Round Frames", href: "/products?category=accessories-sunglasses" },
    { url: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500&q=80", label: "Modern Shades", href: "/products?category=accessories-sunglasses" },
  ],
  "accessories-jewelry": [
    { url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80", label: "Gold Jewelry", href: "/products?category=accessories-jewelry" },
    { url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80", label: "Silver Rings", href: "/products?category=accessories-jewelry" },
    { url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80", label: "Necklaces", href: "/products?category=accessories-jewelry" },
  ],
  "perfumes-men": [
    { url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&q=80", label: "Men's Oud", href: "/products?category=perfumes-men" },
    { url: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=500&q=80", label: "Eau de Parfum", href: "/products?category=perfumes-men" },
    { url: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500&q=80", label: "Fresh Cologne", href: "/products?category=perfumes-men" },
  ],
  "perfumes-women": [
    { url: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=500&q=80", label: "Floral Perfume", href: "/products?category=perfumes-women" },
    { url: "https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=500&q=80", label: "Rose Mist", href: "/products?category=perfumes-women" },
    { url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80", label: "Luxury Gift Sets", href: "/products?category=perfumes-women" },
  ],
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [activeMegaCategory, setActiveMegaCategory] = useState<string>("clothing");
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const categoriesTimerRef = useRef<NodeJS.Timeout | null>(null);

  const itemCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, openSearch, openCart } = useUIStore();
  const { user, clearUser, isLoggedIn, isAdmin } = useAuthStore();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    closeMobileMenu();
    setCategoriesOpen(false);
    setActiveSubCategory(null);
  }, [pathname, closeMobileMenu]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setUserMenuOpen(false);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch { /* silent */ }
    clearUser();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  }

  const safeItemCount = mounted ? itemCount : 0;
  const safeWishlistCount = mounted ? wishlistCount : 0;
  const loggedIn = mounted ? isLoggedIn() : false;
  const admin = mounted ? isAdmin() : false;

  const handleCategoriesEnter = () => {
    if (categoriesTimerRef.current) clearTimeout(categoriesTimerRef.current);
    setCategoriesOpen(true);
  };
  const handleCategoriesLeave = () => {
    categoriesTimerRef.current = setTimeout(() => {
      setCategoriesOpen(false);
      setActiveSubCategory(null);
    }, 150);
  };

  // Cards to show on the right side
  const displayCards = (activeSubCategory && SUBCATEGORY_CARDS[activeSubCategory])
    ? SUBCATEGORY_CARDS[activeSubCategory]
    : (CATEGORY_IMAGES[activeMegaCategory] ?? CATEGORY_IMAGES.clothing);

  return (
    <>
      {/* Announcement Bar */}
      <div className="overflow-hidden bg-[radial-gradient(circle_at_top,_#2a2a2a,_#111111_55%)] py-2 text-[10px] font-medium tracking-[0.22em] text-white sm:text-xs select-none">
        <motion.div
          className="flex w-max items-center whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 22 }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-shrink-0 items-center gap-8 px-4">
              <span>
                FREE SHIPPING OVER <span className="font-bold text-amber-400">₨5,000</span> &nbsp;|&nbsp; CODE{" "}
                <span className="font-black text-amber-400">MARQET10</span> = 10% OFF
              </span>
              <span className="text-amber-500/50">•</span>
            </div>
          ))}
        </motion.div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "border-b border-neutral-200/80 bg-white/90 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl"
            : "border-b border-neutral-200/70 bg-white/80 backdrop-blur-sm"
        )}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-2 sm:h-16">

            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 rounded-full border border-amber-100 bg-amber-50/80 px-3 py-1.5 text-lg font-black tracking-[0.18em] text-neutral-900 transition-colors hover:text-amber-600 sm:text-xl"
            >
              {SITE_NAME}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50/80 p-1 lg:flex" aria-label="Main navigation">
              {NAV_LINKS.map((link) => {
                const isCategories = link.href === "/categories";
                const isActive = pathname === link.href;

                if (isCategories) {
                  return (
                    <div
                      key={link.href}
                      className="relative"
                      onMouseEnter={handleCategoriesEnter}
                      onMouseLeave={handleCategoriesLeave}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-all",
                          isActive || categoriesOpen
                            ? "bg-neutral-900 text-white shadow-sm"
                            : "text-neutral-600 hover:bg-white hover:text-neutral-900"
                        )}
                      >
                        {link.label}
                        <ChevronDown size={13} className={cn("transition-transform duration-200", categoriesOpen && "rotate-180")} />
                      </Link>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-full px-3 py-2 text-sm font-medium transition-all",
                      isActive ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-600 hover:bg-white hover:text-neutral-900"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {admin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-amber-600 transition-colors hover:bg-amber-50 hover:text-amber-700"
                >
                  <ShieldCheck size={14} />
                  Admin
                </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button onClick={openSearch} className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 hover:shadow-sm transition-all sm:h-11 sm:w-11" aria-label="Search">
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <Link href="/wishlist" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 hover:shadow-sm transition-all sm:h-11 sm:w-11" aria-label="Wishlist">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                {safeWishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
                    {safeWishlistCount > 9 ? "9+" : safeWishlistCount}
                  </span>
                )}
              </Link>
              <button onClick={openCart} className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 hover:shadow-sm transition-all sm:h-11 sm:w-11" aria-label="Cart">
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                {safeItemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white leading-none">
                    {safeItemCount > 9 ? "9+" : safeItemCount}
                  </span>
                )}
              </button>

              {loggedIn && user ? (
                <div className="relative hidden lg:block" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-white text-xs font-bold overflow-hidden">
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        getInitials(user.name)
                      )}
                    </div>
                    <span className="max-w-[90px] truncate">{user.name.split(" ")[0]}</span>
                    <ChevronDown size={14} className={cn("transition-transform", userMenuOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-neutral-100 bg-white shadow-lg py-1 z-50"
                      >
                        <div className="px-4 py-2.5 border-b border-neutral-50">
                          <p className="text-sm font-semibold text-neutral-900 truncate">{user.name}</p>
                          <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                        </div>
                        <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                          <User size={15} className="text-neutral-400" /> My Dashboard
                        </Link>
                        {admin && (
                          <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 transition-colors">
                            <ShieldCheck size={15} /> Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-neutral-50 mt-1">
                          <button onClick={handleLogout} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                            <LogOut size={15} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Link href="/login" className="px-3.5 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors rounded-lg hover:bg-neutral-50">Sign In</Link>
                  <Link href="/register" className="px-3.5 py-2 text-sm font-semibold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors">Register</Link>
                </div>
              )}

              <button
                onClick={toggleMobileMenu}
                className="lg:hidden flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ───── Mega-Menu (Categories hover) ───── */}
        <AnimatePresence>
          {categoriesOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 right-0 top-full z-40 border-t border-neutral-200 bg-white shadow-xl"
              onMouseEnter={handleCategoriesEnter}
              onMouseLeave={handleCategoriesLeave}
            >
              <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                <div className="grid grid-cols-4 gap-8">

                  {/* LEFT: Category list */}
                  <div className="col-span-1 border-r border-neutral-100 pr-6">
                    <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                      Shop by Category
                    </p>
                    <ul className="space-y-1">
                      {MAIN_CATEGORIES.map((cat) => {
                        const isActive = activeMegaCategory === cat.slug;
                        return (
                          <li key={cat.slug}>
                            <button
                              onMouseEnter={() => {
                                setActiveMegaCategory(cat.slug);
                                setActiveSubCategory(null);
                              }}
                              onClick={() => {
                                router.push(`/products?category=${cat.slug}`);
                                setCategoriesOpen(false);
                              }}
                              className={cn(
                                "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm font-semibold uppercase tracking-wide transition-colors",
                                isActive ? "text-neutral-900 bg-neutral-50 font-bold" : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50/50"
                              )}
                            >
                              <span>{cat.name}</span>
                              {isActive && <ChevronRight size={14} className="text-neutral-400" />}
                            </button>
                            {/* Subcategories shown inline below active category */}
                            {isActive && (
                              <ul className="mt-1 mb-2 ml-3 space-y-1">
                                {cat.subs.map((sub) => {
                                  const isSubActive = activeSubCategory === sub.slug;
                                  return (
                                    <li key={sub.slug}>
                                      <Link
                                        href={`/products?category=${sub.slug}`}
                                        onClick={() => setCategoriesOpen(false)}
                                        onMouseEnter={() => setActiveSubCategory(sub.slug)}
                                        className={cn(
                                          "block text-xs font-semibold py-1 px-1.5 rounded uppercase tracking-wide transition-colors",
                                          isSubActive
                                            ? "text-amber-700 bg-amber-50"
                                            : "text-amber-600 hover:text-amber-800 hover:bg-amber-50/60"
                                        )}
                                      >
                                        {sub.name}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* RIGHT: Featured images for hovered category or subcategory with smooth animation */}
                  <div className="col-span-3">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeSubCategory ?? activeMegaCategory}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="grid grid-cols-3 gap-4"
                      >
                        {displayCards.map((img, idx) => (
                          <motion.div
                            key={img.label + img.href}
                            initial={{ opacity: 0, scale: 0.95, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.24, delay: idx * 0.04, ease: "easeOut" }}
                          >
                            <Link
                              href={img.href}
                              onClick={() => setCategoriesOpen(false)}
                              className="group block"
                            >
                              <div className="relative h-52 w-full overflow-hidden rounded-xl bg-neutral-100 shadow-sm border border-neutral-100 transition-all duration-300 group-hover:shadow-md group-hover:border-amber-200">
                                <Image
                                  src={img.url}
                                  alt={img.label}
                                  fill
                                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                  sizes="(max-width: 768px) 100vw, 25vw"
                                />
                              </div>
                              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-neutral-800 transition-colors duration-200 group-hover:text-amber-600">
                                {img.label}
                              </p>
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ───── Mobile Drawer ───── */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-neutral-100 bg-white overflow-hidden"
            >
              <nav className="px-3 py-3 space-y-0.5" aria-label="Mobile navigation">
                {NAV_LINKS.map((link) => {
                  const isCategories = link.href === "/categories";
                  if (isCategories) {
                    return (
                      <div key={link.href}>
                        <Link
                          href="/categories"
                          onClick={closeMobileMenu}
                          className="flex items-center px-4 py-3 rounded-xl text-sm font-bold text-neutral-900 bg-neutral-50"
                        >
                          Categories
                        </Link>
                        <div className="mt-1 px-2 space-y-1">
                          {MAIN_CATEGORIES.map((cat) => {
                            const isExpanded = expandedMobileCategory === cat.slug;
                            return (
                              <div key={cat.slug} className="rounded-xl overflow-hidden border border-neutral-100">
                                <button
                                  onClick={() => setExpandedMobileCategory(isExpanded ? null : cat.slug)}
                                  className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-semibold text-neutral-800"
                                >
                                  <span>{cat.name}</span>
                                  <ChevronDown size={14} className={cn("transition-transform text-neutral-400", isExpanded && "rotate-180")} />
                                </button>
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="bg-neutral-50 px-3 pb-2 space-y-1"
                                    >
                                      {cat.subs.map((sub) => (
                                        <Link
                                          key={sub.slug}
                                          href={`/products?category=${sub.slug}`}
                                          onClick={closeMobileMenu}
                                          className="flex items-center gap-1.5 py-1.5 pl-6 text-xs font-semibold uppercase tracking-wide text-amber-600 hover:text-amber-800"
                                        >
                                          <ChevronRight size={11} className="text-neutral-300" />
                                          {sub.name}
                                        </Link>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                        pathname === link.href ? "bg-neutral-100 text-neutral-900 font-bold" : "text-neutral-700 hover:bg-neutral-50"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                {/* Auth */}
                <div className="border-t border-neutral-100 pt-2 mt-2 space-y-0.5">
                  {loggedIn && user ? (
                    <>
                      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50" onClick={closeMobileMenu}><User size={16} /> My Dashboard</Link>
                      {admin && <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-amber-600 hover:bg-amber-50" onClick={closeMobileMenu}><ShieldCheck size={16} /> Admin Panel</Link>}
                      <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50"><LogOut size={16} /> Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50" onClick={closeMobileMenu}><User size={16} /> Sign In</Link>
                      <Link href="/register" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200" onClick={closeMobileMenu}>Create Account</Link>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
