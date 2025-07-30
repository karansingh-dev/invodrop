import config from "@/config/config";
import { Resend } from "resend";
import path, { PlatformPath } from "path";
import ejs from "ejs";
import fs from "fs";
import { logger } from "@repo/logger";
import { type PrismaClient } from "@repo/db";
import { UserRepository } from "@/repositories/UserRepository";

export interface VerifiedUser {
  id: string;
  firstname: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
}

export class VerificationService {
  private userRepository: UserRepository;
  private readonly resendApiKey = config.RESEND_API_KEY;
  private path: PlatformPath;
  private resend: Resend;

  constructor(prisma: PrismaClient) {
    this.userRepository = new UserRepository(prisma);
    this.resend = new Resend(this.resendApiKey);
    this.path = path;
  }

  /**
   Initiating all dependencies
  */

  /**
   * Send verification code.
   * Throws standard Error with a message for the controller to catch.
   */

  async sendVerificationEmail(
    fullName: string,
    verificationCode: string,
    email: string
  ): Promise<string> {
    const templatePath = this.path.resolve(
      __dirname,
      "../../views/emailTemplate.ejs"
    );
    const template = fs.readFileSync(templatePath, "utf-8");
    const html = ejs.render(template, { fullName, verificationCode });
    try {
      const response = await this.resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [email],
        subject: "verification code",
        html,
      });

      if (!response.data) throw new Error("Failed sending verificaition email");

      return response.data.id;
    } catch (emailError: any) {
      logger.error("error sending verification email", emailError.message);
      throw new Error("Failed To send verification email");
    }
  }

  async verifyUser(
    email: string,
    verificationCode: string
  ): Promise<VerifiedUser> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (!existingUser) throw new Error("User not found");

    if (existingUser.isEmailVerified === true) {
      throw new Error("User already verified");
    }

    const currentTime = new Date();

    if (existingUser.verificationCodeExpiresAt < currentTime) {
      throw new Error("Verificaiton code expired, please signup again");
    }

    if (existingUser.verificationCode !== verificationCode) {
      throw new Error("Incorrect verification code");
    }

    const verifiedUser = await this.userRepository.verifyUserByEmail(email);

    return {
      id: verifiedUser.id,
      firstname: verifiedUser.firstName,
      lastName: verifiedUser.lastName,
      email: verifiedUser.email,
      isEmailVerified: verifiedUser.isEmailVerified,
    };
  }
}
