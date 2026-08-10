import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("orderNumber")?.trim().toUpperCase();

  if (!orderNumber) {
    return Response.json(
      { success: false, error: "Order number is required" } satisfies ApiResponse,
      { status: 400 }
    );
  }

  try {
    const order = await db.order.findUnique({
      where: { orderNumber },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        paymentMethod: true,
        shippingAddress: true,
        subtotal: true,
        discount: true,
        shipping: true,
        tax: true,
        total: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: {
              select: { id: true, name: true, images: { where: { isPrimary: true }, take: 1 } },
            },
          },
        },
      },
    });

    if (!order) {
      return Response.json(
        { success: false, error: "Order not found" } satisfies ApiResponse,
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: order } satisfies ApiResponse);
  } catch (error) {
    console.error("[ORDERS/TRACK]", error);
    return Response.json(
      { success: false, error: "Failed to track order" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
