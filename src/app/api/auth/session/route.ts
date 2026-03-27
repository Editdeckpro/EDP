import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth-server";

export async function GET() {
  return NextResponse.json(
    { error: "moved", message: "Use backend GET /api/user with credentials for session" },
    { status: 410 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }
    await setAuthCookie(token);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to set session" }, { status: 500 });
  }
}
