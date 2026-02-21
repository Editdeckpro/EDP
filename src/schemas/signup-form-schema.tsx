import { z } from "zod";

export const signupFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  planType: z.enum(["STARTER", "NEXT_LEVEL", "PRO_STUDIO"], {
    required_error: "Select a plan",
  }),
  planInterval: z.enum(["monthly", "yearly"], {
    required_error: "Select billing interval",
  }),
  promoCode: z.string().optional(),
});

export type SignupFormSchemaType = z.infer<typeof signupFormSchema>;
