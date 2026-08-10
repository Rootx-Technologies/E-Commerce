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
    const order = await db.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, image: true, credits: true } },
        items: {
          include: {
            product: {
              include: { images: true, category: true, brand: true, variants: true },
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
    console.error("[ADMIN/ORDERS/GET/:id]", error);
    return Response.json(
      { success: false, error: "Failed to fetch order" } satisfies ApiResponse,
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
    const { status, paymentStatus, notes } = body;

    const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
    const validPaymentStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];

    if (status && !validStatuses.includes(status)) {
      return Response.json(
        { success: false, error: `Invalid status. Valid values: ${validStatuses.join(", ")}` } satisfies ApiResponse,
        { status: 400 }
      );
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return Response.json(
        { success: false, error: `Invalid payment status. Valid values: ${validPaymentStatuses.join(", ")}` } satisfies ApiResponse,
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
    if (notes !== undefined) updateData.notes = notes;

    const order = await db.order.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: { include: { images: true } } } },
      },
    });

    return Response.json(
      { success: true, data: order, message: "Order updated" } satisfies ApiResponse
    );
  } catch (error) {
    console.error("[ADMIN/ORDERS/PATCH/:id]", error);
    return Response.json(
      { success: false, error: "Failed to update order" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
