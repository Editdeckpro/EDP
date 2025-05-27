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
  formData.append("imageUrl", data.imageUrl || ""); // If imageUrl is not provided, it will be an empty string
  formData.append("imgSimilarityPercentage", data.imageSimilarity.toString());
  formData.append("userPrompt", data.customPrompt);
  // This is default to 1
  formData.append("noOfImages", "1");

  if (data.referenceImage) {
    formData.append("image", data.referenceImage); // Image should be a `File` object
  }

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
    // console.log(response.data);

    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    console.error("API request failed:", e);
    throw new Error("Something went wrong!");
  }
}
