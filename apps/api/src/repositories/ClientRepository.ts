import { Client, PrismaClient, Prisma } from "@repo/db";

type ClientCreateInput = Prisma.ClientCreateInput;

export class ClientRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByUserIdAndEmail(
    userId: string,
    email: string
  ): Promise<Client | null> {
    return this.prisma.client.findUnique({
      where: {
        userId_email: {
          userId: userId,
          email: email,
        },
      },
    });
  }

  async createClient(client: ClientCreateInput): Promise<Client> {
    return this.prisma.client.create({
      data: client,
    });
  }
}
