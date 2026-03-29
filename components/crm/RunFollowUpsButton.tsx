"use client";

import { useState } from "react";

export default function RunFollowUpsButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function run() {
    if (loading) return;

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/followups/run", {
        method: "POST",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMsg(data?.error || "Error running follow-ups");
        return;
      }

      setMsg(`Processed ${data?.processed ?? 0} leads`);
    } catch {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={run}
        disabled={loading}
        className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-60"
      >
        {loading ? "Running..." : "Run Follow-Ups"}
      </button>

      {msg ? <p className="text-sm text-neutral-600">{msg}</p> : null}
    </div>
  );
}