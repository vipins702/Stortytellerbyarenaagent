export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { SeoManager } from "@/components/seo/SeoManager";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SeoPage() {
  const user = await getCurrentUser();
  const website = await prisma.website.findFirst({ where: { ownerId: user.id }, include: { pages: { orderBy: { createdAt: "asc" }, take: 1 } }, orderBy: { updatedAt: "desc" } });
  return <AppShell>{!website || !website.pages[0] ? <EmptyState title="Create a website first" body="Search settings are managed per published page." /> : <SeoManager website={{ id: website.id, name: website.name, slug: website.slug, industry: website.industry }} page={{ id: website.pages[0].id, title: website.pages[0].title, path: website.pages[0].path, seo: website.pages[0].seo }} />}</AppShell>;
}
