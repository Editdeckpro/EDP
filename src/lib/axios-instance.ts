import axios from "axios";
import { getSession } from "next-auth/react";

export async function GetAxiosWithAuth() {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new Error("No access token found in session");
  }

  return axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BE_URL}/api/`,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });
}
