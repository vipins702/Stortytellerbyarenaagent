"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";

export function TeamManager({ org }: { org: any }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  async function invite(formData: FormData) {
    const res = await fetch("/api/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: formData.get("email"), role: formData.get("role") }) });
    const json = await res.json();
    if (!res.ok) alert(json.error || "Invite failed");
    router.refresh();
  }
  return <div><div className="mb-6"><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Team</h1><p className="mt-2 text-charcoal/60">Organization roles and collaboration foundation.</p></div><Card className="mb-6 p-6"><form action={(fd) => startTransition(() => invite(fd))} className="grid gap-3 md:grid-cols-[1fr_180px_auto]"><input required name="email" className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3" placeholder="designer@studio.com"/><select name="role" className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3"><option>Admin</option><option>Designer</option><option>Editor</option><option>Viewer</option><option>Billing</option></select><Button disabled={pending} variant="gold">Invite</Button></form></Card><div className="grid gap-3">{org.memberships.map((m: any) => <Card key={m.id} className="flex items-center justify-between p-5"><div><b>{m.user.name || m.user.email}</b><p className="text-sm text-charcoal/55">{m.user.email}</p></div><Badge>{m.role}</Badge></Card>)}</div></div>;
}
