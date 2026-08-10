import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { NextRequest } from "next/server";

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? "admin-super-secret-change-in-production"
);
const ADMIN_TOKEN_TTL = "8h";
export const ADMIN_COOKIE_NAME = "admin_token";

export interface AdminTokenPayload extends JWTPayload {
  userId: string;
  email: string;
  role: "ADMIN";
}

// ─── Sign ────────────────────────────────────────────────────────────────────

export async function signAdminToken(
  payload: Omit<AdminTokenPayload, keyof JWTPayload>
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ADMIN_TOKEN_TTL)
    .sign(ADMIN_JWT_SECRET);
}

// ─── Verify ──────────────────────────────────────────────────────────────────

export async function verifyAdminToken(
  token: string
): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    if (payload.role !== "ADMIN") return null;
    return payload as AdminTokenPayload;
  } catch {
    return null;
  }
}

// ─── Extract from request ────────────────────────────────────────────────────

export function getAdminTokenFromRequest(request: NextRequest): string | null {
  // 1. Try cookie first
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (cookie) return cookie;

  // 2. Fall back to Authorization header
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);

  return null;
}

// ─── Guard — use at top of every protected admin route ───────────────────────

export async function requireAdmin(
  request: NextRequest
): Promise<AdminTokenPayload | Response> {
  const token = getAdminTokenFromRequest(request);
  if (!token) {
    return Response.json(
      { success: false, error: "Unauthorized — no token" },
      { status: 401 }
    );
  }

  const payload = await verifyAdminToken(token);
  if (!payload) {
    return Response.json(
      { success: false, error: "Unauthorized — invalid or expired token" },
      { status: 401 }
    );
  }

  return payload;
}
