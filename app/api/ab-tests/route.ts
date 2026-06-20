export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({ websiteId: z.string(), name: z.string().min(2), goal: z.string().default("lead_submit"), targetPath: z.string().default("/") });

export async function GET() {
  const user = await getCurrentUser();
  const tests = await prisma.aBTest.findMany({ where: { website: { ownerId: user.id } }, include: { website: true, variants: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: tests });
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const input = schema.parse(await request.json());
    const website = await prisma.website.findFirst({ where: { id: input.websiteId, ownerId: user.id }, include: { pages: { take: 1 } } });
    if (!website) return NextResponse.json({ error: "Website not found" }, { status: 404 });
    const baseSections = website.pages[0]?.sections || [];
    const test = await prisma.aBTest.create({ data: { websiteId: website.id, name: input.name, goal: input.goal, targetPath: input.targetPath, variants: { create: [{ name: "Control", weight: 50, sections: baseSections }, { name: "Variant B", weight: 50, sections: baseSections, metrics: { note: "Edit this variant via future visual experiment editor." } }] } }, include: { variants: true } });
    return NextResponse.json({ data: test }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create A/B test" }, { status: 400 });
  }
}
