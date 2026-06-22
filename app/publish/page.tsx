export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { PublishCenter } from "@/components/publish/PublishCenter";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { websiteScope } from "@/lib/scope";

export default async function PublishPage() {
  const user = await getCurrentUser();
  const website = await prisma.website.findFirst({ where: websiteScope(user), include: { pages: { orderBy: { createdAt: "asc" }, take: 1 } }, orderBy: { updatedAt: "desc" } });
  if (!website || !website.pages[0]) return <AppShell><EmptyState title="Create a website first" body="Publish Center needs a draft page to review." /></AppShell>;
  return <AppShell><PublishCenter website={website} page={website.pages[0]} /></AppShell>;
}
