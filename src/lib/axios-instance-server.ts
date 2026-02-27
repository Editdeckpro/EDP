"use server";
import { getServerSession } from "@/lib/auth-server";
import axios from "axios";
import { backendHttpAgent, backendHttpsAgent } from "@/lib/backend-http-agents";

/** Timeout for long-running generation requests (remix, custom, filter) - 2 minutes */
const GENERATION_REQUEST_TIMEOUT_MS = 120_000;

export default async function GetServerAxiosWithAuth() {
  const session = await getServerSession();

  if (!session) {
    throw new Error("User is not authenticated");
  }

  const accessToken = session.accessToken;

  return axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BE_URL}/api/`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    timeout: GENERATION_REQUEST_TIMEOUT_MS,
    httpAgent: backendHttpAgent,
    httpsAgent: backendHttpsAgent,
  });
}
