export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const started = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, database: "ok", latencyMs: Date.now() - started, time: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ ok: false, database: "error", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
