"use server";
import { getServerSession } from "@/lib/auth-server";
import { createServerBackendAxios } from "@/lib/server-backend-client";

/** Timeout for long-running generation requests (remix, custom, filter) - 2 minutes */
const GENERATION_REQUEST_TIMEOUT_MS = 120_000;

export default async function GetServerAxiosWithAuth() {
  const session = await getServerSession();

  if (!session) {
    throw new Error("User is not authenticated");
  }

  const baseUrl = process.env.NEXT_PUBLIC_BE_URL;
  if (!baseUrl) throw new Error("NEXT_PUBLIC_BE_URL is not set");

  return createServerBackendAxios({
    baseURL: `${baseUrl}/api/`,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    timeout: GENERATION_REQUEST_TIMEOUT_MS,
  });
}
