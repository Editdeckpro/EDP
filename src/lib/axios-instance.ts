"use server";
import { authOptions } from "@/auth-guard";
import axios from "axios";
import { getServerSession } from "next-auth";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BE_URL}/`,
});

export async function GetAxiosWithAuth(token?: string) {
  let accessToken = token;

  if (!accessToken) {
    const session = await getServerSession(authOptions);
    accessToken = session?.accessToken as string | undefined;
  }

  if (!accessToken) {
    throw new Error("User is not authenticated");
  }

  return axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BE_URL}/api/`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
