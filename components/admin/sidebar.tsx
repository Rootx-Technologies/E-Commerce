"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tag, Bookmark, ShoppingCart,
  Users, Ticket, Image, LogOut, ChevronRight, Store,
} from "lucide-react";
import { adminLogout } from "@/lib/admin-api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SITE_NAME } from "@/lib/constants";

const navItems = [
  { label: "Dashboard",  href: "/admin",            icon: LayoutDashboard },
  { label: "Products",   href: "/admin/products",   icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Brands",     href: "/admin/brands",     icon: Bookmark },
  { label: "Orders",     href: "/admin/orders",     icon: ShoppingCart },
  { label: "Users",      href: "/admin/users",      icon: Users },
  { label: "Coupons",    href: "/admin/coupons",    icon: Ticket },
  { label: "Banners",    href: "/admin/banners",    icon: Image },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await adminLogout();
    toast.success("Logged out successfully");
    router.push("/admin/login");
  }

  return (
    <aside className="flex w-64 flex-col border-r border-neutral-100 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-neutral-100 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white">
          <Store size={16} />
        </div>
        <div>
          <p className="text-sm font-bold tracking-wide text-neutral-900">{SITE_NAME}</p>
          <p className="text-xs text-neutral-400">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Management
        </p>
        <ul className="flex flex-col gap-0.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  <Icon size={16} />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight size={14} className="opacity-60" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-neutral-100 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
        >
          <Store size={16} />
          <span>View Store</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
