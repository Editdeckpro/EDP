"use server";
import GetServerAxiosWithAuth from "@/lib/axios-instance-server";
import { CustomFormSchemaType } from "@/schemas/custom-schema";
import { GenerateFilterFormSchemaType } from "@/schemas/filter-schema";
import {
  CustomGeneratedImage,
  FilterGeneratedImage,
  RequestFilterGeneratedImage,
} from "@type/api/generate.type";

export async function customFormDataSubmit(
  data: CustomFormSchemaType
): Promise<CustomGeneratedImage | "error"> {
  const requestData = {
    userPrompt: data.customPrompt,
    noOfImages: data.numberOfImages,
  };

  try {
    const axios = await GetServerAxiosWithAuth();
    const response = await axios.post<CustomGeneratedImage>(
      `generations/custom`,
      { ...requestData },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("API request failed:", error);
    throw new Error("Something went wrong!");
  }
}

export async function filterFormDataSubmit(
  data: GenerateFilterFormSchemaType
): Promise<FilterGeneratedImage | "error"> {
  const requestData: RequestFilterGeneratedImage = {
    artistName: data.artistName,
    colorPallete: data.colorPalette,
    genre: data.genre,
    mood: data.mood,
    noOfImages: data.numberOfImages,
    projectName: data.albumSongName,
    visualStyle: data.visualStyles,
    elements: data.elements,
  };

  try {
    const axios = await GetServerAxiosWithAuth();
    const response = await axios.post<FilterGeneratedImage>(
      `generations/filter`,
      { ...requestData },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("API request failed:", error);
    throw new Error("Something went wrong!");
  }
}
