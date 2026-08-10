import { clearUserCookie } from "@/lib/auth";
import type { ApiResponse } from "@/types";

export async function POST(): Promise<Response> {
  const response = Response.json(
    { success: true, message: "Logged out successfully" } satisfies ApiResponse,
    { status: 200 }
  );
  response.headers.set("Set-Cookie", clearUserCookie());
  return response;
}
