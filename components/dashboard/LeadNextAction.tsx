"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  leadId: string;
  nextAction: string | null;
};

export default function LeadNextAction({ leadId, nextAction }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(nextAction ?? "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setValue(nextAction ?? "");
  }, [nextAction]);

  useEffect(() => {
    if (!success) return;

    const timeout = window.setTimeout(() => {
      setSuccess("");
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [success]);

  async function handleSave() {
    if (isPending) return;

    const trimmed = value.trim();
    const current = (nextAction ?? "").trim();

    if (trimmed === current) {
      setError("");
      setSuccess("No changes to save.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/lead-next-action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: leadId,
          nextAction: trimmed || null,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(
          typeof data?.error === "string"
            ? data.error
            : "Failed to update next action."
        );
        return;
      }

      setSuccess("Next action updated.");

      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Network error while updating next action.");
    }
  }

  return (
    <div className="space-y-3">
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (error) setError("");
          if (success) setSuccess("");
        }}
        rows={4}
        disabled={isPending}
        placeholder="Example: Call today at 4pm, send 3 Medical Center options, confirm tour Saturday."
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black/20 disabled:cursor-not-allowed disabled:opacity-60"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() => void handleSave()}
          className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save next action"}
        </button>

        {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}