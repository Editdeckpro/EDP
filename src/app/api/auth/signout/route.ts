import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth-server";

/** POST – clear auth cookie (sign out). */
export async function POST() {
  await clearAuthCookie();
  return NextResponse.json({ ok: true });
}
