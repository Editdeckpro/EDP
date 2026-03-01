import { NextResponse } from "next/server";

/** Minimal health check – no auth, no cookies, no heavy deps. Use to verify the app is responding. */
export async function GET() {
  return NextResponse.json({ ok: true, time: Date.now() });
}
