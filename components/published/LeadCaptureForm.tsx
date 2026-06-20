"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

export function LeadCaptureForm({ websiteId, placeholder = "email@brand.com" }: { websiteId: string; placeholder?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();
  const visitorId = useMemo(() => {
    if (typeof window === "undefined") return "server";
    const key = "aurelia_visitor_id";
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const value = crypto.randomUUID();
    localStorage.setItem(key, value);
    return value;
  }, []);

  useEffect(() => {
    fetch(`/api/websites/${websiteId}/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "page_view", path: window.location.pathname, referrer: document.referrer, visitorId })
    }).catch(() => {});
  }, [websiteId, visitorId]);

  async function submit() {
    setStatus("Submitting…");
    const res = await fetch(`/api/websites/${websiteId}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: email.split("@")[0] || "Website Lead", email, source: "Published site", metadata: { visitorId } })
    });
    if (!res.ok) {
      setStatus("Please enter a valid email.");
      return;
    }
    await fetch(`/api/websites/${websiteId}/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "lead_submit", path: window.location.pathname, visitorId })
    }).catch(() => {});
    setEmail("");
    setStatus("Thank you — we’ll be in touch.");
  }

  return <form action={() => startTransition(submit)} className="mt-8 flex flex-col gap-3 md:flex-row"><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="min-w-0 flex-1 rounded-full px-5 py-3 text-black" placeholder={placeholder}/><button disabled={pending} className="rounded-full bg-[#D4AF37] px-6 py-3 font-bold disabled:opacity-60">{pending ? "Sending…" : "Submit"}</button>{status && <p className="md:self-center text-sm text-white/70">{status}</p>}</form>;
}
