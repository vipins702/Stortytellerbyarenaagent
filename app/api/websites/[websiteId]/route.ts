export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: { websiteId: string } }) {
  const user = await getCurrentUser();
  const website = await prisma.website.findFirst({
    where: { id: params.websiteId, ownerId: user.id },
    include: { pages: true, products: true, leads: true, orders: true, assets: true }
  });
  if (!website) return NextResponse.json({ error: "Website not found" }, { status: 404 });
  return NextResponse.json({ data: website });
}

export async function PATCH(request: Request, { params }: { params: { websiteId: string } }) {
  const user = await getCurrentUser();
  const body = await request.json();
  const existing = await prisma.website.findFirst({ where: { id: params.websiteId, ownerId: user.id } });
  if (!existing) return NextResponse.json({ error: "Website not found" }, { status: 404 });
  const website = await prisma.website.update({
    where: { id: params.websiteId },
    data: {
      name: typeof body.name === "string" ? body.name : undefined,
      industry: typeof body.industry === "string" ? body.industry : undefined,
      theme: body.theme,
      metadata: body.metadata
    }
  });
  return NextResponse.json({ data: website });
}

export async function DELETE(_: Request, { params }: { params: { websiteId: string } }) {
  const user = await getCurrentUser();
  const existing = await prisma.website.findFirst({ where: { id: params.websiteId, ownerId: user.id } });
  if (!existing) return NextResponse.json({ error: "Website not found" }, { status: 404 });
  await prisma.website.delete({ where: { id: params.websiteId } });
  return NextResponse.json({ ok: true });
}
