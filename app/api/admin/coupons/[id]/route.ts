import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const { id } = await params;

  try {
    const coupon = await db.coupon.findUnique({ where: { id } });
    if (!coupon) {
      return Response.json(
        { success: false, error: "Coupon not found" } satisfies ApiResponse,
        { status: 404 }
      );
    }
    return Response.json({ success: true, data: coupon } satisfies ApiResponse);
  } catch (error) {
    console.error("[ADMIN/COUPONS/GET/:id]", error);
    return Response.json(
      { success: false, error: "Failed to fetch coupon" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const { id } = await params;

  try {
    const body = await request.json();
    const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt, isActive } = body;

    if (code) {
      const existing = await db.coupon.findFirst({ where: { code: code.toUpperCase(), NOT: { id } } });
      if (existing) {
        return Response.json(
          { success: false, error: "Coupon code already taken" } satisfies ApiResponse,
          { status: 409 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (code !== undefined) updateData.code = code.toUpperCase();
    if (discountType !== undefined) updateData.discountType = discountType;
    if (discountValue !== undefined) updateData.discountValue = Number(discountValue);
    if (minOrderAmount !== undefined) updateData.minOrderAmount = minOrderAmount != null ? Number(minOrderAmount) : null;
    if (maxUses !== undefined) updateData.maxUses = maxUses != null ? Number(maxUses) : null;
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (isActive !== undefined) updateData.isActive = isActive;

    const coupon = await db.coupon.update({ where: { id }, data: updateData });
    return Response.json(
      { success: true, data: coupon, message: "Coupon updated" } satisfies ApiResponse
    );
  } catch (error) {
    console.error("[ADMIN/COUPONS/PATCH/:id]", error);
    return Response.json(
      { success: false, error: "Failed to update coupon" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const { id } = await params;

  try {
    await db.coupon.delete({ where: { id } });
    return Response.json({ success: true, message: "Coupon deleted" } satisfies ApiResponse);
  } catch (error) {
    console.error("[ADMIN/COUPONS/DELETE/:id]", error);
    return Response.json(
      { success: false, error: "Failed to delete coupon" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
