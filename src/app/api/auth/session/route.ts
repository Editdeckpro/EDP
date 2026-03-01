import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  getSessionFromTokenString,
  buildSetCookieHeader,
} from "@/lib/auth-route-helpers";

/** Use Node runtime; avoid next/headers cookies() to prevent serialization SyntaxError. */
export const runtime = "nodejs";

const NO_STORE = "no-store, no-cache, must-revalidate";

/** Parse token from raw Cookie header to avoid request.cookies proxy (can trigger SyntaxError in Next). */
function getTokenFromCookieHeader(cookieHeader: string | null): string | null {
  if (!cookieHeader || typeof cookieHeader !== "string") return null;
  const prefix = `${AUTH_COOKIE_NAME}=`;
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      const value = trimmed.slice(prefix.length).trim();
      return value.length > 0 ? value : null;
    }
  }
  return null;
}

/** Plain object only so JSON never hits getters/proxies. */
function plainSession(session: { user: unknown; accessToken: string } | null): { session: unknown } {
  if (!session) return { session: null };
  try {
    return { session: JSON.parse(JSON.stringify(session)) };
  } catch {
    return { session: null };
  }
}

/** GET – read token from Cookie header only (no request.cookies proxy). */
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromCookieHeader(request.headers.get("cookie"));
    const session = getSessionFromTokenString(token ?? undefined);
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
