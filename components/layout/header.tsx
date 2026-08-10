"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Heart, Search, Menu, X, User, LogOut, LayoutDashboard, ShieldCheck, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { cn, getInitials } from "@/lib/utils";
import { SITE_NAME, NAV_LINKS } from "@/lib/constants";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => { closeMobileMenu(); }, [pathname, closeMobileMenu]);

  // Close user dropdown on outside click
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
  // Show auth UI only after mount to avoid hydration mismatch
  const loggedIn = mounted ? isLoggedIn() : false;
  const admin = mounted ? isAdmin() : false;

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[radial-gradient(circle_at_top,_#2a2a2a,_#111111_55%)] px-4 py-2 text-center text-[10px] font-medium tracking-[0.22em] text-white sm:text-xs">
        FREE SHIPPING OVER ₨5,000 &nbsp;|&nbsp; CODE{" "}
        <span className="font-black text-amber-400">RAMZAN10</span> = 10% OFF
      </div>

      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-neutral-200/80 bg-white/90 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl"
          : "border-b border-neutral-200/70 bg-white/80 backdrop-blur-sm"
      )}>
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-2 sm:h-16">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 rounded-full border border-amber-100 bg-amber-50/80 px-3 py-1.5 text-lg font-black tracking-[0.18em] text-neutral-900 transition-colors hover:text-amber-600 sm:text-xl">
              {SITE_NAME}
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50/80 p-1 lg:flex" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm font-medium transition-all",
                    pathname === link.href ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-600 hover:bg-white hover:text-neutral-900"
                  )}>
                  {link.label}
                </Link>
              ))}
              {/* Admin link — only for admin users */}
              {admin && (
                <Link href="/admin"
                  className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-amber-600 transition-colors hover:bg-amber-50 hover:text-amber-700">
                  <ShieldCheck size={14} />
                  Admin
                </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              {/* Search */}
              <button onClick={openSearch}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-all hover:border-neutral-300 hover:text-neutral-900 hover:shadow-sm sm:h-11 sm:w-11"
                aria-label="Open search">
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              {/* Wishlist */}
              <Link href="/wishlist"
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-all hover:border-neutral-300 hover:text-neutral-900 hover:shadow-sm sm:h-11 sm:w-11"
                aria-label="Wishlist">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                {safeWishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
                    {safeWishlistCount > 9 ? "9+" : safeWishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button onClick={openCart}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-all hover:border-neutral-300 hover:text-neutral-900 hover:shadow-sm sm:h-11 sm:w-11"
                aria-label="Cart">
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                {safeItemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white leading-none">
                    {safeItemCount > 9 ? "9+" : safeItemCount}
                  </span>
                )}
              </button>

              {/* User — logged in */}
              {loggedIn && user ? (
                <div className="relative hidden lg:block" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-white text-xs font-bold">
                      {getInitials(user.name)}
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
                        <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                          <LayoutDashboard size={15} className="text-neutral-400" />
                          My Dashboard
                        </Link>
                        {admin && (
                          <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 transition-colors">
                            <ShieldCheck size={15} />
                            Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-neutral-50 mt-1">
                          <button onClick={handleLogout}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                            <LogOut size={15} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Not logged in */
                <div className="hidden lg:flex items-center gap-2">
                  <Link href="/login"
                    className="px-3.5 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors rounded-lg hover:bg-neutral-50">
                    Sign In
                  </Link>
                  <Link href="/register"
                    className="px-3.5 py-2 text-sm font-semibold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors">
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button onClick={toggleMobileMenu}
                className="lg:hidden flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}>
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-neutral-100 bg-white overflow-hidden">
              <nav className="px-3 py-3 space-y-0.5" aria-label="Mobile navigation">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href}
                    className={cn(
                      "flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-colors",
                      pathname === link.href ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    )}>
                    {link.label}
                  </Link>
                ))}

                {/* Mobile auth links */}
                <div className="border-t border-neutral-100 pt-2 mt-2 space-y-0.5">
                  {loggedIn && user ? (
                    <>
                      <Link href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                        <User size={16} />
                        My Dashboard
                      </Link>
                      {admin && (
                        <Link href="/admin"
                          className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-amber-600 hover:bg-amber-50">
                          <ShieldCheck size={16} />
                          Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50">
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login"
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                        <User size={16} />
                        Sign In
                      </Link>
                      <Link href="/register"
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200">
                        Create Account
                      </Link>
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
