"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { GetAxiosWithAuth } from "@/lib/axios-instance";

const CACHE_MS = 60_000; // 1 minute – avoid spamming backend when navigating

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

  const fetchUsage = useCallback(async () => {
    if (status !== "authenticated" || !data?.accessToken) {
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
    try {
      const axios = await GetAxiosWithAuth(undefined, { timeoutMs: 15_000 });
      const { data: user } = await axios.get<{
        generationsUsedThisMonth: number;
        monthlyLimit: number | null;
      }>("user");
      const used = user?.generationsUsedThisMonth ?? 0;
      const limit = user?.monthlyLimit ?? null;
      cache = { generationsUsedThisMonth: used, monthlyLimit: limit, at: Date.now() };
      setGenerationsUsedThisMonth(used);
      setMonthlyLimit(limit);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to load usage"));
      setGenerationsUsedThisMonth(0);
      setMonthlyLimit(null);
    } finally {
      setIsLoading(false);
    }
  }, [status, data?.accessToken]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return {
    generationsUsedThisMonth,
    monthlyLimit,
    isLoading,
    error,
    refetch: fetchUsage,
  };
}
