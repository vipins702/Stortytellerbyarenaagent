export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const templates = await prisma.template.findMany({ orderBy: [{ isPremium: "desc" }, { name: "asc" }] });
  return NextResponse.json({ data: templates });
}
