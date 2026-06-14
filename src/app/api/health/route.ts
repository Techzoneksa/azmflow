import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const diagnostics: Record<string, unknown> = {
    status: "unknown",
    env: process.env.NODE_ENV,
    database_url_set: !!process.env.DATABASE_URL,
    database_url_prefix: process.env.DATABASE_URL
      ? process.env.DATABASE_URL.substring(0, 20) + "..."
      : "NOT SET",
    timestamp: new Date().toISOString(),
  };

  if (!process.env.DATABASE_URL) {
    diagnostics.status = "error";
    diagnostics.error = "DATABASE_URL environment variable is not set";
    return NextResponse.json(diagnostics, { status: 500 });
  }

  try {
    const { getPrisma } = await import("@/lib/prisma");
    const prisma = getPrisma();
    await prisma.$queryRaw`SELECT 1`;
    diagnostics.status = "healthy";
    diagnostics.database_reachable = true;
  } catch (err) {
    diagnostics.status = "error";
    diagnostics.database_reachable = false;
    diagnostics.error = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json(diagnostics);
}
