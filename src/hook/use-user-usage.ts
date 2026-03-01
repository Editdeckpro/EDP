"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { GetAxiosWithAuth } from "@/lib/axios-instance";

const CACHE_MS = 60_000; // 1 minute – avoid spamming backend when navigating
const RETRY_DELAY_MS = 2_000;
const MAX_RETRIES = 2;

type Cached = {
  generationsUsedThisMonth: number;
  monthlyLimit: number | null;
  at: number;
};

let cache: Cached | null = null;

export function invalidateUserUsageCache(): void {
  cache = null;
}

export function useUserUsage(): {
  generationsUsedThisMonth: number;
  monthlyLimit: number | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const { status, data } = useSession();
  const [generationsUsedThisMonth, setGenerationsUsedThisMonth] = useState(0);
  const [monthlyLimit, setMonthlyLimit] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const lastTokenRef = useRef<string | null>(null);

  const fetchUsage = useCallback(async () => {
    const accessToken = data?.accessToken;
    if (status !== "authenticated" || !accessToken) {
      setGenerationsUsedThisMonth(0);
      setMonthlyLimit(null);
      setIsLoading(false);
      return;
    }
    const now = Date.now();
    if (cache && now - cache.at < CACHE_MS) {
      setGenerationsUsedThisMonth(cache.generationsUsedThisMonth);
      setMonthlyLimit(cache.monthlyLimit);
      setIsLoading(false);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    let lastErr: Error | null = null;
    try {
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        // Use token from session so we don't depend on waitForSession() / GET /api/auth/session
        const axios = await GetAxiosWithAuth(accessToken, { timeoutMs: 15_000 });
        const { data: user } = await axios.get<{
          generationsUsedThisMonth?: number;
          monthlyLimit?: number | null;
        }>("user");
        const used = typeof user?.generationsUsedThisMonth === "number" ? user.generationsUsedThisMonth : 0;
        const limit = user?.monthlyLimit !== undefined && user?.monthlyLimit !== null ? user.monthlyLimit : null;
        cache = { generationsUsedThisMonth: used, monthlyLimit: limit, at: Date.now() };
        setGenerationsUsedThisMonth(used);
        setMonthlyLimit(limit);
        lastTokenRef.current = accessToken;
        return;
      } catch (e) {
        lastErr = e instanceof Error ? e : new Error("Failed to load usage");
        if (attempt < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        }
      }
    }
    }
    setError(lastErr);
    setGenerationsUsedThisMonth(0);
    setMonthlyLimit(null);
    } finally {
      setIsLoading(false);
    }
  }, [status, data?.accessToken]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  // Refetch when we get a token for the first time (e.g. after login) so we don't show 0 forever
  useEffect(() => {
    if (status === "authenticated" && data?.accessToken && lastTokenRef.current !== data.accessToken) {
      cache = null;
      lastTokenRef.current = data.accessToken;
      fetchUsage();
    }
  }, [status, data?.accessToken, fetchUsage]);

  return {
    generationsUsedThisMonth,
    monthlyLimit,
    isLoading,
    error,
    refetch: fetchUsage,
  };
}
