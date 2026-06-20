export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { DomainManager } from "@/components/domains/DomainManager";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DomainsPage() {
  const user = await getCurrentUser();
  const [websites, domains] = await Promise.all([
    prisma.website.findMany({ where: { ownerId: user.id }, select: { id: true, name: true } }),
    prisma.domain.findMany({ where: { website: { ownerId: user.id } }, include: { website: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" } })
  ]);
  return <AppShell><DomainManager websites={websites} domains={domains as any} /></AppShell>;
}
