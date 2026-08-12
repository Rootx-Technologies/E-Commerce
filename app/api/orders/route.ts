import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";
import { CREDITS_PER_PURCHASE } from "@/lib/constants";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest): Promise<Response> {
  const auth = await requireUser(request);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const {
      items, shippingAddress, billingAddress,
      paymentMethod, paymentIntentId, couponCode,
      creditsUsed, subtotal, discount, shipping, tax, total,
    } = body;

    if (!items?.length || !shippingAddress || !paymentMethod) {
      return Response.json(
        { success: false, error: "Missing required fields" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Validate coupon if provided
    let finalDiscount = discount ?? 0;
    if (couponCode) {
      const coupon = await db.coupon.findUnique({
        where: { code: couponCode.toUpperCase(), isActive: true },
      });
      if (coupon) {
        // Increment coupon usage
        await db.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    const orderNumber = generateOrderNumber();
    const creditsToUse = creditsUsed ?? 0;

    // Create order in DB with items
    const order = await db.order.create({
      data: {
        orderNumber,
        userId: auth.userId,
        status: paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
        paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
        paymentMethod: paymentMethod as "COD" | "STRIPE",
        paymentIntentId: paymentIntentId ?? null,
        shippingAddress,
        billingAddress: billingAddress ?? shippingAddress,
        subtotal: subtotal ?? 0,
        discount: finalDiscount,
        shipping: shipping ?? 0,
        tax: tax ?? 0,
        total: total ?? 0,
        couponCode: couponCode ?? null,
        creditsUsed: creditsToUse,
        items: {
          create: items.map((item: {
            productId: string;
            quantity: number;
            price: number;
            size?: string;
            color?: string;
          }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size ?? null,
            color: item.color ?? null,
          })),
        },
      },
      include: {
        items: {
          include: { product: { include: { images: true } } },
        },
      },
    });

    // Deduct credits if used
    if (creditsToUse > 0) {
      await db.user.update({
        where: { id: auth.userId },
        data: { credits: { decrement: creditsToUse } },
      });
      await db.creditTransaction.create({
        data: {
          userId: auth.userId,
          type: "REDEEMED",
          amount: -creditsToUse,
          description: `Redeemed for order ${orderNumber}`,
        },
      });
    }

    // Earn credits — 2% of order total
    const earnedCredits = Math.floor((total ?? 0) * CREDITS_PER_PURCHASE);
    if (earnedCredits > 0) {
      await db.user.update({
        where: { id: auth.userId },
        data: { credits: { increment: earnedCredits } },
      });
      await db.creditTransaction.create({
        data: {
          userId: auth.userId,
          type: "EARNED_PURCHASE",
          amount: earnedCredits,
          description: `Earned from order ${orderNumber}`,
        },
      });
    }

    return Response.json(
      { success: true, data: order } satisfies ApiResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error("[ORDERS/POST]", error);
    return Response.json(
      { success: false, error: "Failed to place order" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<Response> {
  const auth = await requireUser(request);
  if (auth instanceof Response) return auth;

  try {
    const orders = await db.order.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { product: { include: { images: true } } },
        },
      },
    });
    return Response.json({ success: true, data: orders } satisfies ApiResponse);
  } catch (error) {
    console.error("[ORDERS/GET]", error);
    return Response.json(
      { success: false, error: "Failed to fetch orders" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
