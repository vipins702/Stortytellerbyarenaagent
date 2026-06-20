"use client";

import { useTransition } from "react";

export function BuyButton({ slug, productId }: { slug: string; productId: string }) {
  const [pending, startTransition] = useTransition();
  async function buy() {
    const res = await fetch(`/api/storefront/${slug}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ productId, quantity: 1 }] })
    });
    const json = await res.json();
    if (!res.ok) return alert(json.error || "Checkout failed");
    window.location.href = json.url;
  }
  return <button disabled={pending} onClick={() => startTransition(buy)} className="mt-5 rounded-full border border-black/10 px-5 py-2 font-bold disabled:opacity-60">{pending ? "Opening checkout…" : "Buy now"}</button>;
}
