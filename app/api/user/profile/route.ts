import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { signUserToken, makeUserCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";
import type { ApiResponse } from "@/types";

// GET — current user profile
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
        addresses: { orderBy: { isDefault: "desc" } },
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
    console.error("[USER/PROFILE/GET]", error);
    return Response.json(
      { success: false, error: "Failed to fetch profile" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

// PATCH — update name or password
export async function PATCH(request: NextRequest): Promise<Response> {
  const auth = await requireUser(request);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const { name, currentPassword, newPassword } = body;

    const user = await db.user.findUnique({ where: { id: auth.userId } });
    if (!user) {
      return Response.json(
        { success: false, error: "User not found" } satisfies ApiResponse,
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    // Update name
    if (name?.trim()) {
      updateData.name = name.trim();
    }

    // Update password
    if (newPassword) {
      if (!currentPassword) {
        return Response.json(
          { success: false, error: "Current password is required to set a new password" } satisfies ApiResponse,
          { status: 400 }
        );
      }
      if (!user.password) {
        return Response.json(
          { success: false, error: "Password login is not enabled for this account" } satisfies ApiResponse,
          { status: 400 }
        );
      }
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return Response.json(
          { success: false, error: "Current password is incorrect" } satisfies ApiResponse,
          { status: 400 }
        );
      }
      if (newPassword.length < 6) {
        return Response.json(
          { success: false, error: "New password must be at least 6 characters" } satisfies ApiResponse,
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    if (Object.keys(updateData).length === 0) {
      return Response.json(
        { success: false, error: "Nothing to update" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    const updated = await db.user.update({
      where: { id: auth.userId },
      data: updateData,
      select: { id: true, name: true, email: true, image: true, role: true, credits: true, emailVerified: true, createdAt: true },
    });

    // Re-issue token with updated name
    const newToken = await signUserToken({
      userId: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role as "USER" | "ADMIN",
      image: updated.image,
    });

    const response = Response.json(
      {
        success: true,
        data: { user: updated, token: newToken },
        message: "Profile updated successfully",
      } satisfies ApiResponse
    );
    response.headers.set("Set-Cookie", makeUserCookie(newToken));
    return response;
  } catch (error) {
    console.error("[USER/PROFILE/PATCH]", error);
    return Response.json(
      { success: false, error: "Failed to update profile" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
