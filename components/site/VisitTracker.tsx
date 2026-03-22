"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only track high-value pages
    const trackablePaths = [
      "/intake",
      "/buy",
      "/sell",
      "/rent",
      "/landlords",
    ];

    if (!trackablePaths.some((p) => pathname.startsWith(p))) {
      return;
    }

    const key = `visit:${pathname}`;

    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    fetch("/api/visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: pathname, // no query string
        visitSource: "website",
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      // silent fail
    });
  }, [pathname]);

  return null;
}