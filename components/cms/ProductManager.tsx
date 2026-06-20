"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";

type Variant = { id?: string; name: string; sku?: string | null; price?: number | null; stock: number };
type Product = { id: string; websiteId: string; name: string; price: number; stock: number; status: "Active" | "Draft" | "Archived"; sku?: string | null; description?: string | null; metadata?: any; variants?: Variant[] };
type Asset = { id: string; url: string; filename: string; type: string };

export function ProductManager({ websiteId, products, assets = [] }: { websiteId: string; products: Product[]; assets?: Asset[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  function openEditor(product?: Product) {
    setEditing(product || null);
    setVariants(product?.variants?.length ? product.variants : []);
    setImageUrl(product?.metadata?.imageUrl || "");
    setOpen(true);
  }

  function updateVariant(index: number, patch: Partial<Variant>) {
    setVariants((current) => current.map((variant, i) => i === index ? { ...variant, ...patch } : variant));
  }

  async function save(formData: FormData) {
    const payload = {
      name: String(formData.get("name")),
      description: String(formData.get("description") || ""),
      price: Math.round(Number(formData.get("price")) * 100),
      stock: Number(formData.get("stock")),
      sku: String(formData.get("sku") || ""),
      status: String(formData.get("status")) as Product["status"],
      variants: variants.filter((variant) => variant.name).map((variant) => ({ ...variant, price: variant.price ? Number(variant.price) : undefined, stock: Number(variant.stock || 0) })),
      metadata: { ...(editing?.metadata || {}), source: "cms-ui", imageUrl }
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
    <div className="mb-6 flex items-end justify-between"><div><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Products</h1><p className="mt-2 text-charcoal/60">Premium DB-backed inventory, images and variant management.</p></div><Button variant="gold" onClick={() => openEditor()}>Add product</Button></div>
    <Card className="p-6"><div className="overflow-x-auto"><table className="w-full border-separate border-spacing-y-2 text-sm"><thead><tr>{["Product","Price","Stock","Variants","Status",""] .map(h => <th key={h} className="px-4 py-2 text-left text-xs font-black uppercase tracking-widest text-charcoal/45">{h}</th>)}</tr></thead><tbody>{products.map((p) => <tr key={p.id}><td className="border-y border-l border-black/10 bg-white/70 px-4 py-4 first:rounded-l-2xl"><div className="flex items-center gap-3">{p.metadata?.imageUrl && <img src={p.metadata.imageUrl} alt="" className="h-12 w-12 rounded-xl object-cover"/>}<div><b>{p.name}</b><p className="text-xs text-charcoal/50">{p.sku || "No SKU"}</p></div></div></td><td className="border-y border-black/10 bg-white/70 px-4 py-4">${(p.price/100).toFixed(2)}</td><td className="border-y border-black/10 bg-white/70 px-4 py-4">{p.stock}</td><td className="border-y border-black/10 bg-white/70 px-4 py-4">{p.variants?.length || 0}</td><td className="border-y border-black/10 bg-white/70 px-4 py-4"><Badge>{p.status}</Badge></td><td className="border-y border-r border-black/10 bg-white/70 px-4 py-4 last:rounded-r-2xl"><div className="flex gap-2"><Button variant="light" className="px-3 py-2" onClick={() => openEditor(p)}>Edit</Button><Button variant="dark" className="px-3 py-2" onClick={() => startTransition(() => remove(p))}>Delete</Button></div></td></tr>)}</tbody></table>{products.length === 0 && <p className="py-10 text-center text-charcoal/55">No products yet. Add your first product.</p>}</div></Card>
    {open && <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-xl"><Card className="max-h-[92vh] w-full max-w-4xl overflow-auto p-6"><div className="flex justify-between"><h2 className="font-serif text-4xl font-black tracking-[-.04em]">{editing ? "Edit product" : "Add product"}</h2><Button variant="ghost" onClick={() => setOpen(false)}>Close</Button></div><form action={(fd) => startTransition(() => save(fd))} className="mt-6 grid gap-4"><input required name="name" defaultValue={editing?.name} className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3" placeholder="Product name"/><textarea name="description" defaultValue={editing?.description || ""} className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3" placeholder="Description"/><div className="grid gap-3 md:grid-cols-3"><input required name="price" type="number" step="0.01" defaultValue={editing ? editing.price/100 : 99} className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3" placeholder="Price"/><input required name="stock" type="number" defaultValue={editing?.stock || 10} className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3" placeholder="Stock"/><input name="sku" defaultValue={editing?.sku || ""} className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3" placeholder="SKU"/></div><div className="rounded-3xl border border-black/10 bg-white/60 p-4"><div className="flex items-center justify-between"><b>Product image</b><span className="text-xs text-charcoal/45">Asset library images</span></div>{imageUrl && <img src={imageUrl} alt="Selected product" className="mt-3 h-36 w-full rounded-2xl object-cover"/>}<div className="mt-3 grid max-h-48 gap-2 overflow-auto md:grid-cols-3">{assets.map((asset) => <button type="button" key={asset.id} onClick={() => setImageUrl(asset.url)} className={`overflow-hidden rounded-2xl border ${imageUrl === asset.url ? "border-gold" : "border-black/10"}`}><img src={asset.url} alt={asset.filename} className="h-20 w-full object-cover"/><span className="block truncate p-2 text-xs">{asset.filename}</span></button>)}</div><input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="mt-3 w-full rounded-2xl border border-black/10 bg-white/75 px-4 py-3" placeholder="Or paste image URL"/></div><div className="rounded-3xl border border-black/10 bg-white/60 p-4"><div className="flex items-center justify-between"><b>Variants</b><Button type="button" variant="light" className="px-3 py-2" onClick={() => setVariants([...variants, { name: "", sku: "", price: undefined, stock: 0 }])}>Add variant</Button></div><div className="mt-3 grid gap-2">{variants.map((variant, index) => <div key={index} className="grid gap-2 md:grid-cols-[1fr_1fr_120px_100px_auto]"><input value={variant.name} onChange={(e) => updateVariant(index, { name: e.target.value })} className="rounded-xl border border-black/10 bg-white px-3 py-2" placeholder="Name"/><input value={variant.sku || ""} onChange={(e) => updateVariant(index, { sku: e.target.value })} className="rounded-xl border border-black/10 bg-white px-3 py-2" placeholder="SKU"/><input value={variant.price ? variant.price / 100 : ""} onChange={(e) => updateVariant(index, { price: e.target.value ? Math.round(Number(e.target.value) * 100) : undefined })} type="number" step="0.01" className="rounded-xl border border-black/10 bg-white px-3 py-2" placeholder="Price"/><input value={variant.stock} onChange={(e) => updateVariant(index, { stock: Number(e.target.value) })} type="number" className="rounded-xl border border-black/10 bg-white px-3 py-2" placeholder="Stock"/><Button type="button" variant="ghost" className="px-3 py-2" onClick={() => setVariants(variants.filter((_, i) => i !== index))}>Remove</Button></div>)}</div></div><select name="status" defaultValue={editing?.status || "Draft"} className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3"><option>Draft</option><option>Active</option><option>Archived</option></select><Button disabled={isPending} variant="gold">{isPending ? "Saving…" : "Save product"}</Button></form></Card></div>}
  </>;
}
