"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Badge, Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Job = { id: string; type: string; prompt: string; status: string; currentStep?: string | null; error?: string | null; createdAt: string; steps: any[]; assets: any[] };

export function GenerationHistoryPage({ jobs }: { jobs: Job[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function retryJob(jobId: string) {
    const res = await fetch(`/api/generation-jobs/${jobId}/retry`, { method: "POST" });
    const json = await res.json();
    if (!res.ok) alert(json.error || "Retry failed");
    router.refresh();
  }

  async function retryStep(jobId: string, stepName: string) {
    const res = await fetch(`/api/generation-jobs/${jobId}/steps/${encodeURIComponent(stepName)}/retry`, { method: "POST" });
    const json = await res.json();
    if (!res.ok) alert(json.error || "Step retry failed");
    router.refresh();
  }

  return <div><div className="mb-6"><p className="text-xs font-black uppercase tracking-[.22em] text-[#8a6818]">Generation history</p><h1 className="mt-3 font-serif text-5xl font-black tracking-[-.05em]">Checkpoints and retries</h1><p className="mt-2 max-w-2xl text-charcoal/60">Review website and image generation jobs, inspect step progress, reuse linked assets and retry only the failed step when possible.</p></div><div className="grid gap-5">{jobs.map((job) => <Card key={job.id} className="p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><Badge>{job.status}</Badge><h2 className="mt-3 text-xl font-black">{job.type} generation</h2><p className="mt-1 max-w-3xl text-sm text-charcoal/60">{job.prompt}</p><p className="mt-2 text-xs text-charcoal/40">{new Date(job.createdAt).toLocaleString()} · {job.steps.length} steps · {job.assets.length} assets</p>{job.error && <p className="mt-2 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{job.error}</p>}</div>{job.status === "Failed" && <Button disabled={pending} variant="dark" onClick={() => startTransition(() => retryJob(job.id))}>Retry job</Button>}</div><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{job.steps.map((step) => <div key={step.id} className="rounded-2xl border border-black/10 bg-white/70 p-4"><div className="flex items-center justify-between gap-3"><b className="text-sm">{step.name}</b><span className={`rounded-full px-2 py-1 text-[10px] font-black ${step.status === "Completed" ? "bg-green-100 text-green-700" : step.status === "Failed" ? "bg-red-100 text-red-700" : "bg-gold/20 text-[#765813]"}`}>{step.status}</span></div>{step.error && <p className="mt-2 text-xs text-red-700">{step.error}</p>}{step.status === "Failed" && <button disabled={pending} onClick={() => startTransition(() => retryStep(job.id, step.name))} className="mt-3 rounded-full border border-black/10 px-3 py-1 text-xs font-bold">Retry this step</button>}</div>)}</div>{job.assets.length > 0 && <div className="mt-5 grid gap-3 md:grid-cols-4">{job.assets.map((item: any) => <a key={item.id} href={item.asset.url} target="_blank" className="overflow-hidden rounded-2xl border border-black/10 bg-white/70"><div className="h-24 bg-black/5">{item.asset.type.startsWith("image/") ? <img src={item.asset.url} alt={item.asset.filename} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center">◈</div>}</div><p className="truncate p-2 text-xs font-bold">{item.asset.filename}</p></a>)}</div>}</Card>)}{!jobs.length && <Card className="p-10 text-center text-charcoal/60">No generation jobs yet. Start a site or image generation from the builder.</Card>}</div></div>;
}
