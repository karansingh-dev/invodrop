import { Response } from "express";
import { type PrismaClient } from "@repo/db";
import { logger } from "@repo/logger";
import { ZodObject } from "zod";
import { ApiError } from "@/utils/ApiError";

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export abstract class BaseController {
  protected prisma: PrismaClient;

  constructor(prismaInstance: PrismaClient) {
    this.prisma = prismaInstance;
  }

  protected async sendSuccess<T = null>(
    res: Response,
    message: string,
    statusCode: number = 200,
    data?: T
  ): Promise<Response<ApiResponse<T>>> {
    return res.status(statusCode).json({
      success: true,
      message,
      ...(data !== null && { data }),
    });
  }

  protected async sendError(
    res: Response,
    message: string,
    statusCode: number = 400,

    errors: string[]
  ): Promise<Response<ApiResponse>> {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  protected validateBody<T>(schema: ZodObject, body: unknown): T {
    const result = schema.safeParse(body);

    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      logger.warn("Zod Validation Error:", errorMessages);

      throw new ApiError(400, "Validation failed", [
        "Invalid Data Sent",
        "Invlalid Structure of data",
      ]);
    }

    return result.data as T;
  }
}
