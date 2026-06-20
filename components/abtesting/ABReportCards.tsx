import { Badge, Card } from "@/components/ui/Card";

export function ABReportCards({ reports }: { reports: any[] }) {
  if (!reports.length) return null;
  return <div className="mt-8 grid gap-4"><h2 className="font-serif text-4xl font-black tracking-[-.05em]">Experiment reports</h2>{reports.map((report) => <Card key={report.test.id} className="p-6"><div className="flex items-center justify-between gap-4"><div><Badge>{report.test.status}</Badge><h3 className="mt-3 text-xl font-black">{report.test.name}</h3><p className="text-sm text-charcoal/55">Goal: {report.test.goal}</p></div><p className="text-sm text-charcoal/45">{report.eventCount} events</p></div><div className="mt-5 grid gap-3 md:grid-cols-2">{report.variants.map((variant: any) => <div key={variant.variantId} className="rounded-2xl border border-black/10 bg-white/70 p-4"><b>{variant.name}</b><div className="mt-3 grid grid-cols-3 gap-2 text-sm"><span>{variant.views}<br/><small>views</small></span><span>{variant.conversions}<br/><small>conversions</small></span><span>{Math.round(variant.conversionRate * 100)}%<br/><small>rate</small></span></div></div>)}</div></Card>)}</div>;
}
