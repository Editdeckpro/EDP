/**
 * Single place for all Next.js → backend HTTP requests.
 * Uses no keep-alive and Connection: close so connections never get stuck
 * after idle (e.g. 30 min). Ensures timeouts so requests fail fast instead of hanging.
 */
import axios, { AxiosInstance } from "axios";
import { backendHttpAgent, backendHttpsAgent } from "@/lib/backend-http-agents";

const DEFAULT_TIMEOUT_MS = 10_000;

const BASE_CONFIG = {
  timeout: DEFAULT_TIMEOUT_MS,
  httpAgent: backendHttpAgent,
  httpsAgent: backendHttpsAgent,
  headers: {
    Connection: "close" as const,
  },
};

/**
 * Create an axios instance for server-side calls to the backend.
 * Use this (or getSessionFromToken / GetServerAxiosWithAuth) for any Next.js → backend request.
 */
export function createServerBackendAxios(overrides: {
  baseURL: string;
  headers?: Record<string, string>;
  timeout?: number;
}): AxiosInstance {
  return axios.create({
    ...BASE_CONFIG,
    baseURL: overrides.baseURL,
    timeout: overrides.timeout ?? DEFAULT_TIMEOUT_MS,
    headers: {
      ...BASE_CONFIG.headers,
      ...overrides.headers,
    },
  });
}

/**
 * Call backend with a hard timeout via AbortSignal (Node 18+).
 * Use for one-off requests so they cannot hang beyond timeoutMs.
 */
export function createAbortSignal(timeoutMs: number): AbortSignal | undefined {
  if (typeof AbortSignal !== "undefined" && "timeout" in AbortSignal) {
    return (AbortSignal as { timeout(ms: number): AbortSignal }).timeout(timeoutMs);
  }
  return undefined;
}
