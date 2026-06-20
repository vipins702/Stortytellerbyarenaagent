import { prisma } from "@/lib/prisma";

export async function audit(input: { userId?: string; action: string; resource: string; resourceId?: string; metadata?: Record<string, unknown>; request?: Request }) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId,
        action: input.action,
        resource: input.resource,
        resourceId: input.resourceId,
        metadata: (input.metadata || {}) as any,
        ip: input.request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || input.request?.headers.get("x-real-ip") || undefined,
        userAgent: input.request?.headers.get("user-agent") || undefined
      }
    });
  } catch {
    // Never block user flows because an audit write failed.
  }
}
