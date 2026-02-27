/**
 * Central generation API: typed request/response and error handling.
 * Use with GetServerAxiosWithAuth() in Server Actions or GetAxiosWithAuth() on client.
 */
import type { AxiosInstance } from "axios";
import type { GeneratedImageRes, RemixImage } from "@type/api/generate.type";

/** Successful custom/remix response (same shape from backend). */
export type GenerationSuccess = GeneratedImageRes;

/** API error: insufficient credits (402) or server/validation error. */
export type GenerationApiError =
  | { kind: "insufficient_credits" }
  | { kind: "error"; message: string };

export type CustomSubmitResult = GeneratedImageRes | GenerationApiError;
export type RemixSubmitResult = RemixImage | GenerationApiError;

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 2000;

function isRetryable(err: unknown): boolean {
  const e = err as { code?: string; cause?: { code?: string } };
  const code = e?.code ?? e?.cause?.code;
  return code === "ECONNRESET" || code === "ETIMEDOUT" || code === "ECONNABORTED";
}

function getServerMessage(err: unknown): string {
  const data = (err as { response?: { data?: { error?: string } } })?.response?.data;
  const msg = data?.error;
  return typeof msg === "string" && msg.length > 0 ? msg : "Something went wrong. Please try again.";
}

/** Submit custom generation. Returns success payload or error object. */
export async function submitCustom(
  axiosInstance: AxiosInstance,
  payload: {
    userPrompt: string;
    noOfImages: number;
    apiProvider: string;
    imageUrl?: string;
  }
): Promise<CustomSubmitResult> {
  const formData = new FormData();
  if (payload.imageUrl) formData.append("imageUrl", payload.imageUrl);
  formData.append("noOfImages", String(payload.noOfImages));
  formData.append("apiProvider", payload.apiProvider || "nano_banana");
  formData.append("userPrompt", payload.userPrompt);

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { data } = await axiosInstance.post<GeneratedImageRes>("generations/custom", formData);
      return data;
    } catch (err) {
      lastError = err;
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 402) return { kind: "insufficient_credits" };
      if (attempt < MAX_RETRIES && isRetryable(err)) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }
      return { kind: "error", message: getServerMessage(err) };
    }
  }
  return { kind: "error", message: getServerMessage(lastError) };
}

/** Submit remix generation. Returns success payload or error object. */
export async function submitRemix(
  axiosInstance: AxiosInstance,
  payload: {
    userPrompt: string;
    imgSimilarityPercentage: number;
    noOfImages?: number;
    apiProvider?: string;
    imageUrl?: string;
    imageFile?: File;
  }
): Promise<RemixSubmitResult> {
  const formData = new FormData();
  formData.append("userPrompt", payload.userPrompt);
  formData.append("imgSimilarityPercentage", String(payload.imgSimilarityPercentage));
  formData.append("noOfImages", String(payload.noOfImages ?? 1));
  formData.append("apiProvider", payload.apiProvider || "nano_banana");
  if (payload.imageUrl) formData.append("imageUrl", payload.imageUrl);
  if (payload.imageFile) formData.append("image", payload.imageFile);

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { data } = await axiosInstance.post<RemixImage>("generations/remix", formData);
      return data;
    } catch (err) {
      lastError = err;
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 402) return { kind: "insufficient_credits" };
      if (attempt < MAX_RETRIES && isRetryable(err)) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }
      return { kind: "error", message: getServerMessage(err) };
    }
  }
  return { kind: "error", message: getServerMessage(lastError) };
}

/** List generations (paginated). */
export async function getGenerationsList(
  axiosInstance: AxiosInstance,
  params: {
    page?: number;
    limit?: number;
    generationType?: string;
    search?: string;
    sort?: "asc" | "desc";
  }
) {
  const { data } = await axiosInstance.get<{
    data: Array<{ id: number; imageGenerationId: number; imagePath: string }>;
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    sort: { id: string };
  }>("generations", { params });
  return data;
}

/** Get single generation by ID. */
export async function getGenerationById(axiosInstance: AxiosInstance, id: number) {
  const { data } = await axiosInstance.get(`generations/${id}`);
  return data;
}

/** Type guard: result is success (has imageGenerationId and images). */
export function isGenerationSuccess(
  result: CustomSubmitResult | RemixSubmitResult
): result is GeneratedImageRes | RemixImage {
  return (
    typeof result === "object" &&
    result !== null &&
    "imageGenerationId" in result &&
    "images" in result &&
    !("kind" in result)
  );
}

export function isInsufficientCredits(result: CustomSubmitResult | RemixSubmitResult): boolean {
  return typeof result === "object" && result !== null && "kind" in result && result.kind === "insufficient_credits";
}

export function isGenerationError(result: CustomSubmitResult | RemixSubmitResult): result is { kind: "error"; message: string } {
  return typeof result === "object" && result !== null && "kind" in result && result.kind === "error";
}
