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

export async function generateFormDataSubmit(data: MainGenerateFormSchemaType): Promise<GeneratedImageRes | "error"> {
  const formData = new FormData();

  if (data.referenceImage) {
    formData.append("image", data.referenceImage); // Image should be a `File` object
  }
  formData.append("noOfImages", `${data.numberOfImages}`);
  formData.append("apiProvider", data.apiProvider || "openai");
  formData.append("userPrompt", data.customPrompt);

  try {
    const axios = await GetServerAxiosWithAuth();
    const response = await axios.post<GeneratedImageRes>(`generations/custom`, formData);

    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    console.error("API request failed:", e);
    throw new Error("Something went wrong!");
  }
}
