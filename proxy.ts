import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken, USER_COOKIE_NAME } from "@/lib/auth";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

// Routes that require a logged-in user
const USER_PROTECTED = [
  "/dashboard",
  "/checkout",
  "/orders",
  "/track-order",
];

// Routes that require admin role
const ADMIN_PROTECTED = ["/admin"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Admin protected routes ───────────────────────────────────────────────
  const isAdminRoute = ADMIN_PROTECTED.some((p) => pathname.startsWith(p));
  const isAdminLoginPage = pathname === "/admin/login";

  if (isAdminRoute && !isAdminLoginPage) {
    const adminToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!adminToken) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    const payload = await verifyAdminToken(adminToken);
    if (!payload) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("from", pathname);
      const res = NextResponse.redirect(url);
      // Clear invalid cookie
      res.cookies.delete(ADMIN_COOKIE_NAME);
      return res;
    }
  }

  // ─── User protected routes ────────────────────────────────────────────────
  const isUserProtected = USER_PROTECTED.some((p) => pathname.startsWith(p));

  if (isUserProtected) {
    const userToken = request.cookies.get(USER_COOKIE_NAME)?.value;
    if (!userToken) {
      const url = new URL("/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    const payload = await verifyUserToken(userToken);
    if (!payload) {
      const url = new URL("/login", request.url);
      url.searchParams.set("from", pathname);
      const res = NextResponse.redirect(url);
      // Clear invalid/expired cookie
      res.cookies.delete(USER_COOKIE_NAME);
      return res;
    }
  }

  // ─── Redirect logged-in users away from /login page only ─────────────────
  if (pathname === "/login") {
    const userToken = request.cookies.get(USER_COOKIE_NAME)?.value;
    if (userToken) {
      const payload = await verifyUserToken(userToken);
      if (payload) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      // Token invalid — clear it and let them through to login
      const res = NextResponse.next();
      res.cookies.delete(USER_COOKIE_NAME);
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/track-order/:path*",
    "/login",
  ],
};
