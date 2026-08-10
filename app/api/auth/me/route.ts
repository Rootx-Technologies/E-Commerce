import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest): Promise<Response> {
  const auth = await requireUser(request);
  if (auth instanceof Response) return auth;

  try {
    const user = await db.user.findUnique({
      where: { id: auth.userId },
      select: {
        id: true, name: true, email: true,
        image: true, role: true, credits: true,
        emailVerified: true, createdAt: true,
      },
    });

    if (!user) {
      return Response.json(
        { success: false, error: "User not found" } satisfies ApiResponse,
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: { ...user, createdAt: user.createdAt.toISOString() },
    } satisfies ApiResponse);
  } catch (error) {
    console.error("[AUTH/ME]", error);
    return Response.json(
      { success: false, error: "Failed to fetch user" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
