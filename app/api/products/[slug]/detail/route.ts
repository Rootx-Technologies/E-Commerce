import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params): Promise<Response> {
  const { slug } = await params;

  try {
    // Try by slug first, then by ID
    const product = await db.product.findFirst({
      where: { OR: [{ slug }, { id: slug }], isActive: true },
      include: {
        images: true,
        variants: true,
        category: true,
        brand: true,
      },
    });

    if (!product) {
      return Response.json(
        { success: false, error: "Product not found" } satisfies ApiResponse,
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: product } satisfies ApiResponse);
  } catch (error) {
    console.error("[PRODUCTS/DETAIL]", error);
    return Response.json(
      { success: false, error: "Failed to fetch product" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
