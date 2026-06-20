import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function ensureTenantForUser(user: { id: string; email: string; name?: string | null; primaryTenantId?: string | null }) {
  if (user.primaryTenantId) {
    const existing = await prisma.tenant.findUnique({ where: { id: user.primaryTenantId } });
    if (existing) return existing;
  }
  const baseSlug = slugify(user.name || user.email.split("@")[0] || "workspace") || "workspace";
  let slug = baseSlug;
  let index = 1;
  while (await prisma.tenant.findUnique({ where: { slug } })) {
    index += 1;
    slug = `${baseSlug}-${index}`;
  }
  const tenant = await prisma.tenant.create({ data: { name: `${user.name || user.email.split("@")[0]} Workspace`, slug, ownerUserId: user.id, metadata: { createdBy: "ensureTenantForUser" } } });
  await prisma.tenantMember.upsert({ where: { tenantId_userId: { tenantId: tenant.id, userId: user.id } }, update: { role: "Owner" }, create: { tenantId: tenant.id, userId: user.id, role: "Owner" } });
  await prisma.tenantSettings.upsert({ where: { tenantId: tenant.id }, update: {}, create: { tenantId: tenant.id, userId: user.id } });
  await prisma.user.update({ where: { id: user.id }, data: { primaryTenantId: tenant.id } });
  return tenant;
}
