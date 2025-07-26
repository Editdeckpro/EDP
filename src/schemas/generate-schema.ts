import { apiProviders } from "@/lib/utils";
import { z } from "zod";

export const generateFormSchema = z.object({
  albumSongName: z.string().min(1, "Album song name is required"),
  artistName: z.string().min(1, "Artist name is required"),
  genre: z.string().min(1, "Genre is required"),
  elements: z.string().min(1, "Element is required"),

  visualStyles: z.array(z.string().min(1)).min(4, { message: "Select at least 4 visual styles" }),
  mood: z.array(z.string().min(1)).min(1, { message: "Select at least 1 mood style" }),
  colorPalette: z.string().min(1, { message: "Select a color palette" }),
});

export const mainGenerateFormSchema = z.object({
  numberOfImages: z.number().min(1).max(4),
  apiProvider: z.enum(apiProviders),

  customPrompt: z.string().min(1, {
    message: "Custom prompt is required.",
  }),
});

export type GenerateFormSchemaType = z.infer<typeof generateFormSchema>;
export type MainGenerateFormSchemaType = z.infer<typeof mainGenerateFormSchema>;
