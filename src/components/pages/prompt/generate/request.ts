"use server";
import GetServerAxiosWithAuth from "@/lib/axios-instance-server";
import { submitCustom, isGenerationSuccess, isInsufficientCredits, isGenerationError } from "@/lib/api/generations";
import type { MainGenerateFormSchemaType } from "@/schemas/generate-schema";
import type { GeneratedImageRes } from "@type/api/generate.type";

export type GenerateSubmitPayload = Pick<
  MainGenerateFormSchemaType,
  "numberOfImages" | "apiProvider" | "customPrompt"
> & { imageUrl?: string };

export type GenerateErrorPayload = { error: string };

export async function generateFormDataSubmit(
  data: GenerateSubmitPayload
): Promise<
  | GeneratedImageRes
  | "error"
  | "insufficient_credits"
  | GenerateErrorPayload
> {
  const axios = await GetServerAxiosWithAuth();
  const result = await submitCustom(axios, {
    userPrompt: data.customPrompt,
    noOfImages: data.numberOfImages,
    apiProvider: data.apiProvider || "nano_banana",
    imageUrl: data.imageUrl,
  });

  if (isInsufficientCredits(result)) return "insufficient_credits";
  if (isGenerationError(result)) return { error: result.message };
  if (isGenerationSuccess(result)) return result as GeneratedImageRes;
  return { error: "Something went wrong. Please try again." };
}
