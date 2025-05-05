import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/webp", "image/png"];

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 10MB.")
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpeg, .webp, .png formats are supported."
  );

export const remixFormSchema = z.object({
  customPrompt: z
    .string()
    .max(1000, "Prompt is too long")
    .min(1, { message: "Prompt is required" }),

  referenceImage: fileSchema,

  imageSimilarity: z
    .number()
    .min(0, "Similarity must be at least 0%")
    .max(100, "Similarity cannot exceed 100%"),
});

export type RemixFormSchemaType = z.infer<typeof remixFormSchema>;
