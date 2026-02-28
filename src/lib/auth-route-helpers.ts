/**
 * Helpers for auth API routes (session, signout) that do NOT use next/headers cookies().
 * Use these in route handlers to avoid the "SyntaxError: missing ) after argument list"
 * that can occur when Next.js serializes the cookies() proxy.
 */

import { jwtDecode, JwtPayload } from "jwt-decode";
import { Session, SessionUser } from "@/types/auth";

export const AUTH_COOKIE_NAME = "edp_auth_token";

interface DecodedJWT extends JwtPayload {
  username: string;
  userId?: number;
  name?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
}

function buildMinimalSessionFromJwt(
  decoded: DecodedJWT,
  subscriptionExpired = false
): SessionUser {
  const nameParts = (decoded.name ?? "").trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") ?? "";
  const planType = subscriptionExpired
    ? "FREE"
    : (decoded.subscriptionPlan === "STARTER" ||
       decoded.subscriptionPlan === "NEXT_LEVEL" ||
       decoded.subscriptionPlan === "PRO_STUDIO"
        ? decoded.subscriptionPlan
        : "FREE");
  return {
    id: decoded.userId ?? 0,
    firstName,
    lastName,
    email: "",
    username: decoded.username ?? "",
    profileImage: undefined,
    ...(subscriptionExpired && { subscriptionExpired: true }),
    generationsUsedThisMonth: 0,
    monthlyLimit: null,
    bypassSubscription: false,
    subscription: {
      planType,
      status: subscriptionExpired ? "expired" : (decoded.subscriptionStatus ?? "active"),
      interval: "yearly",
      currentPeriodEnd: "",
      cancelAtPeriodEnd: false,
      features: [],
    },
  };
}

/** Build session from raw token string (no cookies() call). Use in route handlers. */
export function getSessionFromTokenString(token: string | undefined): Session | null {
  if (!token) return null;
  try {
    const decoded = jwtDecode<DecodedJWT>(token);
    const user = buildMinimalSessionFromJwt(decoded);
    return { user, accessToken: token };
  } catch {
    return null;
  }
}

function getCookieOptions(): { path: string; secure: boolean; sameSite: "lax"; maxAge: number } {
  const nodeEnv = typeof process !== "undefined" ? String(process.env.NODE_ENV ?? "") : "";
  return {
    path: "/",
    secure: nodeEnv === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  };
}

/** Build Set-Cookie header value to set the auth cookie (no cookies() call). */
export function buildSetCookieHeader(value: string): string {
  const opts = getCookieOptions();
  const secure = opts.secure ? "Secure; " : "";
  return `${AUTH_COOKIE_NAME}=${encodeURIComponent(value)}; Path=${opts.path}; HttpOnly; ${secure}SameSite=${opts.sameSite}; Max-Age=${opts.maxAge}`;
}

/** Build Set-Cookie header value to clear the auth cookie (no cookies() call). */
export function buildClearCookieHeader(): string {
  const opts = getCookieOptions();
  const secure = opts.secure ? "Secure; " : "";
  return `${AUTH_COOKIE_NAME}=; Path=${opts.path}; HttpOnly; ${secure}SameSite=${opts.sameSite}; Max-Age=0`;
}
