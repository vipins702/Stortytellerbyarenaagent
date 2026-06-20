"use client";

import { useEffect } from "react";

export function ABTracker({ websiteId, testId, variantId }: { websiteId: string; testId?: string; variantId?: string }) {
  useEffect(() => {
    if (!testId || !variantId) return;
    fetch(`/api/websites/${websiteId}/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "ab_view", path: window.location.pathname, visitorId: localStorage.getItem("aurelia_visitor_id") || undefined, metadata: { testId, variantId } })
    }).catch(() => {});
  }, [websiteId, testId, variantId]);
  return null;
}
