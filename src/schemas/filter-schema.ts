import { z } from "zod";

export const generateFilterFormSchema = z.object({
  albumSongName: z.string().min(1, "Album song name is required"),
  artistName: z.string().min(1, "Artist name is required"),
  genre: z.string().min(1, "Genre is required"),

  visualStyles: z.string().min(1, {
    message: "Select a visual style",
  }), // Assuming multiple can be selected
  mood: z.string().min(1, { message: "Select a mood style" }),
  colorPalette: z.string().min(1, { message: "Select a color palette" }),

  numberOfImages: z.number().min(1).max(4),
  includeTextInImage: z.boolean(),
});

export type GenerateFilterFormSchemaType = z.infer<
  typeof generateFilterFormSchema
>;
