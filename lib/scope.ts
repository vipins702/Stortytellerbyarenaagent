export function websiteScope(user: { id: string; primaryTenantId?: string | null }) {
  return user.primaryTenantId
    ? { OR: [{ tenantId: user.primaryTenantId }, { ownerId: user.id }, { userId: user.id }] }
    : { OR: [{ ownerId: user.id }, { userId: user.id }] };
}

export function tenantUserData(user: { id: string; primaryTenantId?: string | null }) {
  return { tenantId: user.primaryTenantId || undefined, userId: user.id };
}
