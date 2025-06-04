"use server";
import GetServerAxiosWithAuth from "@/lib/axios-instance-server";
import { ApiResponse, GenerationType } from "./use-generation";

export async function getGeneration({
  limit,
  page,
  type,
}: {
  page: number;
  limit: number;
  type: GenerationType;
}) {
  const axios = await GetServerAxiosWithAuth();
  const res = await axios.get<ApiResponse>(`generations`, {
    params: {
      page,
      limit,
      ...(type ? { type } : {}),
    },
  });

  return res;
}
