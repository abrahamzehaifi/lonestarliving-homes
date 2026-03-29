"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  leadId: string;
  showingAt: string | null;
};

function toLocalInputValue(value: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);

  return local.toISOString().slice(0, 16);
}

export default function LeadShowing({ leadId, showingAt }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(toLocalInputValue(showingAt));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const hasChanged = value !== toLocalInputValue(showingAt);

  useEffect(() => {
    setValue(toLocalInputValue(showingAt));
  }, [showingAt]);

  useEffect(() => {
    if (!success) return;
    const timeout = setTimeout(() => setSuccess(""), 2000);
    return () => clearTimeout(timeout);
  }, [success]);

  function saveShowing(nextValue: string | null) {
    if (isPending) return;

    const normalizedNext = nextValue ?? "";

    if (!hasChanged) {
      setError("");
      setSuccess("No changes to save.");
      return;
    }

    setError("");
    setSuccess("");

    startTransition(() => {
      void (async () => {
        try {
          const res = await fetch("/api/lead-showing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: leadId,
              showingAt: normalizedNext || null,
            }),
          });

          const data = await res.json().catch(() => ({}));

          if (!res.ok) {
            setError(data?.error || "Failed to update showing.");
            return;
          }

          setSuccess(
            normalizedNext ? "Showing scheduled." : "Showing cleared."
          );

          router.refresh();
        } catch {
          setError("Network error while updating showing.");
        }
      })();
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="datetime-local"
          value={value}
          disabled={isPending}
          onChange={(e) => setValue(e.target.value)}
          className="min-w-[240px] rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-neutral-900"
        />

        <button
          type="button"
          disabled={isPending || !hasChanged}
          onClick={() => saveShowing(value || null)}
          className="rounded-full bg-neutral-950 px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          disabled={isPending || !value}
          onClick={() => {
            setValue("");
            saveShowing(null);
          }}
          className="rounded-full border px-4 py-2 text-sm disabled:opacity-60"
        >
          Clear
        </button>
      </div>

      {success && <p className="text-xs text-emerald-600">{success}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}