import { NextRequest, NextResponse } from "next/server";

const PASSTHROUGH_PREFIXES = [
  "/api",
  "/_next",
  "/login",
  "/signup",
  "/oauth/callback",
  "/set-password",
  "/forget",
  "/reset-password",
];

function isPassthrough(pathname: string): boolean {
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return true;
  return PASSTHROUGH_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").toLowerCase();

  if (host.startsWith("app.")) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (isPassthrough(pathname)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/site" : `/site${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
