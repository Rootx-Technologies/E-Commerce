import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return Response.json(
        { success: false, error: "Email aur password zaroori hain" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { email } });

    if (!user || user.role !== "ADMIN") {
      return Response.json(
        { success: false, error: "Invalid credentials" } satisfies ApiResponse,
        { status: 401 }
      );
    }

    if (!user.password) {
      return Response.json(
        { success: false, error: "Password login is not enabled for this account" } satisfies ApiResponse,
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return Response.json(
        { success: false, error: "Invalid credentials" } satisfies ApiResponse,
        { status: 401 }
      );
    }

    const token = await signAdminToken({
      userId: user.id,
      email: user.email,
      role: "ADMIN",
    });

    const response = Response.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },
          token,
        },
        message: "Login successful",
      } satisfies ApiResponse,
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.headers.set(
      "Set-Cookie",
      `${ADMIN_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${8 * 60 * 60}`
    );

    return response;
  } catch (error) {
    console.error("[ADMIN/AUTH/LOGIN]", error);
    return Response.json(
      { success: false, error: "Login failed" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

export async function DELETE(): Promise<Response> {
  // Logout — clear cookie
  const response = Response.json(
    { success: true, message: "Logged out" } satisfies ApiResponse,
    { status: 200 }
  );
  response.headers.set(
    "Set-Cookie",
    `${ADMIN_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
  return response;
}
