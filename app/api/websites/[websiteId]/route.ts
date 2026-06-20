export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { assertWebsitePermission } from "@/lib/permissions";
import { audit } from "@/lib/audit";

export async function GET(_: Request, { params }: { params: { websiteId: string } }) {
  const user = await getCurrentUser();
  const website = await prisma.website.findFirst({
    where: { id: params.websiteId, OR: [{ ownerId: user.id }, { organization: { memberships: { some: { userId: user.id } } } }] },
    include: { pages: true, products: true, leads: true, orders: true, assets: true }
  });
  if (!website) return NextResponse.json({ error: "Website not found" }, { status: 404 });
  return NextResponse.json({ data: website });
}

export async function PATCH(request: Request, { params }: { params: { websiteId: string } }) {
  const user = await getCurrentUser();
  const body = await request.json();
  await assertWebsitePermission({ userId: user.id, websiteId: params.websiteId, permission: "website:write" });
  const website = await prisma.website.update({
    where: { id: params.websiteId },
    data: {
      name: typeof body.name === "string" ? body.name : undefined,
      industry: typeof body.industry === "string" ? body.industry : undefined,
      theme: body.theme,
      metadata: body.metadata
    }
  });
  await audit({ userId: user.id, action: "website.update", resource: "Website", resourceId: website.id, request });
  return NextResponse.json({ data: website });
}

export async function DELETE(request: Request, { params }: { params: { websiteId: string } }) {
  const user = await getCurrentUser();
  await assertWebsitePermission({ userId: user.id, websiteId: params.websiteId, permission: "website:write" });
  await audit({ userId: user.id, action: "website.delete", resource: "Website", resourceId: params.websiteId, request });
  await prisma.website.delete({ where: { id: params.websiteId } });
  return NextResponse.json({ ok: true });
}
