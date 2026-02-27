import { NextRequest, NextResponse } from "next/server";
import { getServerSession, getSessionFromToken, setAuthCookie } from "@/lib/auth-server";

const NO_STORE = "no-store, no-cache, must-revalidate";

/** GET – return current session from cookie. Client dedupes/caches; we avoid browser cache. */
export async function GET() {
  const session = await getServerSession();
  const body = session ? { session } : { session: null };
  return NextResponse.json(body, {
    status: 200,
    headers: { "Cache-Control": NO_STORE },
  });
}

/** POST – set session (login). Body: { accessToken: string } or { token: string }. */
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
    return NextResponse.json({ session }, { headers: { "Cache-Control": NO_STORE } });
  } catch (e) {
    console.error("[auth/session] POST error:", e);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
