"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

type Product = { id: string; name: string; price: number; stock: number; metadata?: any };
type CartItem = { productId: string; quantity: number };

export function StorefrontCart({ slug, products }: { slug: string; products: Product[] }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const key = `cart:${slug}`;

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(key) || "[]")); } catch { setItems([]); }
  }, [key]);

  function persist(next: CartItem[]) {
    setItems(next);
    localStorage.setItem(key, JSON.stringify(next));
  }

  function add(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product || product.stock <= 0) return alert("This item is out of stock.");
    const current = items.find((item) => item.productId === productId);
    const next = current
      ? items.map((item) => item.productId === productId ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item)
      : [...items, { productId, quantity: 1 }];
    persist(next); setOpen(true);
  }

  function remove(productId: string) { persist(items.filter((item) => item.productId !== productId)); }

  const enriched = useMemo(() => items.map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) })).filter((item) => item.product), [items, products]);
  const total = enriched.reduce((sum, item) => sum + (item.product!.price * item.quantity), 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  async function checkout() {
    const res = await fetch(`/api/storefront/${slug}/checkout`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items }) });
    const json = await res.json();
    if (!res.ok) return alert(json.error || "Checkout failed");
    window.location.href = json.url;
  }

  return <>
    <button onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-50 rounded-full bg-[#1a1a1a] px-5 py-3 text-sm font-bold text-white shadow-2xl">Cart · {count}</button>
    {open && <div className="fixed inset-0 z-[60] bg-black/40 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}><div onClick={(e) => e.stopPropagation()} className="ml-auto h-full w-full max-w-md overflow-auto rounded-[2rem] bg-[#F8F6F0] p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="font-serif text-4xl font-black tracking-[-.05em]">Your cart</h2><button onClick={() => setOpen(false)} className="rounded-full border border-black/10 px-4 py-2 font-bold">Close</button></div><div className="mt-6 grid gap-3">{enriched.map((item) => <div key={item.productId} className="rounded-3xl border border-black/10 bg-white/70 p-4"><div className="flex justify-between gap-3"><div><b>{item.product!.name}</b><p className="text-sm text-black/50">Qty {item.quantity} · ${(item.product!.price / 100).toFixed(2)}</p></div><button onClick={() => remove(item.productId)} className="text-sm font-bold text-black/45">Remove</button></div></div>)}{!enriched.length && <p className="rounded-3xl bg-white/70 p-6 text-center text-black/50">Your cart is empty.</p>}</div><div className="mt-6 border-t border-black/10 pt-5"><div className="flex justify-between text-xl font-black"><span>Total</span><span>${(total / 100).toFixed(2)}</span></div><button disabled={pending || !items.length} onClick={() => startTransition(checkout)} className="mt-5 w-full rounded-full bg-[#D4AF37] px-6 py-3 font-bold text-white disabled:opacity-50">{pending ? "Opening checkout…" : "Checkout"}</button></div></div></div>}
    <CartApi add={add} />
  </>;
}

function CartApi({ add }: { add: (productId: string) => void }) {
  useEffect(() => {
    (window as any).AureliaCart = { add };
    return () => { delete (window as any).AureliaCart; };
  }, [add]);
  return null;
}

export function AddToCartButton({ productId }: { productId: string }) {
  return <button onClick={() => (window as any).AureliaCart?.add(productId)} className="mt-5 rounded-full border border-black/10 px-5 py-2 font-bold">Add to cart</button>;
}
