import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { getCache, setCache } from "@/lib/redis";
import type { ApiResponse, DashboardStats } from "@/types";
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";

export async function GET(request: NextRequest): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const cacheKey = "admin:dashboard:stats";
    const cached = await getCache<DashboardStats>(cacheKey);
    if (cached) {
      return Response.json({ success: true, data: cached } satisfies ApiResponse<DashboardStats>);
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const [
      totalRevenue,
      lastMonthRevenue,
      totalOrders,
      lastMonthOrders,
      totalUsers,
      lastMonthUsers,
      totalProducts,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      // Total revenue (delivered/confirmed orders)
      db.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ["DELIVERED", "CONFIRMED", "PROCESSING", "SHIPPED"] } },
      }),
      // Last month revenue
      db.order.aggregate({
        _sum: { total: true },
        where: {
          status: { in: ["DELIVERED", "CONFIRMED", "PROCESSING", "SHIPPED"] },
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        },
      }),
      // Total orders
      db.order.count(),
      // Last month orders
      db.order.count({ where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
      // Total users
      db.user.count({ where: { role: "USER" } }),
      // Last month users
      db.user.count({
        where: { role: "USER", createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      }),
      // Total products
      db.product.count({ where: { isActive: true } }),
      // Recent 10 orders
      db.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
          items: {
            include: {
              product: { include: { images: true, category: true, brand: true, variants: true } },
            },
          },
        },
      }),
      // Top 5 best-selling products
      db.product.findMany({
        where: { isActive: true, isBestSeller: true },
        take: 5,
        include: { images: true, category: true, brand: true, variants: true },
      }),
    ]);

    // Sales by month — last 6 months
    const salesByMonth: DashboardStats["salesByMonth"] = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);

      const [agg, count] = await Promise.all([
        db.order.aggregate({
          _sum: { total: true },
          where: {
            status: { in: ["DELIVERED", "CONFIRMED", "PROCESSING", "SHIPPED"] },
            createdAt: { gte: monthStart, lte: monthEnd },
          },
        }),
        db.order.count({ where: { createdAt: { gte: monthStart, lte: monthEnd } } }),
      ]);

      salesByMonth.push({
        month: format(monthDate, "MMM yyyy"),
        revenue: agg._sum.total ?? 0,
        orders: count,
      });
    }

    // Growth calculations
    const thisMonthRevenue = await db.order.aggregate({
      _sum: { total: true },
      where: {
        status: { in: ["DELIVERED", "CONFIRMED", "PROCESSING", "SHIPPED"] },
        createdAt: { gte: thisMonthStart },
      },
    });
    const thisMonthOrders = await db.order.count({
      where: { createdAt: { gte: thisMonthStart } },
    });
    const thisMonthUsers = await db.user.count({
      where: { role: "USER", createdAt: { gte: thisMonthStart } },
    });

    const calcGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const stats: DashboardStats = {
      totalRevenue: totalRevenue._sum.total ?? 0,
      totalOrders,
      totalUsers,
      totalProducts,
      revenueGrowth: calcGrowth(
        thisMonthRevenue._sum.total ?? 0,
        lastMonthRevenue._sum.total ?? 0
      ),
      ordersGrowth: calcGrowth(thisMonthOrders, lastMonthOrders),
      usersGrowth: calcGrowth(thisMonthUsers, lastMonthUsers),
      recentOrders: recentOrders as unknown as DashboardStats["recentOrders"],
      topProducts: topProducts as unknown as DashboardStats["topProducts"],
      salesByMonth,
    };

    await setCache(cacheKey, stats, 120); // 2-minute cache

    return Response.json({ success: true, data: stats } satisfies ApiResponse<DashboardStats>);
  } catch (error) {
    console.error("[ADMIN/DASHBOARD]", error);
    return Response.json(
      { success: false, error: "Failed to fetch dashboard stats" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
