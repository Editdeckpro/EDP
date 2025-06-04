"use server";
import GetServerAxiosWithAuth from "@/lib/axios-instance-server";
import { RemixFormSchemaType } from "@/schemas/remix-schema";
import { RemixImage } from "@type/api/generate.type";
import { AxiosError } from "axios";

export async function remixFormDataSubmit(
  data: RemixFormSchemaType
): Promise<RemixImage | "error"> {
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
    const axios = await GetServerAxiosWithAuth();
    const response = await axios.post<RemixImage>(
      `generations/remix`,
      formData
    );
    // console.log(response.data);

    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    console.error("API request failed:", e);
    throw new Error("Something went wrong!");
  }
}
