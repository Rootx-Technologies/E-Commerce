import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { NextRequest } from "next/server";
import type { UserRole } from "@/types";

const USER_JWT_SECRET = new TextEncoder().encode(
  process.env.USER_JWT_SECRET ?? process.env.ADMIN_JWT_SECRET ?? "user-secret-change-in-production"
);
const USER_TOKEN_TTL = "7d";
export const USER_COOKIE_NAME = "user_token";

export interface UserTokenPayload extends JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string | null;
}

// ─── Sign ─────────────────────────────────────────────────────────────────────
export async function signUserToken(
  payload: Omit<UserTokenPayload, keyof JWTPayload>
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(USER_TOKEN_TTL)
    .sign(USER_JWT_SECRET);
}

// ─── Verify ───────────────────────────────────────────────────────────────────
export async function verifyUserToken(
  token: string
): Promise<UserTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, USER_JWT_SECRET);
    return payload as UserTokenPayload;
  } catch {
    return null;
  }
}

// ─── Extract from request ─────────────────────────────────────────────────────
export function getUserTokenFromRequest(request: NextRequest): string | null {
  const cookie = request.cookies.get(USER_COOKIE_NAME)?.value;
  if (cookie) return cookie;
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

// ─── Guard ────────────────────────────────────────────────────────────────────
export async function requireUser(
  request: NextRequest
): Promise<UserTokenPayload | Response> {
  const token = getUserTokenFromRequest(request);
  if (!token) {
    return Response.json(
      { success: false, error: "Please login to continue" },
      { status: 401 }
    );
  }
  const payload = await verifyUserToken(token);
  if (!payload) {
    return Response.json(
      { success: false, error: "Session expired, please login again" },
      { status: 401 }
    );
  }
  return payload;
}

// ─── Cookie string helper ─────────────────────────────────────────────────────
export function makeUserCookie(token: string): string {
  return `${USER_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`;
}

export function clearUserCookie(): string {
  return `${USER_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
