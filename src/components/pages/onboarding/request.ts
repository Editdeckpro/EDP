"use client";
import { GetAxiosWithAuth } from "@/lib/axios-instance";
import { OnboardingData } from "@/schemas/onboarding-schema";
import { AxiosError } from "axios";

export interface OnboardingResponse {
  message: string;
  data: {
    id: number;
    userId: number;
    userType: string;
    contentType: string;
    releaseFrequency: string;
    priority: string;
    createdAt: string;
    updatedAt: string;
  };
}

export async function saveOnboardingData(data: OnboardingData, accessToken: string): Promise<OnboardingResponse> {
  try {
    const axios = await GetAxiosWithAuth(accessToken);
    const response = await axios.post<OnboardingResponse>("onboarding", data);
    return response.data;
  } catch (error) {
    const e = error as AxiosError<{ message?: string; error?: string }>;
    console.error("Failed to save onboarding data:", e);
    throw new Error(e.response?.data?.message || e.response?.data?.error || "Failed to save onboarding data");
  }
}

export interface OnboardingStatusResponse {
  isComplete: boolean;
  hasData: boolean;
  missingFields: string[];
  completedAt?: string;
  lastUpdated?: string;
}

export async function getOnboardingStatus(accessToken: string): Promise<OnboardingStatusResponse> {
  try {
    const axios = await GetAxiosWithAuth(accessToken);
    const response = await axios.get<OnboardingStatusResponse>("onboarding/status");
    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    console.error("Failed to get onboarding status:", e);
    // Return incomplete status if error occurs
    return {
      isComplete: false,
      hasData: false,
      missingFields: ["userType", "contentType", "releaseFrequency", "priority"],
    };
  }
}

export async function getOnboardingData(accessToken: string): Promise<OnboardingResponse["data"] | null> {
  try {
    const axios = await GetAxiosWithAuth(accessToken);
    const response = await axios.get<{ data: OnboardingResponse["data"] }>("onboarding");
    return response.data.data;
  } catch (error) {
    const e = error as AxiosError;
    // If 404, user hasn't completed onboarding yet
    if (e.response?.status === 404) {
      return null;
    }
    console.error("Failed to get onboarding data:", e);
    throw new Error("Failed to get onboarding data");
  }
}
