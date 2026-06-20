import { prisma } from "@/lib/prisma";

export type Permission =
  | "website:read"
  | "website:write"
  | "website:publish"
  | "billing:manage"
  | "team:manage"
  | "commerce:manage";

const rolePermissions: Record<string, Permission[]> = {
  Owner: ["website:read", "website:write", "website:publish", "billing:manage", "team:manage", "commerce:manage"],
  Admin: ["website:read", "website:write", "website:publish", "team:manage", "commerce:manage"],
  Designer: ["website:read", "website:write", "website:publish"],
  Editor: ["website:read", "website:write"],
  Viewer: ["website:read"],
  Billing: ["website:read", "billing:manage"]
};

export function roleCan(role: string, permission: Permission) {
  return rolePermissions[role]?.includes(permission) || false;
}

export async function assertWebsitePermission(input: { userId: string; websiteId: string; permission: Permission }) {
  const website = await prisma.website.findUnique({
    where: { id: input.websiteId },
    include: { organization: { include: { memberships: { where: { userId: input.userId } } } } }
  });
  if (!website) throw new Error("Website not found or access denied");

  if (website.ownerId === input.userId || website.userId === input.userId) return website;

  if (website.tenantId) {
    const tenantMember = await prisma.tenantMember.findFirst({ where: { tenantId: website.tenantId, userId: input.userId, status: "Active" } });
    if (tenantMember && roleCan(tenantMember.role, input.permission)) return website;
  }

  const legacyRole = website.organization?.memberships[0]?.role;
  if (legacyRole && roleCan(legacyRole, input.permission)) return website;

  throw new Error("You do not have permission for this action");
}
