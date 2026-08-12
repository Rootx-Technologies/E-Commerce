import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest): Promise<Response> {
  const auth = await requireUser(request);
  if (auth instanceof Response) return auth;

  try {
    const addresses = await db.address.findMany({
      where: { userId: auth.userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return Response.json({ success: true, data: addresses } satisfies ApiResponse);
  } catch (error) {
    console.error("[ADDRESSES/GET]", error);
    return Response.json(
      { success: false, error: "Failed to fetch addresses" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  const auth = await requireUser(request);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = body;

    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      return Response.json(
        { success: false, error: "All required fields must be filled" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // If setting as default, unset others
    if (isDefault) {
      await db.address.updateMany({
        where: { userId: auth.userId },
        data: { isDefault: false },
      });
    }

    const address = await db.address.create({
      data: {
        userId: auth.userId,
        fullName, phone, addressLine1,
        addressLine2: addressLine2 || null,
        city, state, postalCode,
        country: country || "Pakistan",
        isDefault: isDefault ?? false,
      },
    });

    return Response.json(
      { success: true, data: address, message: "Address saved" } satisfies ApiResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error("[ADDRESSES/POST]", error);
    return Response.json(
      { success: false, error: "Failed to save address" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
