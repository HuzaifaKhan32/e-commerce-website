import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma";

// Extend globalThis to hold our singleton prisma instance across hot-reloads
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  const databaseUrl = process.env.DATABASE_URL || '';
  const isProduction = process.env.NODE_ENV === 'production';

  // 🔄 For Prisma 7 with custom output, we need an adapter
  // Pass connection string directly (not Pool) for serverless compatibility
  const adapter = new PrismaPg({ connectionString: databaseUrl });

  if (!isProduction) {
    const isSupabase = databaseUrl.includes('supabase.com');
    console.log(`🟢 [Prisma] ${isSupabase ? 'SUPABASE' : 'LOCAL PostgreSQL'}`);
    console.log('🔗 Database:', databaseUrl.substring(0, 50) + '...');
  }

  return new PrismaClient({
    adapter,
    log: isProduction ? ['error'] : ['error', 'warn'],
  });
};

// ✅ Fix: read .prisma from the global (not the whole wrapper object)
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// In development, save the client on globalThis so it survives hot-reloads
// without opening a new DB connection every time a file changes
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
