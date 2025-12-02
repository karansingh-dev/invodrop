import { ZodEnum, ZodObject } from "zod";

export const validateBody = <T>(schema: ZodObject, body: unknown) => {
  const validation = schema.safeParse(body);

  if (!validation.success) {
    console.error(validation.error)
    return {
      success: false,
      data: null,
      error: validation.error.message,
    } as const;
  }

  return {
    success: true,
    data: validation.data as T,
    error: null,
  } as const;
};
