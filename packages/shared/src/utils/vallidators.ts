import { z } from "zod";

export const emailSchema = z.email();


export const isEmail = (email: string) => emailSchema.safeParse(email).success;
