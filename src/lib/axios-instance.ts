import axios, { AxiosInstance, AxiosError } from "axios";
import { getSession, signOut } from "next-auth/react";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BE_URL}/`,
});

function waitForSession(): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let tries = 0;
    const maxTries = 5;
    const delay = 200; // ms

    while (tries < maxTries) {
      const session = await getSession();

      if (session === null) {
        return reject(new Error("User is not authenticated"));
      }

      if (session?.accessToken) {
        return resolve(session.accessToken as string);
      }

      // Still loading? Wait and retry
      await new Promise((res) => setTimeout(res, delay));
      tries++;
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
        // Prevent multiple redirects
        if (isRedirecting) {
          return Promise.reject(error);
        }
        isRedirecting = true;

        const errorMessage = error.response.data.message || 
          "Your subscription has expired. Please renew your subscription to continue accessing the platform.";

        // Log out the user and redirect to login with error
        signOut({
          callbackUrl: `/login?error=subscription_expired&message=${encodeURIComponent(errorMessage)}`,
          redirect: true,
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

export async function GetAxiosWithAuth(token?: string) {
  let accessToken = token;

  if (!accessToken) {
    accessToken = await waitForSession();
  }

  const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BE_URL}/api/`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Setup subscription expiration interceptor
  return setupSubscriptionExpirationInterceptor(instance);
}
