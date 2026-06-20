"use client";

import { useState, useTransition } from "react";

type Variant = { id: string; name: string; price?: number | null; stock: number };
type Product = { id: string; name: string; price: number; stock: number; variants?: Variant[] };

export function ProductPurchase({ slug, product }: { slug: string; product: Product }) {
  const variants = product.variants || [];
  const [variantId, setVariantId] = useState(variants[0]?.id || "");
  const [pending, startTransition] = useTransition();
  const selected = variants.find((variant) => variant.id === variantId);
  const price = selected?.price ?? product.price;
  const stock = selected ? selected.stock : product.stock;

  async function checkout() {
    const res = await fetch(`/api/storefront/${slug}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ productId: product.id, variantId: variantId || undefined, quantity: 1 }] })
    });
    const json = await res.json();
    if (!res.ok) return alert(json.error || "Checkout failed");
    window.location.href = json.url;
  }

  return <div className="mt-8 rounded-[2rem] border border-black/10 bg-white/70 p-5 shadow-xl">
    <div className="flex items-end justify-between gap-4"><div><p className="text-sm text-black/50">Price</p><b className="text-3xl">${(price / 100).toFixed(2)}</b></div><p className="text-sm text-black/50">{stock > 0 ? `${stock} in stock` : "Out of stock"}</p></div>
    {variants.length > 0 && <label className="mt-5 grid gap-2"><span className="text-sm font-bold text-black/55">Choose option</span><select value={variantId} onChange={(e) => setVariantId(e.target.value)} className="rounded-2xl border border-black/10 bg-white px-4 py-3">{variants.map((variant) => <option key={variant.id} value={variant.id}>{variant.name} · ${((variant.price ?? product.price) / 100).toFixed(2)}</option>)}</select></label>}
    <button disabled={pending || stock <= 0} onClick={() => startTransition(checkout)} className="mt-5 w-full rounded-full bg-[#D4AF37] px-6 py-3 font-bold text-white disabled:opacity-50">{pending ? "Opening checkout…" : "Buy now"}</button>
  </div>;
}
