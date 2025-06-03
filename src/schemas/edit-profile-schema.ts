import { z } from "zod";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/webp", "image/png"];

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 1MB.")
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpeg, .webp, .png formats are supported."
  );

export const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  image: fileSchema.optional(),
});

export type ProfileFormType = z.infer<typeof profileSchema>;
