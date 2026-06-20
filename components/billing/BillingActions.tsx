"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";

export function CheckoutButton({ plan }: { plan: "Pro" | "Business" }) {
  const [pending, startTransition] = useTransition();
  async function checkout() {
    const res = await fetch("/api/billing/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan }) });
    const json = await res.json();
    if (!res.ok) return alert(json.error || "Checkout failed");
    window.location.href = json.url;
  }
  return <Button className="mt-6 w-full" variant={plan === "Pro" ? "gold" : "light"} disabled={pending} onClick={() => startTransition(checkout)}>{pending ? "Opening…" : `Choose ${plan}`}</Button>;
}

export function PortalButton() {
  const [pending, startTransition] = useTransition();
  async function openPortal() {
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const json = await res.json();
    if (!res.ok) return alert(json.error || "Portal unavailable");
    window.location.href = json.url;
  }
  return <Button variant="light" disabled={pending} onClick={() => startTransition(openPortal)}>{pending ? "Opening…" : "Manage subscription"}</Button>;
}
