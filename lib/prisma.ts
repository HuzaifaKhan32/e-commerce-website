import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma";

// Extend globalThis to hold our singleton prisma instance across hot-reloads
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  // PrismaPg adapter connects to local PostgreSQL using our DATABASE_URL
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
};

// ✅ Fix: read .prisma from the global (not the whole wrapper object)
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// In development, save the client on globalThis so it survives hot-reloads
// without opening a new DB connection every time a file changes
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
