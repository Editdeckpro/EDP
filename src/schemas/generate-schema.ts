import { apiProviders } from "@/lib/utils";
import { z } from "zod";
import { fileSchema } from "./remix-schema";

export const generateFormSchema = z.object({
  albumSongName: z.string().min(1, "Album song name is required"),
  artistName: z.string().min(1, "Artist name is required"),
  genre: z.string().min(1, "Genre is required"),
  elements: z.string().min(1, "Element is required"),

  visualStyles: z.array(z.string().min(1)).min(1, { message: "Select at least 1 visual style" }),
  mood: z.array(z.string().min(1)).min(1, { message: "Select at least 1 mood style" }),
  colorPalette: z
    .array(z.string().min(1))
    .min(1, { message: "Select at least one primary color" })
    .max(2, { message: "You can select up to two colors primary and secondary" }),
});

export const mainGenerateFormSchema = z.object({
  numberOfImages: z.number().min(1).max(4),
  apiProvider: z.enum(apiProviders),
  referenceImage: fileSchema.optional(),
  imageUrl: z.string().url().optional(), // Set after client-side upload to avoid 413 via Server Action
  customPrompt: z.string().min(1, {
    message: "Custom prompt is required.",
  }),
});

export type GenerateFormSchemaType = z.infer<typeof generateFormSchema>;
export type MainGenerateFormSchemaType = z.infer<typeof mainGenerateFormSchema>;
