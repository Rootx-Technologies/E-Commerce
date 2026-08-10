"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingCart, Users, DollarSign, Loader2 } from "lucide-react";
import { fetchDashboardStats } from "@/lib/admin-api";
import { StatsCard } from "@/components/admin/stats-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { CURRENCY_SYMBOL } from "@/lib/constants";
import type { DashboardStats } from "@/types";
import { format } from "date-fns";

export function AdminDashboardClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then((res) => { if (res.success) setStats(res.data as DashboardStats); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 size={28} className="animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-64 items-center justify-center text-neutral-400">
        Failed to load stats. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page heading */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Overview — {format(new Date(), "dd MMM yyyy")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={stats.totalRevenue}
          growth={stats.revenueGrowth}
          isCurrency
          icon={<DollarSign size={20} />}
          color="green"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          growth={stats.ordersGrowth}
          icon={<ShoppingCart size={20} />}
          color="blue"
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          growth={stats.usersGrowth}
          icon={<Users size={20} />}
          color="purple"
        />
        <StatsCard
          title="Active Products"
          value={stats.totalProducts}
          icon={<Package size={20} />}
          color="orange"
        />
      </div>

      {/* Sales chart (bar) + recent orders */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Monthly Sales */}
        <div className="col-span-2 rounded-xl border border-neutral-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-neutral-700">Monthly Revenue (last 6 months)</h2>
          <div className="flex h-40 items-end gap-3">
            {stats.salesByMonth.map((m) => {
              const max = Math.max(...stats.salesByMonth.map((x) => x.revenue), 1);
              const h = Math.round((m.revenue / max) * 100);
              return (
                <div key={m.month} className="group relative flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-neutral-900 transition-all group-hover:bg-neutral-700"
                    style={{ height: `${h}%`, minHeight: 4 }}
                  />
                  {/* Tooltip */}
                  <span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-neutral-900 px-2 py-0.5 text-xs text-white group-hover:block">
                    {CURRENCY_SYMBOL}{m.revenue.toLocaleString()}
                  </span>
                  <span className="text-xs text-neutral-400">{m.month.split(" ")[0]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top products */}
        <div className="rounded-xl border border-neutral-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-neutral-700">Top Products</h2>
          <ul className="flex flex-col gap-3">
            {stats.topProducts.slice(0, 5).map((p, i) => (
              <li key={p.id} className="flex items-center gap-3">
                <span className="w-5 text-xs font-bold text-neutral-400">{i + 1}</span>
                <div className="h-8 w-8 flex-shrink-0 rounded-lg bg-neutral-100 overflow-hidden">
                  {p.images?.[0]?.url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0].url} alt={p.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-medium text-neutral-700">{p.name}</p>
                  <p className="text-xs text-neutral-400">{CURRENCY_SYMBOL}{p.price.toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-neutral-100 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-neutral-700">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-50 bg-neutral-50">
                {["Order #", "Customer", "Total", "Payment", "Status", "Date"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                  <td className="px-5 py-3 font-mono text-xs text-neutral-600">{order.orderNumber}</td>
                  <td className="px-5 py-3 text-neutral-700">{order.user?.name ?? "—"}</td>
                  <td className="px-5 py-3 font-medium text-neutral-900">
                    {CURRENCY_SYMBOL}{order.total.toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={order.paymentStatus} variant="payment" />
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={order.status} variant="order" />
                  </td>
                  <td className="px-5 py-3 text-neutral-400">
                    {format(new Date(order.createdAt), "dd MMM")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
