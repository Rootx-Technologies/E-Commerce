import { db } from "@/lib/db";
import type { ApiResponse } from "@/types";

export async function GET(): Promise<Response> {
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
    console.error("[SETTINGS/GET]", error);
    return Response.json(
      { success: false, error: "Failed to fetch settings" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
