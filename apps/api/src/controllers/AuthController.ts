import { AuthService } from "@/services/AuthService";
import { ApiResponse, BaseController } from "./BaseController";
import { type PrismaClient } from "@repo/db";
import {
  SignUpDateType,
  signUpSchema,
  VerifyUserDataType,
  verifyUserSchema,
} from "@repo/shared";
import { Request, Response } from "express";
import { VerificationService } from "@/services/VerificationService";
import { logger } from "@repo/logger";

export class AuthController extends BaseController {
  private authService: AuthService;
  private verifyService: VerificationService;

  constructor(prisma: PrismaClient) {
    super(prisma);
    this.verifyService = new VerificationService(prisma);
    this.authService = new AuthService(prisma);
  }

  /**
   * POST /api/auth/register
   * Handles user registration
   */
  async register(req: Request, res: Response): Promise<Response<ApiResponse>> {
    try {
      // Validate request body
      const userData = this.validateBody<SignUpDateType>(
        signUpSchema,
        req.body
      );

      const registerResult = await this.authService.registerUser(userData);

      return this.sendSuccess(
        res,
        "User registered successfully",
        201,
        registerResult
      );
    } catch (error: any) {
      logger.error("Failed to register user", {
        router: "/api/v1/user/register",
        error,
      });
      return this.sendError(res, "Failed to register user", 400, error.message);
    }
  }

  async verifyEmail(
    req: Request,
    res: Response
  ): Promise<Response<ApiResponse>> {
    try {
      const verificationData = this.validateBody<VerifyUserDataType>(
        verifyUserSchema,
        req.body
      );

      const verifiedUser = await this.verifyService.verifyUser(
        verificationData.email,
        verificationData.verificationCode
      );
      return this.sendSuccess(
        res,
        "User email verified successfully",
        200,
        verifiedUser
      );
    } catch (error: any) {
      logger.error("Failed to verify user email", { error });

      return this.sendError(res, "Failed to verify email", 400, error.message);
    }
  }
}
