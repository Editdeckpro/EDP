"use client";
import { GetAxiosWithAuth } from "@/lib/axios-instance";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

export type GenerationType = "custom" | "filter" | "remix";

interface Generation {
  id: string;
  imageGenerationId: string;
  imagePath: string;
}

interface Pagination {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

export interface ApiResponse {
  data: Generation[];
  pagination: Pagination;
}

interface UseGenerationsOptions {
  generationType?: GenerationType;
  limit?: number;
}

export function useGenerations({
  generationType,
  limit = 10,
}: UseGenerationsOptions = {}) {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Triggered ONLY when `page` changes
  useEffect(() => {
    const fetchGenerations = async () => {
      // Prevent API call if loading, or there's no next page to fetch
      if (loading || !hasNextPage) return;

      setLoading(true);
      setError(null); // Reset any previous errors

      try {
        const axios = await GetAxiosWithAuth();
        const res = await axios.get<ApiResponse>(`generations`, {
          params: {
            page,
            limit,
            ...(generationType ? { generationType } : {}),
          },
        });

        setGenerations((prev) => [...prev, ...res.data.data]);
        setHasNextPage(res.data.pagination.hasNextPage);
        setError(null); // Clear previous errors
      } catch (e) {
        const err = e as AxiosError<{ message: string }>;
        setError(err.response?.data?.message || err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    // Avoid calling the API again if there's an error
    if (error) {
      console.error("API Error:", error);
      return;
    }

    fetchGenerations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, generationType, limit, error]);

  const loadNextPage = () => {
    if (!loading && hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  return {
    generations,
    loading,
    error,
    loadNextPage,
    hasNextPage,
  };
}
