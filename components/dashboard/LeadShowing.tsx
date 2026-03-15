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

  const pad = (n: number) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function LeadShowing({ leadId, showingAt }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(toLocalInputValue(showingAt));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setValue(toLocalInputValue(showingAt));
  }, [showingAt]);

  useEffect(() => {
    if (!success) return;

    const timeout = window.setTimeout(() => {
      setSuccess("");
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [success]);

  async function saveShowing(nextValue: string | null) {
    if (isPending) return;

    const current = toLocalInputValue(showingAt);
    const normalizedNext = nextValue ?? "";

    if (normalizedNext === current) {
      setError("");
      setSuccess("No changes to save.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/lead-showing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: leadId,
          showingAt: normalizedNext || null,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof data?.error === "string"
            ? data.error
            : "Failed to update showing."
        );
        return;
      }

      setSuccess(normalizedNext ? "Showing scheduled." : "Showing cleared.");

      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Network error while updating showing.");
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="datetime-local"
          value={value}
          disabled={isPending}
          onChange={(e) => setValue(e.target.value)}
          className="min-w-[240px] rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-black/20 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          disabled={isPending}
          onClick={() => void saveShowing(value || null)}
          className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          disabled={isPending || !value}
          onClick={() => {
            setValue("");
            void saveShowing(null);
          }}
          className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 px-4 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Clear
        </button>
      </div>

      {success ? <p className="text-xs text-emerald-600">{success}</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}