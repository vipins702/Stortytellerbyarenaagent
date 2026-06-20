export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { TeamManager } from "@/components/team/TeamManager";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export default async function TeamPage() {
  const user = await getCurrentUser();
  let org = await prisma.organization.findFirst({ where: { memberships: { some: { userId: user.id } } }, include: { memberships: { include: { user: true } } } });
  if (!org) {
    org = await prisma.organization.create({ data: { name: `${user.name || "Aurelia"} Workspace`, slug: `${slugify(user.name || "aurelia")}-${user.id.slice(0, 6)}`, memberships: { create: { userId: user.id, role: "Owner" } } }, include: { memberships: { include: { user: true } } } });
  }
  return <AppShell><TeamManager org={org} /></AppShell>;
}
