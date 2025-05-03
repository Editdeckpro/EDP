"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth-guard";
import { redirect } from "next/navigation";
import { CustomFormSchemaType } from "@/schemas/custom-schema";
import axios from "axios";
import {
  CustomGeneratedImage,
  FilterGeneratedImage,
  RequestFilterGeneratedImage,
} from "@type/api/generate.type";
import { GenerateFilterFormSchemaType } from "@/schemas/filter-schema";

export async function customFormDataSubmit(
  data: CustomFormSchemaType
): Promise<CustomGeneratedImage | "error"> {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const accessToken = session.accessToken;

  const requestData = {
    userPrompt: data.customPrompt,
    noOfImages: data.numberOfImages,
  };

  try {
    const response = await axios.post<CustomGeneratedImage>(
      `${process.env.NEXT_PUBLIC_BE_URL}/api/generations/custom`,
      { ...requestData },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const accessToken = session.accessToken;

  const requestData: RequestFilterGeneratedImage = {
    artistName: data.artistName,
    colorPallete: data.colorPalette,
    genre: data.genre,
    mood: data.mood,
    noOfImages: data.numberOfImages,
    projectName: data.albumSongName,
    visualStyle: data.visualStyles,
  };

  try {
    const response = await axios.post<FilterGeneratedImage>(
      `${process.env.NEXT_PUBLIC_BE_URL}/api/generations/filter`,
      { ...requestData },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
