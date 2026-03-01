import axios, { AxiosInstance, AxiosError } from "axios";
import { getSession, signOut } from "@/lib/auth-client";
import { clearOnboardingFromStorage } from "@/lib/onboarding-storage";

type SessionWithBypass = {
  user?: {
    bypassSubscription?: boolean;
  };
};

/** Timeout for client-side API calls - 30s */
const CLIENT_API_TIMEOUT_MS = 30_000;

function getBackendRoot(): string {
  const url = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_BE_URL : "";
  return (url || "").replace(/\/$/, "") + "/";
}

const getBackendBaseUrl = (): string => getBackendRoot() + "api/";

export const axiosInstance = axios.create({
  baseURL: getBackendRoot(),
  timeout: CLIENT_API_TIMEOUT_MS,
  withCredentials: true,
});

/** Wait until session is available (backend cookie auth). */
async function waitForSession(): Promise<string> {
  const maxTries = 3;
  const delayMs = 400;
  for (let tries = 0; tries < maxTries; tries++) {
    const session = await getSession();
    if (session) return ""; // Cookie is sent automatically; no token needed in header
    await new Promise((r) => setTimeout(r, delayMs));
  }
  throw new Error("User is not authenticated");
}

function setupSubscriptionExpirationInterceptor(instance: AxiosInstance) {
  if (typeof window === "undefined") return instance;

  let isRedirecting = false;
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ error?: string; message?: string }>) => {
      if (
        error.response?.status === 403 &&
        error.response?.data &&
        typeof error.response.data === "object" &&
        "error" in error.response.data &&
        error.response.data.error === "subscription_expired"
      ) {
        try {
          const session = await getSession();
          const s = session as unknown as SessionWithBypass | null;
          if (s?.user?.bypassSubscription) return Promise.reject(error);
        } catch {
          // ignore
        }
        if (isRedirecting) return Promise.reject(error);
        isRedirecting = true;
        const message =
          error.response.data.message ||
          "Your subscription has expired. Please renew your subscription to continue accessing the platform.";
        clearOnboardingFromStorage();
        signOut({
          callbackUrl: `/login?error=subscription_expired&message=${encodeURIComponent(message)}`,
        }).catch(() => {
          window.location.href = `/login?error=subscription_expired&message=${encodeURIComponent(message)}`;
        });
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );
  return instance;
}

const DEFAULT_AUTH_TIMEOUT_MS = 120_000;

/**
 * Get axios instance for backend API calls. Uses cookie (credentials) for auth; no token in header.
 * Options: timeoutMs. Token param is ignored when using cookie auth.
 */
export async function GetAxiosWithAuth(_token?: string, options?: { timeoutMs?: number }): Promise<AxiosInstance> {
  await waitForSession();
  const timeoutMs = options?.timeoutMs ?? DEFAULT_AUTH_TIMEOUT_MS;
  const instance = axios.create({
    baseURL: getBackendBaseUrl(),
    timeout: timeoutMs,
    withCredentials: true,
  });
  return setupSubscriptionExpirationInterceptor(instance);
}
