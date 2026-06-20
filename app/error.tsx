"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="grid min-h-screen place-items-center bg-cream px-4"><Card className="max-w-2xl p-8 text-center"><p className="text-xs font-black uppercase tracking-[.22em] text-[#8a6818]">Something needs attention</p><h1 className="mt-3 font-serif text-5xl font-black tracking-[-.05em]">The workspace could not load.</h1><p className="mt-4 leading-7 text-charcoal/60">This usually means a production environment variable is missing, the database schema has not been pushed, or a connected service is unavailable.</p>{error.digest && <p className="mt-3 rounded-2xl bg-white/70 p-3 text-xs text-charcoal/45">Digest: {error.digest}</p>}<div className="mt-6 flex flex-wrap justify-center gap-3"><Button variant="gold" onClick={reset}>Try again</Button><ButtonLink href="/" variant="light">Back home</ButtonLink></div></Card></main>;
}
