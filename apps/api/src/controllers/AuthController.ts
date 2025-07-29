import { AuthService } from "@/services/AuthService";
import { ApiResponse, BaseController } from "./BaseController";
import { PrismaClient } from "@repo/db";
import { SignUpDateType, signUpSchema } from "@repo/shared";
import { Request, Response } from "express";

export class AuthController extends BaseController {
  private authService: AuthService;

  constructor(prisma: PrismaClient) {
    super(prisma);
    this.authService = new AuthService(prisma);
  }

  /**
   * POST /api/auth/register
   * Handles user registration
   */
  async register(req: Request, res: Response): Promise<Response<ApiResponse>> {
    // Validate request body
    const userData = this.validateBody<SignUpDateType>(signUpSchema, req.body);

    const registerResult = await this.authService.registerUser(userData);

    return this.sendSuccess(
      res,
      "User registered successfully",
      201,
      registerResult
    );
  }
}
