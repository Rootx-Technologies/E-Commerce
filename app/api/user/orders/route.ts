import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest): Promise<Response> {
  const auth = await requireUser(request);
  if (auth instanceof Response) return auth;

  try {
    const orders = await db.order.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: { include: { images: true } },
          },
        },
      },
    });

    return Response.json({ success: true, data: orders } satisfies ApiResponse);
  } catch (error) {
    console.error("[USER/ORDERS]", error);
    return Response.json(
      { success: false, error: "Failed to fetch orders" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
