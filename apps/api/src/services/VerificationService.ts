import config from "@/config/config";
import { Resend } from "resend";
import path, { PlatformPath } from "path";
import { type PrismaClient } from "@repo/db";
import { UserRepository } from "@/repositories/UserRepository";
import { ApiError } from "@/utils/ApiError";
import { renderTemplate } from "@/utils/renderTemplate";
import { sendEmail } from "@/utils/sendEmail";

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
   * Send verification code.
   * Throws standard Error with a message and errors array for the controller to catch.
   */

  async sendVerificationEmail(
    fullName: string,
    verificationCode: string,
    email: string
  ): Promise<string> {
    const html = renderTemplate("emailTemplate", {
      fullName,
      verificationCode,
    });
    return await sendEmail({
      to: email,
      subject: "Verification code",
      html,
    });
  }
}
