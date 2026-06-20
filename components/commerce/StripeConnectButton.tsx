"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";

export function StripeConnectButton() {
  const [pending, startTransition] = useTransition();
  async function connect() {
    const res = await fetch("/api/connect/stripe", { method: "POST" });
    const json = await res.json();
    if (!res.ok) return alert(json.error || "Unable to connect Stripe");
    window.location.href = json.url;
  }
  return <Button variant="gold" disabled={pending} onClick={() => startTransition(connect)}>{pending ? "Opening Stripe…" : "Connect Stripe Express"}</Button>;
}
