"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function VisitTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

    const search = searchParams.toString();
    const sessionKey = `visit:${pathname}${search ? `?${search}` : ""}`;

    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, "1");

    const lang = searchParams.get("lang") || "en";

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
      query: search || null,
      intent: getIntent(pathname),
      lang,
      visitSource: "website",
      timestamp: new Date().toISOString(),
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/visit", blob);
    } else {
      fetch("/api/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname, searchParams]);

  return null;
}