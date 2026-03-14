import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth-server";

export async function POST() {
  try {
    await clearAuthCookie();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to clear session" }, { status: 500 });
  }
}
