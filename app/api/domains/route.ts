export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { websiteScope } from "@/lib/scope";
import { getCurrentUser } from "@/lib/auth";
import { assertDomainLimit } from "@/lib/plans";
import { assertWebsitePermission } from "@/lib/permissions";
import { audit } from "@/lib/audit";

const schema = z.object({ websiteId: z.string(), hostname: z.string().min(3).max(255).toLowerCase() });

export async function GET() {
  const user = await getCurrentUser();
  const domains = await prisma.domain.findMany({ where: { website: websiteScope(user) }, include: { website: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: domains });
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    await assertDomainLimit(user.id);
    const input = schema.parse(await request.json());
    await assertWebsitePermission({ userId: user.id, websiteId: input.websiteId, permission: "website:publish" });
    const website = await prisma.website.findUniqueOrThrow({ where: { id: input.websiteId } });
    const domain = await prisma.domain.create({ data: { websiteId: website.id, hostname: input.hostname.replace(/^https?:\/\//, "").replace(/\/$/, ""), metadata: { provider: "vercel", instructions: { type: "CNAME", name: "www", value: "cname.vercel-dns.com" } } } });
    await audit({ userId: user.id, action: "domain.create", resource: "Domain", resourceId: domain.id, request, metadata: { hostname: domain.hostname } });
    return NextResponse.json({ data: domain }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to add domain" }, { status: 400 });
  }
}
