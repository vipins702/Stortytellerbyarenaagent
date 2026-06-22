export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { LaunchHub } from "@/components/launch/LaunchHub";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { websiteScope } from "@/lib/scope";

export default async function LaunchPage() {
  const user = await getCurrentUser();
  const website = await prisma.website.findFirst({ where: websiteScope(user), include: { pages: { orderBy: { createdAt: "asc" }, take: 1 }, _count: { select: { products: true, leads: true, orders: true } } }, orderBy: { updatedAt: "desc" } }).catch(() => null);
  if (!website || !website.pages[0]) return <AppShell><EmptyState title="Create a website first" body="Launch Hub needs a page to review and publish." /></AppShell>;
  const sections = website.pages[0].sections as any[];
  return <AppShell><LaunchHub data={{ websiteId: website.id, websiteName: website.name, slug: website.slug, status: website.status, seo: website.pages[0].seo, sectionCount: sections.length, hasProducts: JSON.stringify(sections).includes("products") || website._count.products > 0, hasLead: JSON.stringify(sections).includes("lead"), counts: website._count }} /></AppShell>;
}
