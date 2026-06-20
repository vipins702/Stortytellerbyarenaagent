import { prisma } from "@/lib/prisma";

export const planLimits = {
  Free: { websites: 2, aiGenerations: 5, storageMb: 100, customDomains: 0, teamMembers: 1 },
  Pro: { websites: 10, aiGenerations: 100, storageMb: 5000, customDomains: 3, teamMembers: 5 },
  Business: { websites: Infinity, aiGenerations: 500, storageMb: 50000, customDomains: 25, teamMembers: 25 }
} as const;

export type PlanName = keyof typeof planLimits;

export async function getActivePlan(userId: string): Promise<PlanName> {
  const subscription = await prisma.subscription.findFirst({ where: { userId, status: { in: ["active", "trialing"] } }, orderBy: { createdAt: "desc" } });
  return (subscription?.plan || "Free") as PlanName;
}

export async function assertWebsiteLimit(userId: string) {
  const plan = await getActivePlan(userId);
  const count = await prisma.website.count({ where: { ownerId: userId, status: { not: "Archived" } } });
  if (count >= planLimits[plan].websites) {
    throw new Error(`${plan} plan limit reached. Upgrade to create more websites.`);
  }
}

export async function assertDomainLimit(userId: string) {
  const plan = await getActivePlan(userId);
  const count = await prisma.domain.count({ where: { website: { ownerId: userId } } });
  if (count >= planLimits[plan].customDomains) {
    throw new Error(`${plan} plan does not allow more custom domains.`);
  }
}
