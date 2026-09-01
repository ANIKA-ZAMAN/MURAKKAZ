"use client";

import React, { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Client-side Unique Identifier Generator
function getOrCreateId(storage: Storage, key: string, prefix: string): string {
  try {
    let id = storage.getItem(key);
    if (!id) {
      id = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      storage.setItem(key, id);
    }
    return id;
  } catch {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

export function getAnalyticsSession() {
  if (typeof window === "undefined") {
    return { visitorId: "", sessionId: "" };
  }
  const visitorId = getOrCreateId(localStorage, "mrk_visitor_id", "vid");
  const sessionId = getOrCreateId(sessionStorage, "mrk_session_id", "sid");
  return { visitorId, sessionId };
}

export function trackAnalyticsEvent(eventName: string, metadata: any = {}) {
  if (typeof window === "undefined") return;

  const { sessionId } = getAnalyticsSession();
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

  const payload = {
    sessionId,
    eventName,
    productSlug: metadata.productSlug || metadata.slug || null,
    metadata
  };

  const endpoint = `${apiBase}/analytics/event`;

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([JSON.stringify(payload)], { type: "application/json" }));
    } else {
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {});
    }
  } catch {
    // Non-blocking fail-safe
  }
}

function AnalyticsTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageEnterTime = useRef<number>(Date.now());
  const lastPath = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const { visitorId, sessionId } = getAnalyticsSession();
    const fullPath = searchParams && searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    
    // Calculate time on previous page if navigating
    const now = Date.now();
    const timeSpentPrev = Math.max(0, Math.round((now - pageEnterTime.current) / 1000));
    pageEnterTime.current = now;

    // Detect product slug if on /product/[id]
    let productSlug: string | undefined = undefined;
    if (pathname.startsWith("/product/")) {
      productSlug = pathname.replace("/product/", "").split("/")[0];
    }

    const payload = {
      sessionId,
      visitorId,
      url: window.location.href,
      path: fullPath,
      title: document.title || "Murakkaz Fragrances",
      productSlug,
      referrer: document.referrer || undefined,
      utmSource: searchParams?.get("utm_source") || undefined,
      utmMedium: searchParams?.get("utm_medium") || undefined,
      utmCampaign: searchParams?.get("utm_campaign") || undefined,
      timeOnPage: lastPath.current ? timeSpentPrev : 0
    };

    lastPath.current = fullPath;

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
    const endpoint = `${apiBase}/analytics/collect`;

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(endpoint, new Blob([JSON.stringify(payload)], { type: "application/json" }));
      } else {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(() => {});
      }
    } catch {
      // Ignore network hiccups
    }
  }, [pathname, searchParams]);

  return null;
}

export default function AnalyticsProvider({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTrackerInner />
      </Suspense>
      {children}
    </>
  );
}
