export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { DomainManager } from "@/components/domains/DomainManager";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { websiteScope } from "@/lib/scope";

export default async function DomainsPage() {
  const user = await getCurrentUser();
  const [websites, domains] = await Promise.all([
    prisma.website.findMany({ where: websiteScope(user), select: { id: true, name: true } }),
    prisma.domain.findMany({ where: { website: websiteScope(user) }, include: { website: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" } })
  ]);
  return <AppShell><DomainManager websites={websites} domains={domains as any} /></AppShell>;
}
