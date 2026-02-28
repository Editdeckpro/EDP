import { NextResponse } from "next/server";
import { buildClearCookieHeader } from "@/lib/auth-route-helpers";

/** Use Node runtime; clear cookie via header only (no next/headers cookies() call). */
export const runtime = "nodejs";

/** POST – clear auth cookie (sign out). */
export async function POST() {
  const setCookie = buildClearCookieHeader();
  return NextResponse.json({ ok: true }, {
    headers: { "Set-Cookie": setCookie },
  });
}
