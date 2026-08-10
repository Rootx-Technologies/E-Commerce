import { clearUserCookie } from "@/lib/auth";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import type { ApiResponse } from "@/types";

/**
 * GET /api/auth/clear
 * Clears all auth cookies — use this if login/register pages are not opening.
 * Visit: http://localhost:3000/api/auth/clear
 */
export async function GET(): Promise<Response> {
  const response = Response.json(
    { success: true, message: "All auth cookies cleared. You can now login." } satisfies ApiResponse,
    { status: 200 }
  );
  response.headers.append("Set-Cookie", clearUserCookie());
  response.headers.append(
    "Set-Cookie",
    `${ADMIN_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
  return response;
}
