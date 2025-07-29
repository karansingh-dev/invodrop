import { PrismaClient } from "../generated/prisma";

export type { PrismaClient } from "../generated/prisma";

export { type User } from "../generated/prisma";

export const prisma = new PrismaClient();
