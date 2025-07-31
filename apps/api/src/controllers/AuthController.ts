import { AuthService } from "@/services/AuthService";
import { BaseController } from "./BaseController";
import { type PrismaClient } from "@repo/db";
import {
  LoginDataType,
  loginSchema,
  RefreshAccessTokenData,
  refreshAccessTokenSchema,
  SignUpDateType,
  signUpSchema,
  UserType,
  VerifyUserDataType,
  verifyUserSchema,
} from "@repo/shared";
import { Request, response, Response } from "express";
import { VerificationService } from "@/services/VerificationService";

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
  async register(req: Request, res: Response): Promise<Response> {
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

  async verifyEmail(req: Request, res: Response): Promise<Response> {
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
  }

  async singIn(req: Request, res: Response): Promise<Response> {
    const loginData = this.validateBody<LoginDataType>(loginSchema, req.body);

    const responseData = await this.authService.loginUser(loginData);

    return this.sendSuccess(res, "Successfully Signed In", 200, responseData);
  }

  async refreshAccessToken(req: Request, res: Response): Promise<Response> {
    const { email, refreshToken } = this.validateBody<RefreshAccessTokenData>(
      refreshAccessTokenSchema,
      req.body
    );

    const accessToken = await this.authService.refreshAccessToken(
      refreshToken,
      email
    );
    return this.sendSuccess(res, "Access token generated", 200, accessToken);
  }
}
