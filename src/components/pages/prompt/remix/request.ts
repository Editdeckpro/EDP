"use server";
import GetServerAxiosWithAuth from "@/lib/axios-instance-server";
import { submitRemix, isGenerationSuccess, isInsufficientCredits, isGenerationError } from "@/lib/api/generations";
import type { RemixFormSchemaType } from "@/schemas/remix-schema";
import type { RemixImage } from "@type/api/generate.type";

export async function remixFormDataSubmit(
  data: RemixFormSchemaType
): Promise<RemixImage | "error"> {
  const axios = await GetServerAxiosWithAuth();
  const result = await submitRemix(axios, {
    userPrompt: data.customPrompt,
    imgSimilarityPercentage: data.imageSimilarity,
    noOfImages: 1,
    apiProvider: data.apiProvider || "nano_banana",
    imageUrl: data.imageUrl ?? undefined,
    imageFile: data.referenceImage,
  });

  if (isInsufficientCredits(result)) {
    throw new Error("Monthly limit reached. Upgrade your plan for more generations.");
  }
  if (isGenerationError(result)) {
    throw new Error(result.message);
  }
  if (isGenerationSuccess(result)) return result as RemixImage;
  throw new Error("Something went wrong. Please try again.");
}
