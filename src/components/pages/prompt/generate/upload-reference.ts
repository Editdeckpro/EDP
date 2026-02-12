"use client";
import { GetAxiosWithAuth } from "@/lib/axios-instance";

/** Upload reference image directly to backend from the browser to avoid 413 (body too large) when sending via Server Action. */
export async function uploadReferenceImageClient(file: File): Promise<string> {
  const axios = await GetAxiosWithAuth();
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await axios.post<{ imageUrl: string }>("generations/upload-reference", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.imageUrl;
}
