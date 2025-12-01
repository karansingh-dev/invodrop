import z from "zod";


export const onboardingSchema = z.object({
  country: z.string(),
  currency: z.string(),
  address: z.string(),
  pincode: z.string(),
  logoUrl: z.string().optional(),
  website: z.string().optional(),
});