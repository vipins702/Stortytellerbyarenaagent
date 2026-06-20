"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";

type Product = { id: string; websiteId: string; name: string; price: number; stock: number; status: "Active" | "Draft" | "Archived"; sku?: string | null; description?: string | null; metadata?: any };

export function ProductManager({ websiteId, products }: { websiteId: string; products: Product[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();

  async function save(formData: FormData) {
    const payload = {
      name: String(formData.get("name")),
      description: String(formData.get("description") || ""),
      price: Math.round(Number(formData.get("price")) * 100),
      stock: Number(formData.get("stock")),
      sku: String(formData.get("sku") || ""),
      status: String(formData.get("status")) as Product["status"],
      metadata: { source: "cms-ui", imageUrl: String(formData.get("imageUrl") || ""), variants: String(formData.get("variants") || "").split("\n").map(v => v.trim()).filter(Boolean) }
    };
    const url = editing ? `/api/products/${editing.id}` : `/api/websites/${websiteId}/products`;
    const method = editing ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) alert((await res.json()).error || "Unable to save product");
    setOpen(false); setEditing(null); router.refresh();
  }
  async function remove(product: Product) {
    if (!confirm(`Delete ${product.name}?`)) return;
    const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    if (!res.ok) alert("Unable to delete product");
    router.refresh();
  }

  return <>
    <div className="mb-6 flex items-end justify-between"><div><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Products</h1><p className="mt-2 text-charcoal/60">Premium DB-backed inventory and storefront products.</p></div><Button variant="gold" onClick={() => { setEditing(null); setOpen(true); }}>Add product</Button></div>
    <Card className="p-6"><div className="overflow-x-auto"><table className="w-full border-separate border-spacing-y-2 text-sm"><thead><tr>{["Name","Price","Stock","Status",""] .map(h => <th key={h} className="px-4 py-2 text-left text-xs font-black uppercase tracking-widest text-charcoal/45">{h}</th>)}</tr></thead><tbody>{products.map((p) => <tr key={p.id}><td className="border-y border-l border-black/10 bg-white/70 px-4 py-4 first:rounded-l-2xl"><b>{p.name}</b><p className="text-xs text-charcoal/50">{p.sku || "No SKU"}</p></td><td className="border-y border-black/10 bg-white/70 px-4 py-4">${(p.price/100).toFixed(2)}</td><td className="border-y border-black/10 bg-white/70 px-4 py-4">{p.stock}</td><td className="border-y border-black/10 bg-white/70 px-4 py-4"><Badge>{p.status}</Badge></td><td className="border-y border-r border-black/10 bg-white/70 px-4 py-4 last:rounded-r-2xl"><div className="flex gap-2"><Button variant="light" className="px-3 py-2" onClick={() => { setEditing(p); setOpen(true); }}>Edit</Button><Button variant="dark" className="px-3 py-2" onClick={() => startTransition(() => remove(p))}>Delete</Button></div></td></tr>)}</tbody></table>{products.length === 0 && <p className="py-10 text-center text-charcoal/55">No products yet. Add your first product.</p>}</div></Card>
    {open && <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-xl"><Card className="w-full max-w-2xl p-6"><div className="flex justify-between"><h2 className="font-serif text-4xl font-black tracking-[-.04em]">{editing ? "Edit product" : "Add product"}</h2><Button variant="ghost" onClick={() => setOpen(false)}>Close</Button></div><form action={(fd) => startTransition(() => save(fd))} className="mt-6 grid gap-3"><input required name="name" defaultValue={editing?.name} className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3" placeholder="Product name"/><textarea name="description" defaultValue={editing?.description || ""} className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3" placeholder="Description"/><div className="grid gap-3 md:grid-cols-3"><input required name="price" type="number" step="0.01" defaultValue={editing ? editing.price/100 : 99} className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3" placeholder="Price"/><input required name="stock" type="number" defaultValue={editing?.stock || 10} className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3" placeholder="Stock"/><input name="sku" defaultValue={editing?.sku || ""} className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3" placeholder="SKU"/></div><input name="imageUrl" defaultValue={(editing?.metadata as any)?.imageUrl || ""} className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3" placeholder="Product image URL from asset library"/><textarea name="variants" defaultValue={((editing?.metadata as any)?.variants || []).join("\n")} className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3" placeholder={"Variants, one per line: Small / Large / Champagne / Noir"}/><select name="status" defaultValue={editing?.status || "Draft"} className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3"><option>Draft</option><option>Active</option><option>Archived</option></select><Button disabled={isPending} variant="gold">{isPending ? "Saving…" : "Save product"}</Button></form></Card></div>}
  </>;
}
