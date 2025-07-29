// apps/backend/src/services/AuthService.ts
import { PrismaClient } from "@repo/db";
import { UserRepository } from "../repositories/UserRepository";
import { PasswordUtil } from "../utils/password";
import { JWTUtil } from "../utils/jwt";
import { CodeGenerator } from "@/utils/codeGenerator";
import { SignUpDateType } from "@repo/shared";

export class AuthService {
  /**
   Initiating all dependencies
  */
  private userRepository: UserRepository;
  private passwordUtil: PasswordUtil;
  private jwtUtil: JWTUtil;

  constructor(prisma: PrismaClient) {
    this.userRepository = new UserRepository(prisma);
    this.passwordUtil = new PasswordUtil();
    this.jwtUtil = new JWTUtil();
  }

  /**
   * Register new user
   */
  async registerUser(userData: SignUpDateType): Promise<SignUpDateType | null> {
    const existingUser = await this.userRepository.findByEmail(userData.email);

    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return null;
      }
    }

    const hashedPassword = await this.passwordUtil.hash(userData.password);
    const verificationCode = CodeGenerator.generateNumericCode();
    const verificationCodeExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const newUser = await this.userRepository.create({
      email: userData.email,
      passwordHash: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      verificationCode,
      verificationCodeExpiresAt,
    });
    return userData;
  }
}
