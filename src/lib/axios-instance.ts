import axios from "axios";
import { getSession } from "next-auth/react";

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

export async function GetAxiosWithAuth(token?: string) {
  let accessToken = token;

  if (!accessToken) {
    accessToken = await waitForSession();
  }

  return axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BE_URL}/api/`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
