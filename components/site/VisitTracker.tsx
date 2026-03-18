"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function VisitTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    const key = `visit:${path}`;

    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(key)) return;

    sessionStorage.setItem(key, "1");

    fetch("/api/visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path,
        referrer: document.referrer || null,
        visitSource: "website",
        lang: searchParams.get("lang") || "en",
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      // fail silently
    });
  }, [pathname, searchParams]);

  return null;
}