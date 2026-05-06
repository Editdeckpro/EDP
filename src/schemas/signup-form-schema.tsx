import { z } from "zod";

export const signupFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  company: z.string().min(1, "Company is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  planType: z.enum(["STARTER", "NEXT_LEVEL", "PRO_STUDIO"], {
    required_error: "Select a plan",
  }),
  planInterval: z.enum(["monthly", "yearly"], {
    required_error: "Select billing interval",
  }),
  promoCode: z.string().optional(),
});

export type SignupFormSchemaType = z.infer<typeof signupFormSchema>;
