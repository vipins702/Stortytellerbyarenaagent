import { Badge, Card } from "@/components/ui/Card";

export function DataTable({ title, headers, rows }: { title: string; headers: string[]; rows: (string | number | React.ReactNode)[][] }) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-black">{title}</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-2 text-sm">
          <thead><tr>{headers.map((h) => <th key={h} className="px-4 py-2 text-left text-xs font-black uppercase tracking-widest text-charcoal/45">{h}</th>)}</tr></thead>
          <tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j} className="border-y border-black/10 bg-white/70 px-4 py-4 first:rounded-l-2xl first:border-l last:rounded-r-2xl last:border-r">{typeof cell === "string" && ["Active","Draft","Paid","Packing","Shipped","Delivered"].includes(cell) ? <Badge>{cell}</Badge> : cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </Card>
  );
}
