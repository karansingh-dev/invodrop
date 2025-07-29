import { Response } from "express";
import { prisma, type PrismaClient } from "@repo/db";
import { logger } from "@repo/logger";
import { ZodObject } from "zod";

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export abstract class BaseController {
  protected prisma: PrismaClient;

  constructor(prismaInstance: PrismaClient = prisma) {
    this.prisma = prismaInstance;
  }

  protected async sendSuccess<T = null>(
    res: Response,
    message: string,
    statusCode: number = 200,
    data?: T
  ): Promise<Response<ApiResponse>> {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  protected async sendError(
    res: Response,
    message: string,
    statusCode: number = 400,

    error: string
  ): Promise<Response<ApiResponse>> {
    return res.status(statusCode).json({
      success: false,
      message,
      error,
    });
  }

  protected validateBody<T>(schema: ZodObject, body: unknown): T {
    const result = schema.safeParse(body);

    if (!result.success) {
      const errorMessages = result.error.message;
      logger.warn("Zod Validation Error:", errorMessages);

      throw new Error("Validation failed");
    }

    return result.data as T;
  }
}
