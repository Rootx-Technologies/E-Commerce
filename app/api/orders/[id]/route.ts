import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

type Params = { params: Promise<{ id: string }> };

// PATCH — cancel order (user can only cancel PENDING or CONFIRMED orders)
export async function PATCH(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireUser(request);
  if (auth instanceof Response) return auth;
  const { id } = await params;

  try {
    const order = await db.order.findFirst({
      where: { id, userId: auth.userId },
    });

    if (!order) {
      return Response.json(
        { success: false, error: "Order not found" } satisfies ApiResponse,
        { status: 404 }
      );
    }

    // Only PENDING or CONFIRMED orders can be cancelled
    if (!["PENDING", "CONFIRMED"].includes(order.status)) {
      return Response.json(
        { success: false, error: `Cannot cancel an order with status: ${order.status}` } satisfies ApiResponse,
        { status: 400 }
      );
    }

    const updated = await db.order.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    // Refund credits if used
    if (order.creditsUsed > 0) {
      await db.user.update({
        where: { id: auth.userId },
        data: { credits: { increment: order.creditsUsed } },
      });
      await db.creditTransaction.create({
        data: {
          userId: auth.userId,
          type: "EARNED_PROMOTION",
          amount: order.creditsUsed,
          description: `Credits refunded for cancelled order ${order.orderNumber}`,
        },
      });
    }

    return Response.json(
      { success: true, data: updated, message: "Order cancelled successfully" } satisfies ApiResponse
    );
  } catch (error) {
    console.error("[ORDERS/CANCEL]", error);
    return Response.json(
      { success: false, error: "Failed to cancel order" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
