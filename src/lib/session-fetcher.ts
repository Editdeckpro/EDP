/**
 * Fetch session from backend GET /api/user with credentials (cookie).
 * No frontend API routes; all auth is handled on the backend.
 */
import type { Session, SessionUser } from "@/types/auth";

const SESSION_CACHE_MS = 15_000;
const SESSION_FETCH_TIMEOUT_MS = 12_000;
let cached: { session: Session | null; at: number } | null = null;
let inFlight: Promise<Session | null> | null = null;

function getBackendUrl(): string {
  return (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BE_URL) || "";
}

export function invalidateSessionCache(): void {
  cached = null;
  inFlight = null;
}

function isCacheValid(): boolean {
  if (!cached) return false;
  return Date.now() - cached.at < SESSION_CACHE_MS;
}

function userResponseToSessionUser(data: Record<string, unknown>): SessionUser {
  const sub = (data.subscription as Record<string, unknown>) || {};
  return {
    id: Number(data.id) || 0,
    firstName: (data.firstName as string) || "",
    lastName: (data.lastName as string) || "",
    email: (data.email as string) || "",
    username: (data.username as string) || "",
    profileImage: data.profileImage as string | undefined,
    generationsUsedThisMonth: Number(data.generationsUsedThisMonth) || 0,
    monthlyLimit: data.monthlyLimit != null ? Number(data.monthlyLimit) : null,
    bypassSubscription: Boolean(data.bypassSubscription),
    subscription: {
      planType: (sub.planType as SessionUser["subscription"]["planType"]) || "FREE",
      status: (sub.status as string) || "active",
      interval: (sub.interval as "monthly" | "yearly") || "yearly",
      currentPeriodEnd: (sub.currentPeriodEnd as string) || "",
      cancelAtPeriodEnd: Boolean(sub.cancelAtPeriodEnd),
      features: Array.isArray(sub.features) ? sub.features as string[] : [],
    },
  };
}

/**
 * Fetch session from backend (cookie-based). Dedupes and caches.
 */
export async function fetchSessionFromApi(): Promise<Session | null> {
  if (isCacheValid()) return cached!.session;
  if (inFlight) return inFlight;

  const base = getBackendUrl().replace(/\/$/, "");
  if (!base) {
    cached = { session: null, at: Date.now() };
    return null;
  }

  inFlight = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), SESSION_FETCH_TIMEOUT_MS);
      const res = await fetch(`${base}/api/user`, {
        credentials: "include",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        cached = { session: null, at: Date.now() };
        return null;
      }
      const data = (await res.json()) as Record<string, unknown>;
      const user = userResponseToSessionUser(data);
      const session: Session = { user, accessToken: "" };
      cached = { session, at: Date.now() };
      return session;
    } catch {
      cached = { session: null, at: Date.now() };
      return null;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}
