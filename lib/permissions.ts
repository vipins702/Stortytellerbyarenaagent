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
  const website = await prisma.website.findFirst({
    where: {
      id: input.websiteId,
      OR: [
        { ownerId: input.userId },
        { organization: { memberships: { some: { userId: input.userId } } } }
      ]
    },
    include: { organization: { include: { memberships: { where: { userId: input.userId } } } } }
  });
  if (!website) throw new Error("Website not found or access denied");
  if (website.ownerId === input.userId) return website;
  const role = website.organization?.memberships[0]?.role;
  if (!role || !roleCan(role, input.permission)) throw new Error("You do not have permission for this action");
  return website;
}
