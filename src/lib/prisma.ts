import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

let _prisma: PrismaClient | null = null;

function getPrisma(): PrismaClient {
  if (!_prisma) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    _prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString: url }),
    });
  }
  return _prisma;
}

async function checkConnection(): Promise<{ ok: boolean; error?: string }> {
  try {
    const prisma = getPrisma();
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[prisma] connection check failed:", msg);
    return { ok: false, error: msg };
  }
}

async function withDb<T>(
  fn: (prisma: PrismaClient) => Promise<T>,
  fallback: T
): Promise<T> {
  const conn = await checkConnection();
  if (!conn.ok) {
    console.warn("[prisma] DB unavailable, using fallback");
    return fallback;
  }
  try {
    return await fn(getPrisma());
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (
      msg.includes("does not exist") ||
      msg.includes("relation") ||
      msg.includes("Base table")
    ) {
      console.warn("[prisma] table not found:", msg);
      return fallback;
    }
    throw err;
  }
}

export { getPrisma, checkConnection, withDb };
