"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
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

    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get("lang") || "en";

    function getIntent(path: string) {
      if (path.startsWith("/rent")) return "rent";
      if (path.startsWith("/buy")) return "buy";
      if (path.startsWith("/sell")) return "sell";
      if (path.startsWith("/landlords")) return "landlord";
      if (path.startsWith("/intake")) return "intake";
      return "other";
    }

    const payload = JSON.stringify({
      path: pathname,
      intent: getIntent(pathname),
      lang,
      visitSource: "website",
      timestamp: new Date().toISOString(),
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/visit", payload);
    } else {
      fetch("/api/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}