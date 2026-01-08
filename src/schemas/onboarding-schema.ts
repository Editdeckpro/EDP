import { z } from "zod";

export const onboardingSchema = z.object({
  userType: z.enum(["myself", "multiple-artists", "team"]),
  contentType: z.enum(["album-cover", "promo-social", "playlist-banner", "press-kit"]),
  releaseFrequency: z.enum(["occasionally", "monthly", "weekly", "getting-started"]),
  priority: z.enum(["speed", "consistency", "quality", "simplicity"]),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
