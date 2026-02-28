import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  getSessionFromTokenString,
  buildSetCookieHeader,
} from "@/lib/auth-route-helpers";

/** Use Node runtime; avoid next/headers cookies() to prevent serialization SyntaxError. */
export const runtime = "nodejs";

const NO_STORE = "no-store, no-cache, must-revalidate";

/** Plain object only so JSON never hits getters/proxies. */
function plainSession(session: { user: unknown; accessToken: string } | null): { session: unknown } {
  if (!session) return { session: null };
  try {
    return { session: JSON.parse(JSON.stringify(session)) };
  } catch {
    return { session: null };
  }
}

/** GET – read cookie from request (no cookies() call). */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const session = getSessionFromTokenString(token);
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
    } catch {
      return new NextResponse('{"session":null}', {
        status: 200,
        headers: { "Content-Type": "application/json", "Cache-Control": NO_STORE },
      });
    }
  }
}

/** POST – set session (login). Set cookie via header (no cookies() call). */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const accessToken =
      typeof body?.accessToken === "string" ? body.accessToken : typeof body?.token === "string" ? body.token : null;
    if (!accessToken) {
      return NextResponse.json({ error: "Missing accessToken" }, { status: 400 });
    }
    const session = getSessionFromTokenString(accessToken);
    if (!session) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const setCookie = buildSetCookieHeader(accessToken);
    return NextResponse.json(plainSession(session), {
      status: 200,
      headers: { "Cache-Control": NO_STORE, "Set-Cookie": setCookie },
    });
  } catch (e) {
    console.error("[auth/session] POST error:", e);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
