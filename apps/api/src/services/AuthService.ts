import { type PrismaClient } from "@repo/db";
import { UserRepository } from "../repositories/UserRepository";
import { PasswordUtil } from "../utils/password";
import { JWTUtil, RefreshTokenPayload } from "../utils/jwt";
import { CodeGenerator } from "@/utils/codeGenerator";
import { LoginDataType, SignUpDateType, UserType } from "@repo/shared";
import { VerificationService } from "./VerificationService";
import { ApiError } from "@/utils/ApiError";

interface NewUserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  verificationEmailId: string;
}

export class AuthService {
  /**
   Initiating all dependencies
  */
  private userRepository: UserRepository;
  private verificationService: VerificationService;
  private passwordUtil: PasswordUtil;
  private jwtUtil: JWTUtil;

  constructor(prisma: PrismaClient) {
    this.userRepository = new UserRepository(prisma);
    this.verificationService = new VerificationService(prisma);
    this.passwordUtil = new PasswordUtil();
    this.jwtUtil = new JWTUtil();
  }

  /**
   * Register a new user.
   * Throws standard Error with a message for the controller to catch.
   */
  async registerUser(userData: SignUpDateType): Promise<NewUserData> {
    userData.email = userData.email.toLowerCase();

    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser && existingUser.isEmailVerified) {
      throw new ApiError(400, "Failed to register user", [
        "user with this email already exists",
      ]);
    }

    const hashedPassword = await this.passwordUtil.hash(userData.password);
    const verificationCode = CodeGenerator.generateNumericCode();

    const verificationCodeExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const newUser = await this.userRepository.upsert({
      email: userData.email,
      passwordHash: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      verificationCode,
      verificationCodeExpiresAt,
    });

    const fullName = `${newUser.firstName} ${newUser.lastName}`;
    const verificationEmailId =
      await this.verificationService.sendVerificationEmail(
        fullName,
        newUser.verificationCode,
        newUser.email
      );

    return {
      id: newUser.id,
      verificationEmailId,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    };
  }

  async loginUser(loginData: LoginDataType): Promise<UserType> {
    const existingUser = await this.userRepository.findByEmail(loginData.email);

    if (!existingUser) {
      throw new ApiError(401, "Invalid email ", ["Invalid credentials"]);
    }

    const isPasswordCorrect = this.passwordUtil.compare(
      loginData.password,
      existingUser.passwordHash
    );

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid password", ["Invalid credentials"]);
    }

    const accessTokenPayload = {
      userId: existingUser.id,
      role: existingUser.role,
    };

    const refreshTokenPayload = {
      userId: existingUser.id,

      role: existingUser.role,
    };

    const accessToken = this.jwtUtil.generateAccessToken(accessTokenPayload);
    const refreshToken = this.jwtUtil.generateRefreshToken(refreshTokenPayload);

    return {
      id: existingUser.id,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      onboardingCompleted: existingUser.onboardingCompleted,
      email: existingUser.email,
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(
    refreshToken: string,
    email: string
  ): Promise<{ accessToken: string }> {
    const payload = this.jwtUtil.verifyRefreshToken(refreshToken);

    if (!this.jwtUtil.isJWTPayload(payload))
      throw new ApiError(404, "Invalid refresh token", [
        "Invalid refresh token",
        "do not follow structure",
      ]);

    const nowSeconds = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < nowSeconds) {
      // Token is expired
      throw new ApiError(401, "Refresh token expired", [
        "Refresh token has expired. Please log in again.",
      ]);
    }
    const user = await this.userRepository.findById(payload.userId);

    if (!user || user.email !== email)
      throw new ApiError(404, "User not found", [
        "Invalid token",
        "Invalid email",
      ]);

    const newAccessToken = this.jwtUtil.generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    return { accessToken: newAccessToken };
  }
}
