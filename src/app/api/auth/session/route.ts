import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    { error: "moved" },
    { status: 410 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }
    const response = NextResponse.json({ ok: true });
    response.cookies.set("edp_auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Failed to set session" }, { status: 500 });
  }
}