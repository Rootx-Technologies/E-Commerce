import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

// Simple in-memory store for now (production: use DB table)
// For a real implementation, you'd add a StockAlert model to Prisma

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { productId, email } = await request.json();

    if (!productId || !email) {
      return Response.json(
        { success: false, error: "productId and email required" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { success: false, error: "Invalid email address" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Check product exists
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, stock: true },
    });

    if (!product) {
      return Response.json(
        { success: false, error: "Product not found" } satisfies ApiResponse,
        { status: 404 }
      );
    }

    if (product.stock > 0) {
      return Response.json(
        { success: false, error: "This product is already in stock!" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // In production: save to a StockAlert DB table
    // For now: log and return success
    console.log(`[STOCK ALERT] ${email} wants notification for: ${product.name} (${productId})`);

    return Response.json(
      {
        success: true,
        message: `We'll notify ${email} when ${product.name} is back in stock`,
      } satisfies ApiResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error("[STOCK_ALERT/POST]", error);
    return Response.json(
      { success: false, error: "Failed to set up alert" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
