import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
      include: {
        parent: { select: { id: true, name: true } },
        _count: { select: { products: true, children: true } },
      },
    });
    return Response.json({ success: true, data: categories } satisfies ApiResponse);
  } catch (error) {
    console.error("[ADMIN/CATEGORIES/GET]", error);
    return Response.json(
      { success: false, error: "Failed to fetch categories" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const { name, slug, image, description, parentId } = body;

    if (!name || !slug) {
      return Response.json(
        { success: false, error: "Name and slug are required" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    const existing = await db.category.findUnique({ where: { slug } });
    if (existing) {
      return Response.json(
        { success: false, error: "Slug already exists" } satisfies ApiResponse,
        { status: 409 }
      );
    }

    const category = await db.category.create({
      data: { name, slug, image: image || null, description: description || null, parentId: parentId || null },
      include: { parent: { select: { id: true, name: true } }, _count: { select: { products: true } } },
    });

    return Response.json(
      { success: true, data: category, message: "Category created" } satisfies ApiResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error("[ADMIN/CATEGORIES/POST]", error);
    return Response.json(
      { success: false, error: "Failed to create category" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
