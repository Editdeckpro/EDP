"use client";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const { data: session, status } = useSession();
  const router = useRouter();

  // ✅ Triggered ONLY when `page` changes
  useEffect(() => {
    const fetchGenerations = async () => {
      if (status === "unauthenticated") {
        router.replace("/login");
        return null;
      }

      if (loading || !hasNextPage || status === "loading") return;

      setLoading(true);

      try {
        const res = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_BE_URL}/api/generations`,
          {
            params: {
              page,
              limit,
              ...(generationType ? { generationType } : {}),
            },
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        console.log(res);

        setGenerations((prev) => [...prev, ...res.data.data]);
        setHasNextPage(res.data.pagination.hasNextPage);
        setError(null); // clear previous errors
      } catch (e) {
        const err = e as AxiosError<{ message: string }>;
        setError(err.response?.data?.message || err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchGenerations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, generationType, limit, status]);

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
