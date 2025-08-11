import { PrismaClient } from "../generated/prisma";

export type { PrismaClient } from "../generated/prisma";

export {
  type User,
  type Client,
  type Company,
  Prisma,
} from "../generated/prisma";

export const prisma = new PrismaClient();
