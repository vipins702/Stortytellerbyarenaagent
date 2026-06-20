export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { componentDefinitions } from "@/lib/component-registry";

export async function GET() {
  const definitions = await prisma.componentDefinition.findMany({ where: { isActive: true }, orderBy: { category: "asc" } });
  if (definitions.length === 0) {
    return NextResponse.json({ data: componentDefinitions, source: "registry" });
  }
  return NextResponse.json({ data: definitions, source: "database" });
}
