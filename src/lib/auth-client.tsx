"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Session } from "@/types/auth";

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

  const fetchSession = useCallback(async (): Promise<Session | null> => {
    try {
      const res = await fetch("/api/auth/session", { credentials: "include" });
      const json = await res.json();
      const session = json?.session ?? null;
      setData(session);
      setStatus(session ? "authenticated" : "unauthenticated");
      return session;
    } catch {
      setData(null);
      setStatus("unauthenticated");
      return null;
    }
  }, []);

  useEffect(() => {
    fetchSession();
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

/** Get current session (client). Resolves with null if unauthenticated. */
export async function getSession(): Promise<Session | null> {
  const res = await fetch("/api/auth/session", { credentials: "include" });
  const json = await res.json();
  return json?.session ?? null;
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
    const postRes = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken }),
      credentials: "include",
    });
    if (!postRes.ok) {
      const errBody = await postRes.json().catch(() => ({}));
      return { ok: false, error: (errBody?.error as string) || "Invalid credentials" };
    }
    const json = await postRes.json();
    return { ok: !!json?.session };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return { ok: false, error: message };
  }
}

/** Standalone sign-out (usable outside AuthProvider). Clears cookie and redirects. */
export async function signOut(options?: { callbackUrl?: string; redirect?: boolean }): Promise<void> {
  try {
    await fetch("/api/auth/signout", { method: "POST", credentials: "include" });
  } finally {
    const url = options?.callbackUrl ?? "/login";
    if (options?.redirect !== false && typeof window !== "undefined") {
      window.location.href = url;
    }
  }
}
