import { type PrismaClient, Prisma, User, Company } from "@repo/db";

type CompanyCreateInput = Prisma.CompanyCreateInput;

export class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateOnboaringStatusById(id: string, status: boolean): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        onboardingCompleted: status,
      },
    });
  }

  async createCompany(companyData: CompanyCreateInput): Promise<Company> {
    return this.prisma.company.create({
      data: companyData,
    });
  }
}
