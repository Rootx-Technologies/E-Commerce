import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { code, cartTotal } = await request.json();

    if (!code?.trim()) {
      return Response.json(
        { success: false, error: "Coupon code is required" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    const coupon = await db.coupon.findUnique({
      where: { code: code.trim().toUpperCase(), isActive: true },
    });

    if (!coupon) {
      return Response.json(
        { success: false, error: "Invalid or expired coupon code" } satisfies ApiResponse,
        { status: 404 }
      );
    }

    // Check expiry
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return Response.json(
        { success: false, error: "This coupon has expired" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Check max uses
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return Response.json(
        { success: false, error: "This coupon has reached its usage limit" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Check min order amount
    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      return Response.json(
        {
          success: false,
          error: `Minimum order amount of ₨${coupon.minOrderAmount.toLocaleString()} required for this coupon`,
        } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = Math.round((cartTotal * coupon.discountValue) / 100);
    } else {
      discountAmount = Math.min(coupon.discountValue, cartTotal);
    }

    return Response.json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
      message: `Coupon applied! You save ₨${discountAmount.toLocaleString()}`,
    } satisfies ApiResponse);
  } catch (error) {
    console.error("[COUPONS/VALIDATE]", error);
    return Response.json(
      { success: false, error: "Failed to validate coupon" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
