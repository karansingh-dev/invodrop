import z from "zod";


export const createClientSchema = z.object({
  name: z.string(),
  email: z.email(),
  contactPerson: z.string(),

  isActive: z.boolean(),

  country: z.string(),
  address: z.string(),
  pincode: z.string(),
  
});