/**
 * Single place for GET /api/auth/session with in-flight dedupe and short-lived cache
 * so we don't hammer the session endpoint (e.g. from AuthProvider + waitForSession loops).
 */
import type { Session } from "@/types/auth";

const SESSION_CACHE_MS = 15_000; // 15 seconds – avoid repeated GETs when many components need session
const SESSION_FETCH_TIMEOUT_MS = 12_000; // 12s – avoid hanging forever if Next.js or backend is stuck
let cached: { session: Session | null; at: number } | null = null;
let inFlight: Promise<Session | null> | null = null;

export function invalidateSessionCache(): void {
  cached = null;
  inFlight = null;
}

function isCacheValid(): boolean {
  if (!cached) return false;
  return Date.now() - cached.at < SESSION_CACHE_MS;
}

/**
 * Fetch session from API. Dedupes concurrent calls and returns cached result
 * when still fresh so we don't send repeated GET /api/auth/session.
 */
export async function fetchSessionFromApi(): Promise<Session | null> {
  if (isCacheValid()) return cached!.session;

  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), SESSION_FETCH_TIMEOUT_MS);
      const res = await fetch("/api/auth/session", {
        credentials: "include",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const json = await res.json();
      const session = (json?.session ?? null) as Session | null;
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
