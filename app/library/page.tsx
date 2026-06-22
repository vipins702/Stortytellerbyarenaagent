export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { LibraryHub } from "@/components/library/LibraryHub";
import { premiumTemplates } from "@/lib/premium-templates";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { websiteScope } from "@/lib/scope";

export default async function LibraryPage() {
  const user = await getCurrentUser();
  const website = await prisma.website.findFirst({ where: websiteScope(user), include: { _count: { select: { assets: true, products: true } } }, orderBy: { updatedAt: "desc" } }).catch(() => null);
  return <AppShell><LibraryHub data={{ assets: website?._count.assets || 0, products: website?._count.products || 0, templates: premiumTemplates.length, websiteName: website?.name }} /></AppShell>;
}
