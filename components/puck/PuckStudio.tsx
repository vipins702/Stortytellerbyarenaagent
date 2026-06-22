"use client";

import { Puck, type Data } from "@measured/puck";
import "@measured/puck/puck.css";
import { useState, useTransition } from "react";
import { puckConfig } from "@/components/puck/puck-config";
import { puckDataToSections, sectionsToPuckData } from "@/components/puck/puck-mappers";

export function PuckStudio({ page, website }: { page: { id: string; sections: any[] }; website: { id: string; name: string } }) {
  const [data, setData] = useState<Data>(() => sectionsToPuckData(page.sections));
  const [status, setStatus] = useState("Ready");
  const [pending, startTransition] = useTransition();

  async function save(nextData: Data) {
    setStatus("Saving Puck page…");
    setData(nextData);
    const sections = puckDataToSections(nextData);
    const res = await fetch(`/api/pages/${page.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sections }) });
    const json = await res.json().catch(() => ({}));
    setStatus(res.ok ? "Saved to database" : json.error || "Save failed");
  }

  return <div className="min-h-screen bg-[#05050A] text-white"><div className="border-b border-white/10 bg-black/50 px-5 py-3 backdrop-blur-xl"><div className="mx-auto flex max-w-[1760px] items-center justify-between"><div><b>Puck Studio</b><p className="text-xs text-white/45">{website.name} · {status}</p></div><div className="flex gap-2"><button onClick={() => window.open(`/preview/${website.id}`, "_blank")} className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold">Preview</button><button disabled={pending} onClick={() => startTransition(() => save(data))} className="rounded-full bg-gradient-to-r from-violet to-cyan px-4 py-2 text-sm font-black">Save</button></div></div></div><div className="puck-dark-shell"><Puck config={puckConfig} data={data} onPublish={save} onChange={setData} /></div><style jsx global>{`
    .puck-dark-shell { color: #0f172a; }
    .puck-dark-shell [class*="Puck"] { font-family: var(--font-display), Inter, system-ui, sans-serif; }
  `}</style></div>;
}
