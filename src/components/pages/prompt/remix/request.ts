"use server";
import { RemixFormSchemaType } from "@/schemas/remix-schema";
import { RemixImage } from "@type/api/generate.type";
import axios, { AxiosError } from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth-guard";
import { redirect } from "next/navigation";

export async function remixFormDataSubmit(
  data: RemixFormSchemaType
): Promise<RemixImage | "error"> {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const accessToken = session.accessToken;

  const formData = new FormData();
  formData.append("image", data.referenceImage); // Image should be a `File` object
  formData.append("imgSimilarityPercentage", data.imageSimilarity.toString());
  formData.append("userPrompt", data.customPrompt);

  try {
    const response = await axios.post<RemixImage>(
      `${process.env.NEXT_PUBLIC_BE_URL}/api/generations/remix`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    console.error("API request failed:", e.response?.data);
    throw new Error("Something went wrong!");
  }
}
