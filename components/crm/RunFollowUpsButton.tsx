"use client";

import { useState } from "react";

type Result =
  | null
  | {
      ok: boolean;
      dueCount?: number;
      highPriorityCount?: number;
      error?: string;
    };

export default function RunFollowUpsButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);

  async function handleRun() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/crm/follow-ups/process", {
        method: "POST",
      });

      const data = await res.json();

      setResult({
        ok: Boolean(data?.ok),
        dueCount: typeof data?.dueCount === "number" ? data.dueCount : 0,
        highPriorityCount:
          typeof data?.highPriorityCount === "number"
            ? data.highPriorityCount
            : 0,
        error: typeof data?.error === "string" ? data.error : undefined,
      });
    } catch {
      setResult({
        ok: false,
        error: "Request failed.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleRun}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Running..." : "Run Follow-Ups"}
        </button>

        {result ? (
          <p className="text-sm text-neutral-600">
            {result.ok
              ? `Done. ${result.dueCount ?? 0} due follow-up(s), ${result.highPriorityCount ?? 0} high priority.`
              : result.error || "Something went wrong."}
          </p>
        ) : (
          <p className="text-sm text-neutral-500">
            Sends a Telegram summary and logs due follow-ups.
          </p>
        )}
      </div>
    </div>
  );
}