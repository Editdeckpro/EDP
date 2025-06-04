"use server";
import { authOptions } from "@/auth-guard";
import axios from "axios";
import { getServerSession } from "next-auth";

export default async function GetServerAxiosWithAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("User is not authenticated");
  }

  const accessToken = session.accessToken;

  return axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BE_URL}/api/`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
