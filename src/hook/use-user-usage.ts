"use client";

import { useState, useEffect, useCallback } from "react";
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
  const { status } = useSession();
  const [generationsUsedThisMonth, setGenerationsUsedThisMonth] = useState(0);
  const [monthlyLimit, setMonthlyLimit] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsage = useCallback(async () => {
    if (status !== "authenticated") {
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
        // Auth via backend cookie; GetAxiosWithAuth uses credentials
        const axios = await GetAxiosWithAuth(undefined, { timeoutMs: 15_000 });
        const res = await axios.get("user");
        // Backend returns flat { generationsUsedThisMonth, monthlyLimit }; accept number or string
        const raw = res?.data ?? res;
        const usedRaw = raw?.generationsUsedThisMonth ?? (raw?.data as { generationsUsedThisMonth?: number })?.generationsUsedThisMonth;
        const limitRaw = raw?.monthlyLimit ?? (raw?.data as { monthlyLimit?: number | null })?.monthlyLimit;
        const used = Math.max(0, Number(usedRaw) || 0);
        const limit =
          limitRaw === null || limitRaw === undefined || limitRaw === ""
            ? null
            : Math.max(0, Number(limitRaw) || 0);
        cache = { generationsUsedThisMonth: used, monthlyLimit: limit, at: Date.now() };
        setGenerationsUsedThisMonth(used);
        setMonthlyLimit(limit);
        return;
      } catch (e) {
        lastErr = e instanceof Error ? e : new Error("Failed to load usage");
        if (attempt < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        }
      }
    }
    setError(lastErr);
    if (!cache) {
      setGenerationsUsedThisMonth(0);
      setMonthlyLimit(null);
    }
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  // Refetch when we get a token for the first time (e.g. after login) so we don't show 0 forever
  useEffect(() => {
    if (status === "authenticated") {
      cache = null;
      fetchUsage();
    }
  }, [status, fetchUsage]);

  // refetch bypasses cache so after a generation we get the new count immediately
  const refetch = useCallback(() => {
    cache = null;
    return fetchUsage();
  }, [fetchUsage]);

  return {
    generationsUsedThisMonth,
    monthlyLimit,
    isLoading,
    error,
    refetch,
  };
}
