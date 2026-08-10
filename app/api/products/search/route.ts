import { NextRequest } from "next/server";
import type { ApiResponse, Product } from "@/types";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const limit = Math.min(10, Number(searchParams.get("limit") ?? 6));

    if (!q || q.length < 2) {
      return Response.json({ success: true, data: [] } satisfies ApiResponse<Product[]>);
    }

    const { db } = await import("@/lib/db");

    const products = await db.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { category: { name: { contains: q, mode: "insensitive" } } },
          { brand: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      take: limit,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
        brand: true,
      },
      orderBy: { reviewCount: "desc" },
    });

    return Response.json({
      success: true,
      data: products,
    } satisfies ApiResponse<unknown[]>);
  } catch (error) {
    console.error("[PRODUCTS/SEARCH]", error);
    return Response.json(
      { success: false, error: "Search failed" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
