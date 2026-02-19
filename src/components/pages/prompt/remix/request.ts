"use server";
import GetServerAxiosWithAuth from "@/lib/axios-instance-server";
import { RemixFormSchemaType } from "@/schemas/remix-schema";
import { RemixImage } from "@type/api/generate.type";
import { AxiosError } from "axios";

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 2000;

function isRetryableError(error: unknown): boolean {
  const e = error as NodeJS.ErrnoException & { code?: string; cause?: { code?: string } };
  const code = e?.code ?? e?.cause?.code;
  return code === "ECONNRESET" || code === "ETIMEDOUT" || code === "ECONNABORTED";
}

export async function remixFormDataSubmit(
  data: RemixFormSchemaType
): Promise<RemixImage | "error"> {
  const formData = new FormData();
  formData.append("imageUrl", data.imageUrl || "");
  formData.append("imgSimilarityPercentage", data.imageSimilarity.toString());
  formData.append("userPrompt", data.customPrompt);
  formData.append("noOfImages", "1");
  formData.append("apiProvider", data.apiProvider || "nano_banana");

  if (data.referenceImage) {
    formData.append("image", data.referenceImage);
  }

  const axios = await GetServerAxiosWithAuth();
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.post<RemixImage>(
        `generations/remix`,
        formData
      );
      return response.data;
    } catch (error) {
      lastError = error;
      const e = error as AxiosError;
      console.error(`API request failed (attempt ${attempt}/${MAX_RETRIES}):`, e?.message || e);

      if (attempt < MAX_RETRIES && isRetryableError(error)) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }

      if (e.response?.status === 402) {
        throw new Error("Monthly limit reached. Upgrade your plan for more generations.");
      }
      if (isRetryableError(error)) {
        throw new Error(
          "The connection was reset while generating. This often happens when the service is busy. Please try again."
        );
      }
      const serverMessage = (e.response?.data as { error?: string })?.error;
      throw new Error(
        typeof serverMessage === "string" && serverMessage.length
          ? serverMessage
          : "Something went wrong. Please try again."
      );
    }
  }

  const last = lastError as AxiosError;
  const serverMessage = last?.response?.data && typeof last.response.data === "object" && "error" in last.response.data
    ? (last.response.data as { error: string }).error
    : null;
  throw new Error(
    typeof serverMessage === "string" && serverMessage.length
      ? serverMessage
      : lastError instanceof Error
        ? lastError.message
        : "Something went wrong. Please try again."
  );
}
