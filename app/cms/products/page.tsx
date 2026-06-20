import { AppShell } from "@/components/AppShell";
import { DataTable } from "@/components/cms/DataTable";
import { Button } from "@/components/ui/Button";
import { products } from "@/lib/data";

export default function ProductsPage() {
  return <AppShell><div className="mb-6 flex items-end justify-between"><div><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Products</h1><p className="mt-2 text-charcoal/60">Inventory and product showcase management.</p></div><Button variant="gold">Add product</Button></div><DataTable title="Product inventory" headers={["Name", "Price", "Stock", "Status"]} rows={products.map((p) => [p.name, `$${p.price}`, p.stock, p.status])} /></AppShell>;
}
