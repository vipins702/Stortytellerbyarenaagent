export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { componentDefinitions } from "@/lib/component-registry";

export async function GET() {
  const definitions = await prisma.componentDefinition.findMany({ where: { isActive: true }, orderBy: { category: "asc" } });
  const dbByType = new Map(definitions.map((definition) => [definition.type, definition]));
  const merged = componentDefinitions.map((definition) => dbByType.get(definition.type) || definition);
  return NextResponse.json({ data: merged, source: definitions.length ? "database+registry" : "registry" });
}
