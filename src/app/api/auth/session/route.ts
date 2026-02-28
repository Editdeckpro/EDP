import { NextRequest, NextResponse } from "next/server";
import { getServerSession, getSessionFromTokenJwtOnly, setAuthCookie } from "@/lib/auth-server";

/** Use Node runtime so cookies() and imports are stable (avoids Edge serialization/syntax issues). */
export const runtime = "nodejs";

const NO_STORE = "no-store, no-cache, must-revalidate";

/** Clone to plain object so JSON serialization never hits getters/proxies (avoids "missing ) after argument list" etc.). */
function plainSession(session: { user: unknown; accessToken: string } | null): { session: unknown } {
  if (!session) return { session: null };
  try {
    return { session: JSON.parse(JSON.stringify(session)) };
  } catch {
    return { session: null };
  }
}

/** GET – return current session from cookie. Any error (including SyntaxError from getters) returns 200 { session: null }. */
export async function GET() {
  try {
    const session = await getServerSession();
    const body = plainSession(session);
    return NextResponse.json(body, {
      status: 200,
      headers: { "Cache-Control": NO_STORE },
    });
  } catch (e) {
    console.error("[auth/session] GET error:", e);
    try {
      return NextResponse.json({ session: null }, {
        status: 200,
        headers: { "Cache-Control": NO_STORE },
      });
    } catch (fallbackErr) {
      console.error("[auth/session] GET fallback error:", fallbackErr);
      return new NextResponse('{"session":null}', {
        status: 200,
        headers: { "Content-Type": "application/json", "Cache-Control": NO_STORE },
      });
    }
  }
}

/** POST – set session (login). Body: { accessToken: string } or { token: string }. Uses JWT only so it never hangs when backend is stuck. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const accessToken =
      typeof body?.accessToken === "string" ? body.accessToken : typeof body?.token === "string" ? body.token : null;
    if (!accessToken) {
      return NextResponse.json({ error: "Missing accessToken" }, { status: 400 });
    }
    const session = getSessionFromTokenJwtOnly(accessToken);
    await setAuthCookie(accessToken);
    return NextResponse.json(plainSession(session), { headers: { "Cache-Control": NO_STORE } });
  } catch (e) {
    console.error("[auth/session] POST error:", e);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
