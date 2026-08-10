import { NextRequest } from "next/server";
import type { ApiResponse } from "@/types";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      paymentIntentId,
      couponCode,
      creditsUsed,
      subtotal,
      discount,
      shipping,
      tax,
      total,
    } = body;

    if (!items?.length || !shippingAddress || !paymentMethod) {
      return Response.json(
        { success: false, error: "Missing required fields" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();

    // In production: save to DB via getDb()
    const order = {
      id: crypto.randomUUID(),
      orderNumber,
      status: paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
      paymentMethod,
      paymentIntentId,
      shippingAddress,
      billingAddress: billingAddress ?? shippingAddress,
      subtotal,
      discount: discount ?? 0,
      shipping: shipping ?? 0,
      tax: tax ?? 0,
      total,
      couponCode,
      creditsUsed: creditsUsed ?? 0,
      items,
      createdAt: new Date().toISOString(),
    };

    return Response.json(
      { success: true, data: order } satisfies ApiResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error("[ORDERS/POST]", error);
    return Response.json(
      { success: false, error: "Failed to create order" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

export async function GET(): Promise<Response> {
  // Returns mock orders — connect to DB when ready
  return Response.json({ success: true, data: [] } satisfies ApiResponse);
}
