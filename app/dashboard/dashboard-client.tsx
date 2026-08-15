"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Package, Heart, Bell, Settings, MapPin, Lock, User as UserIcon,
  ShoppingBag, Coins, ChevronRight, Gift, Star, TrendingUp, Loader2,
  Plus, Trash2, CheckCircle, XCircle, Eye,
} from "lucide-react";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate, getInitials } from "@/lib/utils";
import toast from "react-hot-toast";

const navItems = [
  { id: "overview",       label: "Overview",       icon: Package },
  { id: "orders",         label: "My Orders",      icon: ShoppingBag },
  { id: "wishlist",       label: "Wishlist",        icon: Heart },
  { id: "credits",        label: "My Credits",     icon: Coins },
  { id: "notifications",  label: "Notifications",  icon: Bell },
  { id: "settings",       label: "Settings",       icon: Settings },
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

interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const statusVariants: Record<string, "default" | "success" | "warning" | "destructive" | "secondary" | "outline"> = {
  PENDING: "warning", CONFIRMED: "secondary", PROCESSING: "secondary",
  SHIPPED: "default", DELIVERED: "success", CANCELLED: "destructive", REFUNDED: "outline",
};

const cancellableStatuses = ["PENDING", "CONFIRMED"];

export function DashboardClient() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<NavId>("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Settings state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addrLoading, setAddrLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", currentPassword: "", newPassword: "", confirmPassword: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrForm, setAddrForm] = useState({ fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "Pakistan", isDefault: false });
  const [addrSaving, setAddrSaving] = useState(false);

  const wishlistCount = useWishlistStore((s) => s.items.length);
  const cartCount = useCartStore((s) => s.itemCount());
  const { user, setUser } = useAuthStore();

  useEffect(() => setMounted(true), []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/user/orders", { credentials: "include" });
      const data = await res.json();
      if (data.success) setOrders(data.data as Order[]);
    } catch { /* silent */ } finally { setOrdersLoading(false); }
  }, []);

  const fetchAddresses = useCallback(async () => {
    setAddrLoading(true);
    try {
      const res = await fetch("/api/user/addresses", { credentials: "include" });
      const data = await res.json();
      if (data.success) setAddresses(data.data as Address[]);
    } catch { /* silent */ } finally { setAddrLoading(false); }
  }, []);

  useEffect(() => { if (mounted) fetchOrders(); }, [mounted, fetchOrders]);

  useEffect(() => {
    if (mounted && activeTab === "settings") {
      fetchAddresses();
      if (user) setProfileForm((f) => ({ ...f, name: user.name }));
    }
  }, [mounted, activeTab, fetchAddresses, user]);

  const safeWishlist = mounted ? wishlistCount : 0;
  const safeCart = mounted ? cartCount : 0;
  const displayName = mounted ? (user?.name ?? "My Account") : "My Account";
  const displayInitials = mounted && user ? getInitials(user.name) : "U";
  const userCredits = mounted ? (user?.credits ?? 0) : 0;

  async function handleCancelOrder(orderId: string) {
    setCancellingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Order cancelled successfully");
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: "CANCELLED" } : o));
      } else { toast.error(data.error ?? "Failed to cancel"); }
    } catch { toast.error("Something went wrong"); }
    finally { setCancellingId(null); }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/user/profile/image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data.user, data.data.token);
        toast.success("Profile picture updated!");
      } else {
        toast.error(data.error ?? "Upload failed");
      }
    } catch {
      toast.error("Upload failed. Try again.");
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      toast.error("Passwords do not match"); return;
    }
    setProfileSaving(true);
    try {
      const body: Record<string, string> = {};
      if (profileForm.name.trim()) body.name = profileForm.name.trim();
      if (profileForm.newPassword) {
        body.currentPassword = profileForm.currentPassword;
        body.newPassword = profileForm.newPassword;
      }
      const res = await fetch("/api/user/profile", {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated!");
        setUser(data.data.user, data.data.token);
        setProfileForm((f) => ({ ...f, currentPassword: "", newPassword: "", confirmPassword: "" }));
      } else { toast.error(data.error ?? "Update failed"); }
    } catch { toast.error("Something went wrong"); }
    finally { setProfileSaving(false); }
  }

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    setAddrSaving(true);
    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addrForm),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Address saved!");
        setShowAddrForm(false);
        fetchAddresses();
        setAddrForm({ fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "Pakistan", isDefault: false });
      } else { toast.error(data.error ?? "Failed to save address"); }
    } catch { toast.error("Something went wrong"); }
    finally { setAddrSaving(false); }
  }

  async function handleDeleteAddress(id: string) {
    try {
      await fetch(`/api/user/addresses/${id}`, { method: "DELETE", credentials: "include" });
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Address deleted");
    } catch { toast.error("Failed to delete"); }
  }

  const setAF = (k: keyof typeof addrForm, v: string | boolean) => setAddrForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="rounded-2xl bg-white border border-neutral-100 p-6 mb-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white text-lg font-bold flex-shrink-0 overflow-hidden">
                  {user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    displayInitials
                  )}
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
                  <Coins className="h-3.5 w-3.5" />{userCredits}
                </span>
              </div>
            </div>
            <nav className="rounded-2xl bg-white border border-neutral-100 overflow-hidden">
              {navItems.map((item, i) => (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center justify-between px-5 py-3.5 text-sm transition-colors ${i > 0 ? "border-t border-neutral-50" : ""} ${activeTab === item.id ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"}`}>
                  <div className="flex items-center gap-3"><item.icon className="h-4 w-4" />{item.label}</div>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </button>
              ))}
            </nav>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-neutral-900">Welcome{mounted && user ? `, ${user.name.split(" ")[0]}` : ""} 👋</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { icon: Package, label: "Total Orders", value: ordersLoading ? "—" : orders.length, color: "text-blue-600 bg-blue-50" },
                    { icon: Heart, label: "Wishlist", value: safeWishlist, color: "text-red-500 bg-red-50" },
                    { icon: ShoppingBag, label: "Cart Items", value: safeCart, color: "text-neutral-700 bg-neutral-100" },
                    { icon: Star, label: "Credits", value: userCredits, color: "text-amber-600 bg-amber-50" },
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
                <div className="rounded-2xl bg-white border border-neutral-100 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-50">
                    <h3 className="font-semibold text-neutral-900">Recent Orders</h3>
                    <button onClick={() => setActiveTab("orders")} className="text-xs text-amber-600 hover:text-amber-700">View all</button>
                  </div>
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-neutral-400" /></div>
                  ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                      <Package className="h-10 w-10 text-neutral-200 mb-3" />
                      <p className="font-medium text-neutral-900">No orders yet</p>
                      <Link href="/products" className="mt-4"><Button size="sm">Browse Products</Button></Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-50">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-neutral-900">{order.orderNumber}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{order.items.length} items · {formatDate(order.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={statusVariants[order.status]}>{order.status}</Badge>
                            <span className="text-sm font-semibold text-neutral-900">{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2"><Gift className="h-5 w-5" /><span className="text-sm font-semibold">Loyalty Credits</span></div>
                      <p className="text-3xl font-black">{userCredits}</p>
                      <p className="text-amber-100 text-sm mt-1">Worth {formatPrice(userCredits)} · Earn 2% on every purchase</p>
                    </div>
                    <TrendingUp className="h-10 w-10 text-amber-200 flex-shrink-0" />
                  </div>
                  <div className="mt-4"><Link href="/checkout"><Button size="sm" className="bg-white text-amber-700 hover:bg-amber-50 border-0">Use at Checkout</Button></Link></div>
                </div>
              </div>
            )}

            {/* ORDERS */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-neutral-900">My Orders</h2>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-neutral-400" /></div>
                ) : orders.length === 0 ? (
                  <div className="rounded-2xl bg-white border border-neutral-100 p-16 text-center">
                    <Package className="h-12 w-12 text-neutral-200 mx-auto mb-4" />
                    <p className="font-semibold text-neutral-900">No orders yet</p>
                    <Link href="/products" className="mt-5 inline-block"><Button>Start Shopping</Button></Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.id} className="rounded-2xl bg-white border border-neutral-100 p-5">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-neutral-900">{order.orderNumber}</p>
                              <Badge variant={statusVariants[order.status]}>{order.status}</Badge>
                            </div>
                            <p className="text-sm text-neutral-500 mt-1">{order.items.length} items · Placed on {formatDate(order.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-bold text-neutral-900">{formatPrice(order.total)}</p>
                            {cancellableStatuses.includes(order.status) && (
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                disabled={cancellingId === order.id}
                                className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                              >
                                {cancellingId === order.id ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={13} />}
                                Cancel
                              </button>
                            )}
                            <Link href={`/track-order?orderNumber=${order.orderNumber}`}
                              className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
                              <Eye size={13} /> Track
                            </Link>
                          </div>
                        </div>
                        {/* Order items preview */}
                        <div className="mt-3 flex gap-2 overflow-x-auto">
                          {order.items.slice(0, 4).map((item) => (
                            <div key={item.id} className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                              {item.product?.images?.[0]?.url && (
                                <img src={item.product.images[0].url} alt={item.product.name} className="h-full w-full object-cover" />
                              )}
                              <span className="absolute bottom-0 right-0 bg-neutral-900/70 text-white text-[9px] px-1 rounded-tl">{item.quantity}x</span>
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-xs text-neutral-500 font-medium">
                              +{order.items.length - 4}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST */}
            {activeTab === "wishlist" && (
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-4">My Wishlist</h2>
                <div className="rounded-2xl bg-white border border-neutral-100 p-8 text-center">
                  <Heart className="h-10 w-10 text-neutral-200 mx-auto mb-3" />
                  <p className="font-medium text-neutral-900">{safeWishlist > 0 ? `${safeWishlist} saved items` : "No saved items yet"}</p>
                  <Link href="/wishlist" className="mt-4 inline-block"><Button size="sm" variant="outline">View Wishlist</Button></Link>
                </div>
              </div>
            )}

            {/* CREDITS */}
            {activeTab === "credits" && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-neutral-900">My Credits</h2>
                <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-8 text-white">
                  <p className="text-sm font-medium text-amber-100">Available Balance</p>
                  <p className="text-5xl font-black mt-1">{userCredits}</p>
                  <p className="text-amber-100 text-sm mt-2">= {formatPrice(userCredits)} discount value</p>
                </div>
                <div className="rounded-2xl bg-white border border-neutral-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-neutral-50"><h3 className="font-semibold text-neutral-900">How to Earn Credits</h3></div>
                  <div className="divide-y divide-neutral-50">
                    {[
                      { icon: ShoppingBag, label: "Purchase Credits", desc: "Earn 2% of every order value as credits" },
                      { icon: Gift, label: "Referral Bonus", desc: "Get 500 credits for each friend you refer" },
                      { icon: Star, label: "Review Bonus", desc: "Earn 50 credits for each verified review" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-4 px-6 py-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50"><item.icon className="h-5 w-5 text-amber-600" /></div>
                        <div><p className="text-sm font-medium text-neutral-900">{item.label}</p><p className="text-xs text-neutral-500">{item.desc}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <div className="rounded-2xl bg-white border border-neutral-100 p-16 text-center">
                <Bell className="h-12 w-12 text-neutral-200 mx-auto mb-4" />
                <p className="text-lg font-semibold text-neutral-900">Notifications</p>
                <p className="text-sm text-neutral-500 mt-2">You have no new notifications.</p>
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-neutral-900">Account Settings</h2>

                {/* Profile */}
                <div className="rounded-2xl bg-white border border-neutral-100 p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <UserIcon className="h-5 w-5 text-neutral-400" />
                    <h3 className="font-semibold text-neutral-900">Profile Information</h3>
                  </div>
                  <form onSubmit={handleProfileSave} className="space-y-4">
                    {/* Avatar upload */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="h-16 w-16 rounded-full bg-neutral-900 text-white flex items-center justify-center text-lg font-bold overflow-hidden flex-shrink-0">
                          {user?.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.image} alt={user?.name ?? ""} className="h-full w-full object-cover" />
                          ) : (
                            <span>{displayInitials}</span>
                          )}
                        </div>
                        {avatarUploading && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                            <Loader2 size={18} className="animate-spin text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="cursor-pointer">
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                            📷 Change Photo
                          </span>
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            className="hidden"
                            onChange={handleAvatarUpload}
                            disabled={avatarUploading}
                          />
                        </label>
                        <p className="text-xs text-neutral-400 mt-1">JPG, PNG, WebP — Max 3MB</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700 block mb-1">Full Name</label>
                      <input value={profileForm.name} onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
                        className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700 block mb-1">Email</label>
                      <input value={user?.email ?? ""} disabled
                        className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm bg-neutral-50 text-neutral-400 cursor-not-allowed" />
                    </div>
                    <Separator />
                    <div className="flex items-center gap-2 text-sm font-medium text-neutral-700"><Lock className="h-4 w-4 text-neutral-400" />Change Password</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { key: "currentPassword", label: "Current Password", placeholder: "••••••••" },
                        { key: "newPassword", label: "New Password", placeholder: "Min. 6 characters" },
                        { key: "confirmPassword", label: "Confirm New Password", placeholder: "Repeat new password" },
                      ].map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <label className="text-xs font-medium text-neutral-600 block mb-1">{label}</label>
                          <input type="password" placeholder={placeholder}
                            value={profileForm[key as keyof typeof profileForm] as string}
                            onChange={(e) => setProfileForm((f) => ({ ...f, [key]: e.target.value }))}
                            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100" />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={profileSaving} size="sm" className="gap-2">
                        {profileSaving && <Loader2 size={14} className="animate-spin" />}
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Addresses */}
                <div className="rounded-2xl bg-white border border-neutral-100 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-neutral-400" /><h3 className="font-semibold text-neutral-900">Saved Addresses</h3></div>
                    <button onClick={() => setShowAddrForm((v) => !v)}
                      className="flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:text-neutral-900">
                      <Plus size={16} />{showAddrForm ? "Cancel" : "Add Address"}
                    </button>
                  </div>

                  {showAddrForm && (
                    <form onSubmit={handleAddAddress} className="mb-5 rounded-xl border border-neutral-100 p-4 space-y-3 bg-neutral-50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { key: "fullName", label: "Full Name", placeholder: "Muhammad Ali" },
                          { key: "phone", label: "Phone", placeholder: "+92 300 1234567" },
                          { key: "addressLine1", label: "Address", placeholder: "House #, Street, Area" },
                          { key: "addressLine2", label: "Address Line 2 (optional)", placeholder: "Apt, floor, etc." },
                          { key: "city", label: "City", placeholder: "Lahore" },
                          { key: "state", label: "Province", placeholder: "Punjab" },
                          { key: "postalCode", label: "Postal Code", placeholder: "54000" },
                        ].map(({ key, label, placeholder }) => (
                          <div key={key}>
                            <label className="text-xs font-medium text-neutral-600 block mb-1">{label}</label>
                            <input placeholder={placeholder}
                              value={addrForm[key as keyof typeof addrForm] as string}
                              onChange={(e) => setAF(key as keyof typeof addrForm, e.target.value)}
                              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400" />
                          </div>
                        ))}
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={addrForm.isDefault} onChange={(e) => setAF("isDefault", e.target.checked)} className="h-4 w-4 rounded" />
                        <span className="text-sm text-neutral-700">Set as default address</span>
                      </label>
                      <Button type="submit" disabled={addrSaving} size="sm" className="gap-2">
                        {addrSaving && <Loader2 size={14} className="animate-spin" />}Save Address
                      </Button>
                    </form>
                  )}

                  {addrLoading ? (
                    <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-neutral-400" /></div>
                  ) : addresses.length === 0 ? (
                    <p className="text-sm text-neutral-400 text-center py-6">No addresses saved yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map((addr) => (
                        <div key={addr.id} className="rounded-xl border border-neutral-100 p-4 flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-neutral-900">{addr.fullName}</p>
                              {addr.isDefault && (
                                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                  <CheckCircle size={11} /> Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-500 mt-0.5">{addr.phone}</p>
                            <p className="text-xs text-neutral-600 mt-0.5">
                              {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}, {addr.city}, {addr.state} {addr.postalCode}
                            </p>
                          </div>
                          <button onClick={() => handleDeleteAddress(addr.id)} className="text-neutral-300 hover:text-red-500 transition-colors flex-shrink-0">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
