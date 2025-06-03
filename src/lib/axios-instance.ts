import axios from "axios";
import { getSession } from "next-auth/react";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BE_URL}/`,
});

export async function GetAxiosWithAuth(token?: string) {
  const session = await getSession();
  const accessToken = session?.accessToken || token;

  if (!accessToken || accessToken === undefined) {
    throw new Error("User is not authenticated");
  }

  return axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BE_URL}/api/`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
