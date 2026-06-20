"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/Button";

export function CreateWebsiteButton({ label = "New website" }: { label?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  async function create() {
    const name = prompt("Website name", "Maison Aurelia");
    if (!name) return;
    const res = await fetch("/api/websites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, industry: "Luxury retail" }) });
    if (!res.ok) { alert("Unable to create website"); return; }
    router.refresh();
    router.push("/builder");
  }
  return <Button variant="gold" disabled={isPending} onClick={() => startTransition(create)}>{isPending ? "Creating…" : label}</Button>;
}
