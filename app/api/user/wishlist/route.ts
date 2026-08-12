import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

// GET — fetch user's wishlist from DB
export async function GET(request: NextRequest): Promise<Response> {
  const auth = await requireUser(request);
  if (auth instanceof Response) return auth;

  try {
    const items = await db.wishlistItem.findMany({
      where: { userId: auth.userId },
      orderBy: { addedAt: "desc" },
      include: {
        product: {
          include: { images: true, variants: true, category: true, brand: true },
        },
      },
    });
    return Response.json({ success: true, data: items } satisfies ApiResponse);
  } catch (error) {
    console.error("[WISHLIST/GET]", error);
    return Response.json(
      { success: false, error: "Failed to fetch wishlist" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

// POST — add product to wishlist
export async function POST(request: NextRequest): Promise<Response> {
  const auth = await requireUser(request);
  if (auth instanceof Response) return auth;

  try {
    const { productId } = await request.json();
    if (!productId) {
      return Response.json(
        { success: false, error: "productId required" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    await db.wishlistItem.upsert({
      where: { userId_productId: { userId: auth.userId, productId } },
      update: {},
      create: { userId: auth.userId, productId },
    });

    return Response.json(
      { success: true, message: "Added to wishlist" } satisfies ApiResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error("[WISHLIST/POST]", error);
    return Response.json(
      { success: false, error: "Failed to add to wishlist" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

// DELETE — remove product from wishlist
export async function DELETE(request: NextRequest): Promise<Response> {
  const auth = await requireUser(request);
  if (auth instanceof Response) return auth;

  try {
    const { productId } = await request.json();
    if (!productId) {
      return Response.json(
        { success: false, error: "productId required" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    await db.wishlistItem.deleteMany({
      where: { userId: auth.userId, productId },
    });

    return Response.json(
      { success: true, message: "Removed from wishlist" } satisfies ApiResponse
    );
  } catch (error) {
    console.error("[WISHLIST/DELETE]", error);
    return Response.json(
      { success: false, error: "Failed to remove from wishlist" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
