"use server";
import GetServerAxiosWithAuth from "@/lib/axios-instance-server";
import { MainGenerateFormSchemaType } from "@/schemas/generate-schema";
import { GeneratedImageRes } from "@type/api/generate.type";
import { AxiosError } from "axios";

// export async function customFormDataSubmit(
//   data: CustomFormSchemaType
// ): Promise<CustomGeneratedImage | "error"> {
//   const requestData = {
//     userPrompt: data.customPrompt,
//     noOfImages: data.numberOfImages,
//   };

//   try {
//     const axios = await GetServerAxiosWithAuth();
//     const response = await axios.post<CustomGeneratedImage>(
//       `generations/custom`,
//       { ...requestData },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("API request failed:", error);
//     throw new Error("Something went wrong!");
//   }
// }

/** Payload for generate – only serializable fields (no File); reference image is uploaded client-side first. Image output is always 1:1 (server-enforced). */
export type GenerateSubmitPayload = Pick<MainGenerateFormSchemaType, "numberOfImages" | "apiProvider" | "customPrompt"> & {
  imageUrl?: string;
};

/** Server returned an error message (e.g. Gemini quota, rate limit). */
export type GenerateErrorPayload = { error: string };

export async function generateFormDataSubmit(
  data: GenerateSubmitPayload
): Promise<GeneratedImageRes | "error" | "insufficient_credits" | GenerateErrorPayload> {
  const formData = new FormData();

  if (data.imageUrl) {
    formData.append("imageUrl", data.imageUrl);
  }
  formData.append("noOfImages", `${data.numberOfImages}`);
  formData.append("apiProvider", data.apiProvider || "nano_banana");
  formData.append("userPrompt", data.customPrompt);

  const axios = await GetServerAxiosWithAuth();
  const MAX_RETRIES = 2;
  const RETRY_DELAY_MS = 2000;

  function isRetryable(err: unknown): boolean {
    const e = err as NodeJS.ErrnoException & { code?: string; cause?: { code?: string } };
    const code = e?.code ?? e?.cause?.code;
    return code === "ECONNRESET" || code === "ETIMEDOUT" || code === "ECONNABORTED";
  }

  function getServerMessage(e: AxiosError): string {
    const msg = (e.response?.data as { error?: string })?.error;
    return typeof msg === "string" && msg.length ? msg : "Something went wrong. Please try again.";
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.post<GeneratedImageRes>(`generations/custom`, formData);
      return response.data;
    } catch (error) {
      const e = error as AxiosError;
      console.error(`API request failed (attempt ${attempt}/${MAX_RETRIES}):`, e?.message || e);
      if (e.response?.status === 402) return "insufficient_credits";
      if (attempt < MAX_RETRIES && isRetryable(error)) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }
      return { error: getServerMessage(e) };
    }
  }

  return { error: "Something went wrong. Please try again." };
}
