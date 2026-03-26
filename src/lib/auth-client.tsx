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

  const value = useMemo(
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

export async function getSession(): Promise<Session | null> {
  return fetchSessionFromApi();
}

/** Sign in via backend (cookie set by backend). No frontend API routes. */
export async function signIn(
  args: { username: string; password: string } | { token: string }
): Promise<{ ok: boolean; error?: string }> {
  const base = getBackendUrl().replace(/\/$/, "");
  if (!base) return { ok: false, error: "Backend URL not configured" };

  try {
    if ("token" in args) {
      const res = await fetch(`${base}/auth/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: args.token }),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { ok: false, error: (err?.error as string) || "Invalid token" };
      }
    } else {
      const res = await fetch(`${base}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: args.username, password: args.password }),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 400) return { ok: false, error: "User not found" };
        if (res.status === 403) return { ok: false, error: (err?.message as string) || "Invalid password" };
        return { ok: false, error: (err?.message as string) || "Login failed" };
      }
      const data = await res.json().catch(() => ({}));
      if (data?.accessToken && typeof window !== "undefined") {
        localStorage.setItem("auth_token", data.accessToken);
      }
    }
    invalidateSessionCache();
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return { ok: false, error: message };
  }
}

const SIGNOUT_TIMEOUT_MS = 8_000;

/** Sign out via backend (cookie cleared by backend). No frontend API routes. */
export async function signOut(options?: { callbackUrl?: string; redirect?: boolean }): Promise<void> {
  const base = getBackendUrl().replace(/\/$/, "");
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
  try {
    await fetch("/api/auth/signout", { method: "POST" });
  } catch {
    // best-effort
  }
  try {
    if (base) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), SIGNOUT_TIMEOUT_MS);
      await fetch(`${base}/auth/logout`, {
        method: "POST",
        credentials: "include",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    }
  } catch {
    // Timeout or network: still redirect
  } finally {
    const url = options?.callbackUrl ?? "/login";
    if (options?.redirect !== false && typeof window !== "undefined") {
      window.location.href = url;
    }
  }
}
