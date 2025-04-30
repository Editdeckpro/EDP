import { z } from "zod";

export const customFormSchema = z.object({
  customPrompt: z.string().min(1, {
    message: "Custom prompt is required.",
  }),
  numberOfImages: z.number().min(1).max(4),
  includeTextInImage: z.boolean(),
});

export type CustomFormSchemaType = z.infer<typeof customFormSchema>;
