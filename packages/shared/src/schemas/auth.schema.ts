import { email, z } from "zod";

export const signUpSchema = z.object({
  firstName: z
    .string()
    .trim()
    .nonempty({ message: "First name is required" })
    .max(50, { message: "First name must be at most 50 characters" }),

  lastName: z
    .string()
    .trim()
    .nonempty({ message: "Last name is required" })
    .max(50, { message: "Last name must be at most 50 characters" }),

  email: z.email({ message: "Please enter a valid email address" }).trim(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(18, { message: "Password must not exceed 18 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        "Password must include at least one uppercase letter, one lowercase letter, and one number",
    }),
});

export const verifyUserSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }).trim(),
  verificationCode: z.string().min(6).max(6),
});

export const loginSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }).trim(),

  password: z
    .string()
    .trim()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(18, { message: "Password must not exceed 18 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
});

export const refreshAccessTokenSchema = z.object({
  refreshToken: z.string(),
  email: z.email({ message: "Please enter a valid email address" }),
});

export type RefreshAccessTokenData = z.infer<typeof refreshAccessTokenSchema>;
export type LoginDataType = z.infer<typeof loginSchema>;
export type VerifyUserDataType = z.infer<typeof verifyUserSchema>;
export type SignUpDateType = z.infer<typeof signUpSchema>;
