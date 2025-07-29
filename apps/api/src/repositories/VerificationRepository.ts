import { PrismaClient, User } from "@repo/db";

export interface getVerificationData {
  verificationCodeExpiresAt: Date;
  verificationCode: string;
}

export class VerificationRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /** 
  extracts verification data by email
  For verification of code of user
  */

  async findByEmail(email: string): Promise<getVerificationData | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        verificationCodeExpiresAt: true,
        verificationCode: true,
      },
    });
  }
}
