import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    let settings = await db.siteSetting.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await db.siteSetting.create({
        data: {
          id: "default",
          siteName: "Marqet",
          description: "Your premium destination for luxury fashion, electronics, and branded products. Quality you can trust, style you can feel.",
          phone: "+92 302 7372812",
          email: "support@faizan.com",
          address: "Lahore, Punjab, Pakistan",
          socialLinks: {
            instagram: "https://instagram.com/faizan",
            facebook: "https://facebook.com/faizan",
            twitter: "https://twitter.com/faizan",
            youtube: "https://youtube.com/faizan",
          },
          footerLinks: {
            shop: [
              { label: "New Arrivals", href: "/products?filter=new" },
              { label: "Best Sellers", href: "/products?filter=bestseller" },
              { label: "Flash Sales", href: "/deals" },
              { label: "All Products", href: "/products" },
              { label: "Brands", href: "/brands" },
            ],
            support: [
              { label: "Track Order", href: "/track-order" },
              { label: "Returns & Exchanges", href: "/returns" },
              { label: "Shipping Policy", href: "/shipping" },
              { label: "FAQ", href: "/faq" },
              { label: "Contact Us", href: "/contact" },
            ],
            company: [
              { label: "About Us", href: "/about" },
              { label: "Careers", href: "/careers" },
              { label: "Press", href: "/press" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
            ],
          },
        },
      });
    }

    return Response.json({ success: true, data: settings } satisfies ApiResponse);
  } catch (error) {
    console.error("[ADMIN/SETTINGS/GET]", error);
    return Response.json(
      { success: false, error: "Failed to fetch admin settings" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const { siteName, description, phone, email, address, socialLinks, footerLinks } = body;

    const settings = await db.siteSetting.upsert({
      where: { id: "default" },
      update: {
        ...(siteName != null && { siteName }),
        ...(description != null && { description }),
        ...(phone != null && { phone }),
        ...(email != null && { email }),
        ...(address != null && { address }),
        ...(socialLinks != null && { socialLinks }),
        ...(footerLinks != null && { footerLinks }),
      },
      create: {
        id: "default",
        siteName: siteName ?? "Marqet",
        description: description ?? "Your premium destination for luxury fashion, electronics, and branded products. Quality you can trust, style you can feel.",
        phone: phone ?? "+92 302 7372812",
        email: email ?? "support@faizan.com",
        address: address ?? "Lahore, Punjab, Pakistan",
        socialLinks: socialLinks ?? {},
        footerLinks: footerLinks ?? {},
      },
    });

    return Response.json({ success: true, data: settings, message: "Settings updated successfully" } satisfies ApiResponse);
  } catch (error) {
    console.error("[ADMIN/SETTINGS/PUT]", error);
    return Response.json(
      { success: false, error: "Failed to update settings" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
