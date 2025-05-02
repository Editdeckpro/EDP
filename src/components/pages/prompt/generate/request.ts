"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth-guard";
import { redirect } from "next/navigation";
import { CustomFormSchemaType } from "@/schemas/custom-schema";
import axios from "axios";
import { CustomGeneratedImage } from "@type/api/custom-generated.type";

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
