"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Package, Heart, Bell, Settings,
  ShoppingBag, Coins, ChevronRight, Gift, Star, TrendingUp, Loader2,
} from "lucide-react";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate, getInitials } from "@/lib/utils";

const navItems = [
  { id: "overview", label: "Overview", icon: Package },
  { id: "orders", label: "My Orders", icon: ShoppingBag },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "credits", label: "My Credits", icon: Coins },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

type NavId = (typeof navItems)[number]["id"];

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { id: string; quantity: number; price: number; product: { name: string; images: { url: string; isPrimary: boolean }[] } }[];
}

const statusVariants: Record<string, "default" | "success" | "warning" | "destructive" | "secondary" | "outline"> = {
  PENDING: "warning",
  CONFIRMED: "secondary",
  PROCESSING: "secondary",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
  REFUNDED: "outline",
};

export function DashboardClient() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<NavId>("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const wishlistCount = useWishlistStore((s) => s.items.length);
  const cartCount = useCartStore((s) => s.itemCount());
  const user = useAuthStore((s) => s.user);

  useEffect(() => setMounted(true), []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/user/orders", { credentials: "include" });
      const data = await res.json();
      if (data.success) setOrders(data.data as Order[]);
    } catch {
      // silently fail — user just sees empty state
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted) fetchOrders();
  }, [mounted, fetchOrders]);

  const safeWishlist = mounted ? wishlistCount : 0;
  const safeCart = mounted ? cartCount : 0;
  const displayName = mounted ? (user?.name ?? "My Account") : "My Account";
  const displayInitials = mounted && user ? getInitials(user.name) : "U";
  const userCredits = mounted ? (user?.credits ?? 0) : 0;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            {/* Profile card */}
            <div className="rounded-2xl bg-white border border-neutral-100 p-6 mb-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white text-lg font-bold flex-shrink-0">
                  {displayInitials}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-neutral-900 truncate">{displayName}</p>
                  <p className="text-xs text-neutral-500 truncate">{mounted ? (user?.email ?? "") : ""}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Credits Balance</span>
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  <Coins className="h-3.5 w-3.5" />
                  {userCredits}
                </span>
              </div>
            </div>

            {/* Nav */}
            <nav className="rounded-2xl bg-white border border-neutral-100 overflow-hidden">
              {navItems.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center justify-between px-5 py-3.5 text-sm transition-colors ${
                    i > 0 ? "border-t border-neutral-50" : ""
                  } ${
                    activeTab === item.id
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </button>
              ))}
            </nav>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">

            {/* Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-neutral-900">
                  Welcome{mounted && user ? `, ${user.name.split(" ")[0]}` : ""} 👋
                </h2>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { icon: Package, label: "Total Orders", value: ordersLoading ? "—" : orders.length, color: "text-blue-600 bg-blue-50" },
                    { icon: Heart, label: "Wishlist", value: safeWishlist, color: "text-red-500 bg-red-50" },
                    { icon: ShoppingBag, label: "Cart Items", value: safeCart, color: "text-neutral-700 bg-neutral-100" },
                    { icon: Star, label: "Reviews", value: 0, color: "text-violet-600 bg-violet-50" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-white border border-neutral-100 p-5">
                      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${stat.color} mb-3`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <p className="text-2xl font-black text-neutral-900">{stat.value}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent orders */}
                <div className="rounded-2xl bg-white border border-neutral-100 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-50">
                    <h3 className="font-semibold text-neutral-900">Recent Orders</h3>
                    <button onClick={() => setActiveTab("orders")} className="text-xs text-amber-600 hover:text-amber-700">
                      View all
                    </button>
                  </div>

                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                      <Package className="h-10 w-10 text-neutral-200 mb-3" />
                      <p className="font-medium text-neutral-900">No orders yet</p>
                      <p className="text-sm text-neutral-500 mt-1">Start shopping to see your orders here</p>
                      <Link href="/products" className="mt-4">
                        <Button size="sm">Browse Products</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-50">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-neutral-900">{order.orderNumber}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">
                              {order.items.length} items · {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={statusVariants[order.status]}>
                              {order.status}
                            </Badge>
                            <span className="text-sm font-semibold text-neutral-900">
                              {formatPrice(order.total)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Credits promo */}
                <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="h-5 w-5" />
                        <span className="text-sm font-semibold">Loyalty Credits</span>
                      </div>
                      <p className="text-3xl font-black">{userCredits}</p>
                      <p className="text-amber-100 text-sm mt-1">
                        Worth {formatPrice(userCredits)} · Earn 2% on every purchase
                      </p>
                    </div>
                    <TrendingUp className="h-10 w-10 text-amber-200 flex-shrink-0" />
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Link href="/checkout">
                      <Button size="sm" className="bg-white text-amber-700 hover:bg-amber-50 border-0">
                        Use at Checkout
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-neutral-900">My Orders</h2>

                {ordersLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="rounded-2xl bg-white border border-neutral-100 p-16 text-center">
                    <Package className="h-12 w-12 text-neutral-200 mx-auto mb-4" />
                    <p className="font-semibold text-neutral-900">No orders yet</p>
                    <p className="text-sm text-neutral-500 mt-2">Your order history will appear here</p>
                    <Link href="/products" className="mt-5 inline-block">
                      <Button>Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.id} className="rounded-2xl bg-white border border-neutral-100 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-neutral-900">{order.orderNumber}</p>
                              <Badge variant={statusVariants[order.status]}>{order.status}</Badge>
                            </div>
                            <p className="text-sm text-neutral-500 mt-1">
                              {order.items.length} items · Placed on {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-neutral-900">{formatPrice(order.total)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist */}
            {activeTab === "wishlist" && (
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-4">My Wishlist</h2>
                <div className="rounded-2xl bg-white border border-neutral-100 p-8 text-center">
                  <Heart className="h-10 w-10 text-neutral-200 mx-auto mb-3" />
                  <p className="font-medium text-neutral-900">
                    {safeWishlist > 0 ? `${safeWishlist} saved items` : "No saved items yet"}
                  </p>
                  <Link href="/wishlist" className="mt-4 inline-block">
                    <Button size="sm" variant="outline">View Wishlist</Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Credits */}
            {activeTab === "credits" && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-neutral-900">My Credits</h2>
                <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-8 text-white">
                  <p className="text-sm font-medium text-amber-100">Available Balance</p>
                  <p className="text-5xl font-black mt-1">{userCredits}</p>
                  <p className="text-amber-100 text-sm mt-2">= {formatPrice(userCredits)} discount value</p>
                </div>
                <div className="rounded-2xl bg-white border border-neutral-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-neutral-50">
                    <h3 className="font-semibold text-neutral-900">How to Earn Credits</h3>
                  </div>
                  <div className="divide-y divide-neutral-50">
                    {[
                      { icon: ShoppingBag, label: "Purchase Credits", desc: "Earn 2% of every order value as credits" },
                      { icon: Gift, label: "Referral Bonus", desc: "Get 500 credits for each friend you refer" },
                      { icon: Star, label: "Review Bonus", desc: "Earn 50 credits for each verified review" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-4 px-6 py-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                          <item.icon className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{item.label}</p>
                          <p className="text-xs text-neutral-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder tabs */}
            {(activeTab === "notifications" || activeTab === "settings") && (
              <div className="rounded-2xl bg-white border border-neutral-100 p-16 text-center">
                <p className="text-lg font-semibold text-neutral-900 capitalize">{activeTab}</p>
                <p className="text-sm text-neutral-500 mt-2">This section is coming soon.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
