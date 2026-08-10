import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const { name, email, password } = body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!name?.trim() || !email?.trim() || !password) {
      return Response.json(
        { success: false, error: "Name, email and password are required" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { success: false, error: "Invalid email address" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { success: false, error: "Password must be at least 6 characters" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json(
        { success: false, error: "An account with this email already exists" } satisfies ApiResponse,
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    // Generate unique referral code
    const referralCode = `REF${Date.now().toString(36).toUpperCase()}`;

    const user = await db.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashed,
        role: "USER",
        emailVerified: false,
        referralCode,
      },
    });

    // Return success without setting a cookie — user must login manually
    return Response.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        },
        message: "Account created successfully. Please sign in.",
      } satisfies ApiResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error("[AUTH/REGISTER]", error);
    return Response.json(
      { success: false, error: "Registration failed. Please try again." } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
