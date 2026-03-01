"use client";

import { useState, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { invalidateSessionCache } from "@/lib/session-fetcher";

/**
 * Usage (generations count) comes from session – no extra GET /api/user.
 * Refetch after generation/remix; optimistic +1 so navbar updates immediately.
 */
export function invalidateUserUsageCache(): void {
  invalidateSessionCache();
}

export function useUserUsage(): {
  generationsUsedThisMonth: number;
  monthlyLimit: number | null;
  isLoading: boolean;
  error: Error | null;
  refetch: (optimisticCount?: number) => Promise<void>;
} {
  const { data: session, status, update } = useSession();
  const [optimisticBump, setOptimisticBump] = useState(0);

  const baseUsed = session?.user?.generationsUsedThisMonth ?? 0;
  const generationsUsedThisMonth = baseUsed + optimisticBump;
  const monthlyLimit = session?.user?.monthlyLimit ?? null;
  const isLoading = status === "loading";
  const error = null;

  const refetch = useCallback(
    async (optimisticCount?: number) => {
      if (typeof optimisticCount === "number" && optimisticCount > 0) {
        setOptimisticBump(optimisticCount);
      }
      invalidateSessionCache();
      await update();
      setOptimisticBump(0);
    },
    [update]
  );

  return {
    generationsUsedThisMonth,
    monthlyLimit,
    isLoading,
    error,
    refetch,
  };
}
