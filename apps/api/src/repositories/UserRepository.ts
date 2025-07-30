import { type PrismaClient, User } from "@repo/db";

export interface CreateUserData {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  verificationCode: string;
  verificationCodeExpiresAt: Date;
}

export class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /** 
  Finds user by email
  For chekcing existing users
  */

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { email } });
    return count > 0;
  }

  async create(user: CreateUserData): Promise<User> {
    return this.prisma.user.create({
      data: user,
    });
  }

  async upsert(user: CreateUserData): Promise<User> {
    return this.prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: user,
      create: user,
    });
  }

  async verifyUserByEmail(email: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        email,
      },
      data: {
        isEmailVerified: true,
      },
    });
  }
}
