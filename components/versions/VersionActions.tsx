"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/Button";

export function RestoreVersionButton({ versionId }: { versionId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  async function restore() {
    if (!confirm("Restore this published version? Current draft page sections will be updated.")) return;
    const res = await fetch(`/api/versions/${versionId}/restore`, { method: "POST" });
    if (!res.ok) alert((await res.json()).error || "Restore failed");
    router.refresh();
  }
  return <Button variant="light" className="px-3 py-2" disabled={pending} onClick={() => startTransition(restore)}>{pending ? "Restoring…" : "Restore"}</Button>;
}
