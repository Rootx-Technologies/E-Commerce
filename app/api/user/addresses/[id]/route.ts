import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireUser(request);
  if (auth instanceof Response) return auth;
  const { id } = await params;

  try {
    await db.address.deleteMany({ where: { id, userId: auth.userId } });
    return Response.json({ success: true, message: "Address deleted" } satisfies ApiResponse);
  } catch (error) {
    console.error("[ADDRESSES/DELETE]", error);
    return Response.json(
      { success: false, error: "Failed to delete address" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireUser(request);
  if (auth instanceof Response) return auth;
  const { id } = await params;

  try {
    const body = await request.json();

    if (body.isDefault) {
      await db.address.updateMany({
        where: { userId: auth.userId },
        data: { isDefault: false },
      });
    }

    const address = await db.address.updateMany({
      where: { id, userId: auth.userId },
      data: {
        fullName: body.fullName,
        phone: body.phone,
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2 || null,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        country: body.country || "Pakistan",
        isDefault: body.isDefault ?? false,
      },
    });

    return Response.json(
      { success: true, data: address, message: "Address updated" } satisfies ApiResponse
    );
  } catch (error) {
    console.error("[ADDRESSES/PATCH]", error);
    return Response.json(
      { success: false, error: "Failed to update address" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
