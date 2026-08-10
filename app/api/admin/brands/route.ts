import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const brands = await db.brand.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return Response.json({ success: true, data: brands } satisfies ApiResponse);
  } catch (error) {
    console.error("[ADMIN/BRANDS/GET]", error);
    return Response.json(
      { success: false, error: "Failed to fetch brands" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const { name, slug, logo } = body;

    if (!name || !slug) {
      return Response.json(
        { success: false, error: "Name and slug are required" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    const existing = await db.brand.findUnique({ where: { slug } });
    if (existing) {
      return Response.json(
        { success: false, error: "Slug already exists" } satisfies ApiResponse,
        { status: 409 }
      );
    }

    const brand = await db.brand.create({
      data: { name, slug, logo: logo || null },
      include: { _count: { select: { products: true } } },
    });

    return Response.json(
      { success: true, data: brand, message: "Brand created" } satisfies ApiResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error("[ADMIN/BRANDS/POST]", error);
    return Response.json(
      { success: false, error: "Failed to create brand" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
