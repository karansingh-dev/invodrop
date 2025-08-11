import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty({ message: "First name is required" })
    .max(50, { message: "First name must be at most 50 characters" }),

  email: z.email({ message: "Please enter a valid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(18, { message: "Password must not exceed 18 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        "Password must include at least one uppercase letter, one lowercase letter, and one number",
    }),
});

export const signInSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }).trim(),

  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(18, { message: "Password must not exceed 18 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
});

export type SignInDataType = z.infer<typeof signInSchema>;
export type SignUpDataType = z.infer<typeof signUpSchema>;
