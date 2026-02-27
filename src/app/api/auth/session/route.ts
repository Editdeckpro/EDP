import { NextRequest, NextResponse } from "next/server";
import { getServerSession, getSessionFromToken, setAuthCookie } from "@/lib/auth-server";

/** GET – return current session from cookie (for useSession / getSession). */
export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ session: null }, { status: 200 });
  }
  return NextResponse.json({ session });
}

/** POST – set session (login). Body: { accessToken: string }. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const accessToken =
      typeof body?.accessToken === "string" ? body.accessToken : typeof body?.token === "string" ? body.token : null;
    if (!accessToken) {
      return NextResponse.json({ error: "Missing accessToken" }, { status: 400 });
    }
    const session = await getSessionFromToken(accessToken);
    await setAuthCookie(accessToken);
    return NextResponse.json({ session });
  } catch (e) {
    console.error("[auth/session] POST error:", e);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
