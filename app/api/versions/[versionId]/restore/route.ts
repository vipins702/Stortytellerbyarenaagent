export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { assertWebsitePermission } from "@/lib/permissions";
import { audit } from "@/lib/audit";

export async function POST(_: Request, { params }: { params: { versionId: string } }) {
  const user = await getCurrentUser();
  const version = await prisma.publishVersion.findFirst({ where: { id: params.versionId, website: { ownerId: user.id } } });
  if (!version) return NextResponse.json({ error: "Version not found" }, { status: 404 });
  await assertWebsitePermission({ userId: user.id, websiteId: version.websiteId, permission: "website:publish" });
  const snapshot = version.snapshot as any;
  await prisma.$transaction(async (tx) => {
    await tx.website.update({ where: { id: version.websiteId }, data: { theme: snapshot.theme, metadata: { ...(snapshot.metadata || {}), restoredFromVersion: version.version } } });
    for (const page of snapshot.pages || []) {
      await tx.page.upsert({
        where: { websiteId_path: { websiteId: version.websiteId, path: page.path } },
        update: { title: page.title, sections: page.sections, seo: page.seo },
        create: { websiteId: version.websiteId, title: page.title, path: page.path, sections: page.sections, seo: page.seo }
      });
    }
  });
  await audit({ userId: user.id, action: "version.restore", resource: "PublishVersion", resourceId: version.id, request: _, metadata: { websiteId: version.websiteId, version: version.version } });
  return NextResponse.json({ ok: true });
}
