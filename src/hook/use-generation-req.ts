"use server";
import GetServerAxiosWithAuth from "@/lib/axios-instance-server";
import { getGenerationsList } from "@/lib/api/generations";
import type { ApiResponse, GenerationType } from "./use-generation";

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
  const result = await getGenerationsList(axios, {
    page,
    limit,
    ...(type ? { generationType: type } : {}),
  });
  const data: ApiResponse = {
    data: result.data.map((item) => ({
      id: String(item.id),
      imageGenerationId: String(item.imageGenerationId),
      imagePath: item.imagePath,
    })),
    pagination: result.pagination,
  };
  return { data };
}
