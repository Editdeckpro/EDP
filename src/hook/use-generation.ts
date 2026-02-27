"use client";
import { GetAxiosWithAuth } from "@/lib/axios-instance";
import { getGenerationsList } from "@/lib/api/generations";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export type GenerationType = "custom" | "filter" | "remix" | "custom,filter";

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

  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const searchParamsString = searchParams.toString();

  // Reset page and generations when search or sortBy changes
  useEffect(() => {
    setPage(1);
    setGenerations([]);
    setHasNextPage(true);
  }, [searchParamsString]);

  useEffect(() => {
    const fetchGenerations = async () => {
      if (loading || !hasNextPage) return;

      setLoading(true);
      setError(null);

      try {
        const axios = await GetAxiosWithAuth();
        const res = await getGenerationsList(axios, {
          page,
          limit,
          ...(generationType ? { generationType } : {}),
          ...(search ? { search } : {}),
          ...(sortBy ? { sort: sortBy as "asc" | "desc" } : {}),
        });

        const mapped = res.data.map((item) => ({
          id: String(item.id),
          imageGenerationId: String(item.imageGenerationId),
          imagePath: item.imagePath,
        }));
        setGenerations((prev) => (page === 1 ? mapped : [...prev, ...mapped]));
        setHasNextPage(res.pagination.hasNextPage);
        setError(null);
      } catch (e) {
        const err = e as AxiosError<{ message: string }>;
        setError(err.response?.data?.message || err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (error) {
      console.error("API Error:", error);
      return;
    }

    fetchGenerations();
  }, [
    page,
    generationType,
    limit,
    search,
    sortBy,
    error,
    loading,
    hasNextPage,
  ]);

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
