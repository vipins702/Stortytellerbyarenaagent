"use client";

import { useEffect, useState } from "react";

type Variant = { id: string; name: string; weight: number };

function chooseVariant(variants: Variant[], seed: string) {
  const total = variants.reduce((sum, variant) => sum + Math.max(0, variant.weight), 0) || variants.length;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  let point = hash % total;
  for (const variant of variants) {
    point -= Math.max(0, variant.weight) || 1;
    if (point < 0) return variant.id;
  }
  return variants[0]?.id;
}

export function ABVariantGate({ websiteId, testId, variants }: { websiteId: string; testId?: string; variants: Variant[] }) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!testId || !variants.length) return;
    const visitorKey = "aurelia_visitor_id";
    let visitorId = localStorage.getItem(visitorKey);
    if (!visitorId) { visitorId = crypto.randomUUID(); localStorage.setItem(visitorKey, visitorId); }
    const assignmentKey = `ab:${testId}`;
    let variantId = localStorage.getItem(assignmentKey);
    if (!variantId || !variants.some((v) => v.id === variantId)) {
      variantId = chooseVariant(variants, `${visitorId}:${testId}`) || variants[0].id;
      localStorage.setItem(assignmentKey, variantId);
      document.cookie = `${assignmentKey}=${variantId}; path=/; max-age=2592000; SameSite=Lax`;
    }
    setActive(variantId);
    document.documentElement.dataset.abVariant = variantId;
    fetch(`/api/websites/${websiteId}/analytics`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "ab_assigned", path: window.location.pathname, visitorId, metadata: { testId, variantId } }) }).catch(() => {});
  }, [websiteId, testId, variants]);
  return <script dangerouslySetInnerHTML={{ __html: active ? `document.documentElement.dataset.abVariant=${JSON.stringify(active)}` : "" }} />;
}
