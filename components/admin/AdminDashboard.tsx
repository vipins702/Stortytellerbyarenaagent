import { Badge, Card } from "@/components/ui/Card";

export function AdminDashboard({ data }: { data: any }) {
  const stats = [
    ["Users", data.users],
    ["Websites", data.websites],
    ["Subscriptions", data.subscriptions],
    ["Orders", data.orders],
    ["Leads", data.leads],
    ["Webhook events", data.webhooks]
  ];
  return <div className="mx-auto max-w-7xl px-4 py-8"><div className="mb-8"><p className="text-xs font-black uppercase tracking-[.22em] text-[#8a6818]">Platform admin</p><h1 className="mt-3 font-serif text-6xl font-black tracking-[-.06em]">Operations overview</h1><p className="mt-4 text-charcoal/60">Monitor platform health, user activity and recent system events.</p></div><div className="grid gap-4 md:grid-cols-3">{stats.map(([label, value]) => <Card key={label} className="p-6"><p className="text-sm font-bold text-charcoal/50">{label}</p><b className="mt-2 block text-4xl tracking-[-.05em]">{value}</b></Card>)}</div><div className="mt-6 grid gap-6 xl:grid-cols-2"><Card className="p-6"><h2 className="text-xl font-black">Recent audit logs</h2><div className="mt-4 grid gap-3">{data.auditLogs.map((log: any) => <div key={log.id} className="rounded-2xl bg-white/70 p-4"><div className="flex justify-between gap-3"><Badge>{log.action}</Badge><span className="text-xs text-charcoal/45">{new Date(log.createdAt).toLocaleString()}</span></div><p className="mt-2 text-sm text-charcoal/60">{log.resource} {log.resourceId || ""}</p><p className="mt-1 text-xs text-charcoal/45">{log.user?.email || "System"}</p></div>)}</div></Card><Card className="p-6"><h2 className="text-xl font-black">Webhook events</h2><div className="mt-4 grid gap-3">{data.webhookEvents.map((event: any) => <div key={event.id} className="rounded-2xl bg-white/70 p-4"><div className="flex justify-between gap-3"><Badge>{event.type}</Badge><span className="text-xs text-charcoal/45">{event.processed ? "Processed" : "Pending"}</span></div><p className="mt-2 break-all text-xs text-charcoal/50">{event.id}</p></div>)}</div></Card></div></div>;
}
