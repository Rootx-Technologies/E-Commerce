import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");
    const where: Record<string, unknown> = {};
    if (isActive !== null && isActive !== "") where.isActive = isActive === "true";

    const coupons = await db.coupon.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ success: true, data: coupons } satisfies ApiResponse);
  } catch (error) {
    console.error("[ADMIN/COUPONS/GET]", error);
    return Response.json(
      { success: false, error: "Failed to fetch coupons" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt, isActive } = body;

    if (!code || !discountType || discountValue == null) {
      return Response.json(
        { success: false, error: "code, discountType, and discountValue are required" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    if (!["PERCENTAGE", "FIXED"].includes(discountType)) {
      return Response.json(
        { success: false, error: "discountType must be PERCENTAGE or FIXED" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    const existing = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (existing) {
      return Response.json(
        { success: false, error: "Coupon code already exists" } satisfies ApiResponse,
        { status: 409 }
      );
    }

    const coupon = await db.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: minOrderAmount != null ? Number(minOrderAmount) : null,
        maxUses: maxUses != null ? Number(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: isActive ?? true,
      },
    });

    return Response.json(
      { success: true, data: coupon, message: "Coupon created" } satisfies ApiResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error("[ADMIN/COUPONS/POST]", error);
    return Response.json(
      { success: false, error: "Failed to create coupon" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
