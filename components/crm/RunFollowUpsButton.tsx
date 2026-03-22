"use client";

import { useState } from "react";

export default function RunFollowUpsButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function run() {
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/followups/run", {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        setMsg(`Processed ${data.processed} leads`);
      } else {
        setMsg("Error running follow-ups");
      }
    } catch {
      setMsg("Network error");
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={run}
        disabled={loading}
        className="rounded-xl bg-black px-4 py-2 text-white"
      >
        {loading ? "Running..." : "Run Follow-Ups"}
      </button>

      {msg && <p className="text-sm text-neutral-600">{msg}</p>}
    </div>
  );
}