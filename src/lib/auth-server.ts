import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { cookies } from "next/headers";
import { Session, SessionUser } from "@/types/auth";
import { backendHttpAgent, backendHttpsAgent } from "@/lib/backend-http-agents";

export const AUTH_COOKIE_NAME = "edp_auth_token";
const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 30 * 24 * 60 * 60, // 30 days
};

export function getAuthCookieOptions() {
  return AUTH_COOKIE_OPTIONS;
}

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

/** Build full session from access token (call backend /user or fallback to JWT). */
export async function getSessionFromToken(accessToken: string): Promise<Session> {
  const baseUrl = process.env.NEXT_PUBLIC_BE_URL;
  const timeoutMs = 15_000;

  try {
    const { data } = await axios.get<SessionUser>(`${baseUrl}/api/user`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: timeoutMs,
      httpAgent: backendHttpAgent,
      httpsAgent: backendHttpsAgent,
    });
    return {
      user: {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        username: data.username,
        profileImage: data.profileImage,
        generationsUsedThisMonth: data.generationsUsedThisMonth ?? 0,
        monthlyLimit: data.monthlyLimit ?? null,
        bypassSubscription: data.bypassSubscription,
        subscription: {
          planType: data.subscription.planType,
          status: data.subscription.status,
          interval: data.subscription.interval,
          currentPeriodEnd: data.subscription.currentPeriodEnd,
          cancelAtPeriodEnd: data.subscription.cancelAtPeriodEnd,
          features: data.subscription.features,
        },
      },
      accessToken,
    };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 403) {
      const body = err.response?.data as { error?: string } | undefined;
      const decoded = jwtDecode<DecodedJWT>(accessToken);
      const subscriptionExpired = body?.error === "subscription_expired";
      return {
        user: buildMinimalSessionFromJwt(decoded, subscriptionExpired),
        accessToken,
      };
    }
    const decoded = jwtDecode<DecodedJWT>(accessToken);
    return {
      user: buildMinimalSessionFromJwt(decoded),
      accessToken,
    };
  }
}

/** Read session from auth cookie (for RSC and API routes). Returns null if no cookie or invalid. */
export async function getServerSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return await getSessionFromToken(token);
  } catch {
    return null;
  }
}

/** Set auth cookie (call from API route after login). */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
}

/** Clear auth cookie (call from API route on signout). */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}
