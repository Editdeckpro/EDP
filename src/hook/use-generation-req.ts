"use server";
import axios from "axios";
import { ApiResponse, GenerationType } from "./use-generation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth-guard";
import { redirect } from "next/navigation";

export async function getGeneration({
  limit,
  page,
  type,
}: {
  page: number;
  limit: number;
  type: GenerationType;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const accessToken = session.accessToken;

  const res = await axios.get<ApiResponse>(
    `${process.env.NEXT_PUBLIC_BE_URL}/api/generations`,
    {
      params: {
        page,
        limit,
        ...(type ? { type } : {}),
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res;
}
