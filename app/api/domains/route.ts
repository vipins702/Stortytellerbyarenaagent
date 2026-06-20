export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { assertDomainLimit } from "@/lib/plans";

const schema = z.object({ websiteId: z.string(), hostname: z.string().min(3).max(255).toLowerCase() });

export async function GET() {
  const user = await getCurrentUser();
  const domains = await prisma.domain.findMany({ where: { website: { ownerId: user.id } }, include: { website: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: domains });
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    await assertDomainLimit(user.id);
    const input = schema.parse(await request.json());
    const website = await prisma.website.findFirst({ where: { id: input.websiteId, ownerId: user.id } });
    if (!website) return NextResponse.json({ error: "Website not found" }, { status: 404 });
    const domain = await prisma.domain.create({ data: { websiteId: website.id, hostname: input.hostname.replace(/^https?:\/\//, "").replace(/\/$/, ""), metadata: { provider: "vercel", instructions: { type: "CNAME", name: "www", value: "cname.vercel-dns.com" } } } });
    return NextResponse.json({ data: domain }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to add domain" }, { status: 400 });
  }
}
