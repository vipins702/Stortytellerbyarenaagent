export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { assertWebsitePermission } from "@/lib/permissions";
import { audit } from "@/lib/audit";

const patchSchema = z.object({ primary: z.boolean().optional(), status: z.string().optional() });

export async function PATCH(request: Request, { params }: { params: { domainId: string } }) {
  try {
    const user = await getCurrentUser();
    const domain = await prisma.domain.findFirst({ where: { id: params.domainId }, include: { website: true } });
    if (!domain) return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    await assertWebsitePermission({ userId: user.id, websiteId: domain.websiteId, permission: "website:publish" });
    const input = patchSchema.parse(await request.json());
    if (input.primary) {
      const siblings = await prisma.domain.findMany({ where: { websiteId: domain.websiteId } });
      await Promise.all(siblings.map((item) => prisma.domain.update({ where: { id: item.id }, data: { metadata: { ...((item.metadata as any) || {}), primary: item.id === domain.id } } })));
    }
    const updated = await prisma.domain.update({ where: { id: domain.id }, data: { status: input.status || undefined, metadata: { ...((domain.metadata as any) || {}), primary: input.primary ?? (domain.metadata as any)?.primary } } });
    await audit({ userId: user.id, action: "domain.update", resource: "Domain", resourceId: domain.id, request, metadata: { primary: input.primary } });
    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update domain" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { domainId: string } }) {
  try {
    const user = await getCurrentUser();
    const domain = await prisma.domain.findFirst({ where: { id: params.domainId } });
    if (!domain) return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    await assertWebsitePermission({ userId: user.id, websiteId: domain.websiteId, permission: "website:publish" });
    await audit({ userId: user.id, action: "domain.delete", resource: "Domain", resourceId: domain.id, request, metadata: { hostname: domain.hostname } });
    await prisma.domain.delete({ where: { id: domain.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete domain" }, { status: 400 });
  }
}
