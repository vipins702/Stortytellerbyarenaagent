export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { AssetLibrary } from "@/components/assets/AssetLibrary";
import { EmptyState } from "@/components/EmptyState";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AssetsPage() {
  const user = await getCurrentUser();
  const website = await prisma.website.findFirst({ where: { ownerId: user.id }, include: { assets: { orderBy: { createdAt: "desc" } } }, orderBy: { updatedAt: "desc" } });
  return <AppShell>{!website ? <EmptyState /> : <AssetLibrary websiteId={website.id} assets={website.assets} />}</AppShell>;
}
