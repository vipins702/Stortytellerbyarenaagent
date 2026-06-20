import { AppShell } from "@/components/AppShell";
import { DataTable } from "@/components/cms/DataTable";
import { orders } from "@/lib/data";

export default function OrdersPage() {
  return <AppShell><div className="mb-6"><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Orders</h1><p className="mt-2 text-charcoal/60">Track checkout and fulfillment status.</p></div><DataTable title="Recent orders" headers={["Order", "Customer", "Total", "Status"]} rows={orders.map((o) => [o.id, o.customer, `$${o.total}`, o.status])} /></AppShell>;
}
