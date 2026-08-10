import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signUserToken, makeUserCookie } from "@/lib/auth";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email?.trim() || !password) {
      return Response.json(
        { success: false, error: "Email and password are required" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.password) {
      return Response.json(
        { success: false, error: "Invalid email or password" } satisfies ApiResponse,
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return Response.json(
        { success: false, error: "Invalid email or password" } satisfies ApiResponse,
        { status: 401 }
      );
    }

    const token = await signUserToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "USER" | "ADMIN",
      image: user.image,
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
            role: user.role,
            credits: user.credits,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt.toISOString(),
          },
          token,
        },
        message: "Login successful",
      } satisfies ApiResponse,
      { status: 200 }
    );

    response.headers.set("Set-Cookie", makeUserCookie(token));
    return response;
  } catch (error) {
    console.error("[AUTH/LOGIN]", error);
    return Response.json(
      { success: false, error: "Login failed. Please try again." } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
