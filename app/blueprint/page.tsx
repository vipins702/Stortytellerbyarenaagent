export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { BlueprintGenerator } from "@/components/blueprint/BlueprintGenerator";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function BlueprintPage() {
  const user = await getCurrentUser();
  const blueprints = await prisma.creativeBlueprint.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 10 }).catch(() => []);
  return <AppShell><BlueprintGenerator initialBlueprints={blueprints as any} /></AppShell>;
}
