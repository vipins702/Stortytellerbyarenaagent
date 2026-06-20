export const dynamic = "force-dynamic";

import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  await requireAdmin();
  const [users, websites, subscriptions, orders, leads, webhooks, auditLogs, webhookEvents] = await Promise.all([
    prisma.user.count(),
    prisma.website.count(),
    prisma.subscription.count(),
    prisma.order.count(),
    prisma.lead.count(),
    prisma.webhookEvent.count(),
    prisma.auditLog.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.webhookEvent.findMany({ orderBy: { createdAt: "desc" }, take: 30 })
  ]);
  return <AdminDashboard data={{ users, websites, subscriptions, orders, leads, webhooks, auditLogs, webhookEvents }} />;
}
