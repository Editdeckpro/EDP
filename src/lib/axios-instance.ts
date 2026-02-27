import axios, { AxiosInstance, AxiosError } from "axios";
import { getSession, signOut } from "@/lib/auth-client";
import { clearOnboardingFromStorage } from "@/lib/onboarding-storage";

type SessionWithBypass = {
  user?: {
    bypassSubscription?: boolean;
  };
};

/** Timeout for client-side API calls (login, check-user-status, etc.) - 30s */
const CLIENT_API_TIMEOUT_MS = 30_000;

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BE_URL}/`,
  timeout: CLIENT_API_TIMEOUT_MS,
});

/** Wait for session (uses cached/deduped getSession so we don't spam GET /api/auth/session). */
function waitForSession(): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const maxTries = 3;
    const delayMs = 400;

    for (let tries = 0; tries < maxTries; tries++) {
      const session = await getSession();
      if (session?.accessToken) return resolve(session.accessToken as string);
      if (session === null) return reject(new Error("User is not authenticated"));
      await new Promise((r) => setTimeout(r, delayMs));
    }
    reject(new Error("Session loading timed out or accessToken missing"));
  });
}

/**
 * Sets up response interceptor to handle subscription expiration
 * Automatically logs out users when subscription expires
 * Only works on client-side (browser environment)
 */
function setupSubscriptionExpirationInterceptor(axiosInstance: AxiosInstance) {
  // Use a flag to prevent multiple redirects
  let isRedirecting = false;

  // Only setup interceptor on client-side
  if (typeof window === "undefined") {
    return axiosInstance;
  }

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ error?: string; message?: string }>) => {
      // Check if it's a subscription expired error
      if (
        error.response?.status === 403 &&
        error.response?.data &&
        typeof error.response.data === "object" &&
        "error" in error.response.data &&
        error.response.data.error === "subscription_expired"
      ) {
        // If user is in bypass list, do not auto-logout/redirect
        try {
          const session = await getSession();
          const s = session as unknown as SessionWithBypass | null;
          if (s?.user?.bypassSubscription) {
            return Promise.reject(error);
          }
        } catch {
          // ignore and fall through to default behavior
        }

        // Prevent multiple redirects
        if (isRedirecting) {
          return Promise.reject(error);
        }
        isRedirecting = true;

        const errorMessage = error.response.data.message || 
          "Your subscription has expired. Please renew your subscription to continue accessing the platform.";

        // Clear onboarding from localStorage and log out the user
        clearOnboardingFromStorage();
        signOut({
          callbackUrl: `/login?error=subscription_expired&message=${encodeURIComponent(errorMessage)}`,
        }).catch((err) => {
          console.error("Error during sign out:", err);
          // Fallback: redirect manually if signOut fails
          window.location.href = `/login?error=subscription_expired&message=${encodeURIComponent(errorMessage)}`;
        });

        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
}

/** Default timeout for API calls (e.g. generation). Session callback should pass a shorter timeout. */
const DEFAULT_AUTH_TIMEOUT_MS = 120_000;

export async function GetAxiosWithAuth(token?: string, options?: { timeoutMs?: number }) {
  let accessToken = token;

  if (!accessToken) {
    accessToken = await waitForSession();
  }

  const timeoutMs = options?.timeoutMs ?? DEFAULT_AUTH_TIMEOUT_MS;
  const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BE_URL}/api/`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    timeout: timeoutMs,
  });

  // Setup subscription expiration interceptor
  return setupSubscriptionExpirationInterceptor(instance);
}
