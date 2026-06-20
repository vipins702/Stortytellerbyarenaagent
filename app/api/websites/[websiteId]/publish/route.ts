export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(_: Request, { params }: { params: { websiteId: string } }) {
  const user = await getCurrentUser();
  const website = await prisma.website.findFirst({
    where: { id: params.websiteId, ownerId: user.id },
    include: { pages: true, products: true }
  });
  if (!website) return NextResponse.json({ error: "Website not found" }, { status: 404 });
  const latest = await prisma.publishVersion.findFirst({ where: { websiteId: website.id }, orderBy: { version: "desc" } });
  const version = (latest?.version ?? 0) + 1;
  const published = await prisma.$transaction(async (tx) => {
    await tx.publishVersion.create({ data: { websiteId: website.id, version, snapshot: website } });
    return tx.website.update({ where: { id: website.id }, data: { status: "Published", metadata: { ...(website.metadata as object), lastPublishedVersion: version } } });
  });
  return NextResponse.json({ data: published, url: `/s/${website.slug}`, version });
}
