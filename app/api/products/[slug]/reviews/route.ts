import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

type Params = { params: Promise<{ slug: string }> };

// GET — fetch reviews for a product
export async function GET(request: NextRequest, { params }: Params): Promise<Response> {
  const { slug } = await params;

  try {
    const product = await db.product.findUnique({ where: { slug } });
    if (!product) {
      return Response.json(
        { success: false, error: "Product not found" } satisfies ApiResponse,
        { status: 404 }
      );
    }

    const reviews = await db.review.findMany({
      where: { productId: product.id },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return Response.json({ success: true, data: reviews } satisfies ApiResponse);
  } catch (error) {
    console.error("[REVIEWS/GET]", error);
    return Response.json(
      { success: false, error: "Failed to fetch reviews" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

// POST — submit a review
export async function POST(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireUser(request);
  if (auth instanceof Response) return auth;

  const { slug } = await params;

  try {
    const body = await request.json();
    const { rating, title, body: reviewBody } = body;

    if (!rating || rating < 1 || rating > 5) {
      return Response.json(
        { success: false, error: "Rating must be between 1 and 5" } satisfies ApiResponse,
        { status: 400 }
      );
    }
    if (!reviewBody?.trim()) {
      return Response.json(
        { success: false, error: "Review text is required" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    const product = await db.product.findUnique({ where: { slug } });
    if (!product) {
      return Response.json(
        { success: false, error: "Product not found" } satisfies ApiResponse,
        { status: 404 }
      );
    }

    // Check if user already reviewed this product
    const existing = await db.review.findUnique({
      where: { userId_productId: { userId: auth.userId, productId: product.id } },
    });
    if (existing) {
      return Response.json(
        { success: false, error: "You have already reviewed this product" } satisfies ApiResponse,
        { status: 409 }
      );
    }

    // Check if user has purchased this product (verified review)
    const hasPurchased = await db.orderItem.findFirst({
      where: {
        productId: product.id,
        order: { userId: auth.userId, status: { in: ["DELIVERED", "CONFIRMED"] } },
      },
    });

    const review = await db.review.create({
      data: {
        userId: auth.userId,
        productId: product.id,
        rating: Number(rating),
        title: title?.trim() || null,
        body: reviewBody.trim(),
        isVerified: !!hasPurchased,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    // Update product rating + reviewCount
    const allReviews = await db.review.findMany({
      where: { productId: product.id },
      select: { rating: true },
    });
    const avgRating = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await db.product.update({
      where: { id: product.id },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length,
      },
    });

    return Response.json(
      { success: true, data: review, message: "Review submitted!" } satisfies ApiResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error("[REVIEWS/POST]", error);
    return Response.json(
      { success: false, error: "Failed to submit review" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

// DELETE — delete own review
export async function DELETE(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireUser(request);
  if (auth instanceof Response) return auth;

  const { slug } = await params;

  try {
    const product = await db.product.findUnique({ where: { slug } });
    if (!product) {
      return Response.json(
        { success: false, error: "Product not found" } satisfies ApiResponse,
        { status: 404 }
      );
    }

    await db.review.deleteMany({
      where: { userId: auth.userId, productId: product.id },
    });

    return Response.json({ success: true, message: "Review deleted" } satisfies ApiResponse);
  } catch (error) {
    console.error("[REVIEWS/DELETE]", error);
    return Response.json(
      { success: false, error: "Failed to delete review" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
