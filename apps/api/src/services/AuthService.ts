import { type PrismaClient } from "@repo/db";
import { UserRepository } from "../repositories/UserRepository";
import { PasswordUtil } from "../utils/password";
import { JWTUtil } from "../utils/jwt";
import { CodeGenerator } from "@/utils/codeGenerator";
import { SignUpDateType } from "@repo/shared";
import { VerificationService } from "./VerificationService";


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
    //for not getting any conflict
    userData.email = userData.email.toLowerCase();

    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        throw new Error("Email is already registered and verified.");
      }
    }

    const hashedPassword = await this.passwordUtil.hash(userData.password);
    const verificationCode = CodeGenerator.generateNumericCode();
    //2 hours validity
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
      verificationEmailId: verificationEmailId,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    };
  }
}
