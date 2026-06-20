import { AppShell } from "@/components/AppShell";
import { DataTable } from "@/components/cms/DataTable";
import { leads } from "@/lib/data";

export default function LeadsPage() {
  return <AppShell><div className="mb-6"><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Leads</h1><p className="mt-2 text-charcoal/60">Contact form submissions and lead notifications.</p></div><DataTable title="Lead submissions" headers={["Name", "Email", "Source", "Date"]} rows={leads.map((l) => [l.name, l.email, l.source, l.createdAt])} /></AppShell>;
}
