"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Session } from "@/types/auth";
import { fetchSessionFromApi, invalidateSessionCache } from "@/lib/session-fetcher";

function getBackendUrl(): string {
  return (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BE_URL) || "";
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  data: Session | null;
  status: AuthStatus;
  update: () => Promise<Session | null>;
  signIn: (args: { username: string; password: string } | { token: string }) => Promise<{ ok: boolean; error?: string }>;
  signOut: (options?: { callbackUrl?: string; redirect?: boolean }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const mounted = useRef(true);

  const fetchSession = useCallback(async (): Promise<Session | null> => {
    const session = await fetchSessionFromApi();
    if (mounted.current) {
      setData(session);
      setStatus(session ? "authenticated" : "unauthenticated");
    }
    return session;
  }, []);

  useEffect(() => {
    fetchSession();
    return () => {
      mounted.current = false;
    };
  }, [fetchSession]);

  const signInCb = useCallback(
    async (args: { username: string; password: string } | { token: string }) => {
      const result = await signIn(args);
      if (result.ok) await fetchSession();
      return result;
    },
    [fetchSession]
  );

  const signOutCb = useCallback(async (options?: { callbackUrl?: string; redirect?: boolean }) => {
    invalidateSessionCache();
    setData(null);
    setStatus("unauthenticated");
    await signOut(options);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      data,
      status,
      update: fetchSession,
      signIn: signInCb,
      signOut: signOutCb,
    }),
    [data, status, fetchSession, signInCb, signOutCb]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSession() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useSession must be used within AuthProvider");
  }
  return ctx;
}

/** Get current session (client). Uses shared cache + dedupe so we don't spam GET /api/auth/session. */
export async function getSession(): Promise<Session | null> {
  return fetchSessionFromApi();
}

/** Standalone sign-in (usable outside AuthProvider). Sets cookie via API; redirect or refetch session after. */
export async function signIn(
  args: { username: string; password: string } | { token: string }
): Promise<{ ok: boolean; error?: string }> {
  try {
    let accessToken: string;
    if ("token" in args) {
      accessToken = args.token;
    } else {
      const base = getBackendUrl().replace(/\/$/, "");
      const res = await fetch(`${base}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: args.username, password: args.password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 400) return { ok: false, error: "User not found" };
        if (res.status === 403) return { ok: false, error: "Invalid password" };
        return { ok: false, error: (err?.message as string) || "Login failed" };
      }
      const json = await res.json();
      accessToken = json?.accessToken;
      if (!accessToken) return { ok: false, error: "Invalid response" };
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000);
    const postRes = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken }),
      credentials: "include",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!postRes.ok) {
      const errBody = await postRes.json().catch(() => ({}));
      return { ok: false, error: (errBody?.error as string) || "Invalid credentials" };
    }
    invalidateSessionCache();
    const json = await postRes.json();
    return { ok: !!json?.session };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return { ok: false, error: message };
  }
}

const SIGNOUT_TIMEOUT_MS = 8_000;

/** Standalone sign-out (usable outside AuthProvider). Clears cookie and redirects. */
export async function signOut(options?: { callbackUrl?: string; redirect?: boolean }): Promise<void> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SIGNOUT_TIMEOUT_MS);
    await fetch("/api/auth/signout", {
      method: "POST",
      credentials: "include",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
  } catch {
    // Timeout or network error: still redirect so user is not stuck on "Logging out..."
  } finally {
    const url = options?.callbackUrl ?? "/login";
    if (options?.redirect !== false && typeof window !== "undefined") {
      window.location.href = url;
    }
  }
}
