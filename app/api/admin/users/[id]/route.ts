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
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        credits: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        orders: {
          take: 10,
          orderBy: { createdAt: "desc" },
          select: { id: true, orderNumber: true, status: true, total: true, createdAt: true },
        },
        _count: { select: { orders: true, reviews: true, wishlistItems: true } },
      },
    });

    if (!user) {
      return Response.json(
        { success: false, error: "User not found" } satisfies ApiResponse,
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: user } satisfies ApiResponse);
  } catch (error) {
    console.error("[ADMIN/USERS/GET/:id]", error);
    return Response.json(
      { success: false, error: "Failed to fetch user" } satisfies ApiResponse,
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
    const { name, role, credits, emailVerified } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) {
      if (!["USER", "ADMIN"].includes(role)) {
        return Response.json(
          { success: false, error: "Invalid role. Must be USER or ADMIN" } satisfies ApiResponse,
          { status: 400 }
        );
      }
      updateData.role = role;
    }
    if (credits !== undefined) updateData.credits = Number(credits);
    if (emailVerified !== undefined) updateData.emailVerified = Boolean(emailVerified);

    const user = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true, name: true, email: true, image: true,
        role: true, credits: true, emailVerified: true, createdAt: true,
      },
    });

    return Response.json(
      { success: true, data: user, message: "User updated" } satisfies ApiResponse
    );
  } catch (error) {
    console.error("[ADMIN/USERS/PATCH/:id]", error);
    return Response.json(
      { success: false, error: "Failed to update user" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const { id } = await params;

  // Prevent self-deletion
  if (auth.userId === id) {
    return Response.json(
      { success: false, error: "You cannot delete your own admin account" } satisfies ApiResponse,
      { status: 403 }
    );
  }

  try {
    await db.user.delete({ where: { id } });
    return Response.json({ success: true, message: "User deleted" } satisfies ApiResponse);
  } catch (error) {
    console.error("[ADMIN/USERS/DELETE/:id]", error);
    return Response.json(
      { success: false, error: "Failed to delete user" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
