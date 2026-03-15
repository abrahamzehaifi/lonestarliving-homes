"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type LeadNote = {
  id: string;
  note: string;
  created_at: string;
  updated_at: string;
};

type Props = {
  leadId: string;
  notes: LeadNote[];
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function timeAgo(value: string) {
  try {
    const diffMs = Date.now() - new Date(value).getTime();

    if (Number.isNaN(diffMs) || diffMs < 0) return "";

    const seconds = Math.floor(diffMs / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count > 0) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  } catch {
    return "";
  }
}

export default function LeadNotes({ leadId, notes }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = note.trim();

    if (!trimmed) {
      setError("Enter a note before saving.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/lead-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadId,
          note: trimmed,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof data?.error === "string" ? data.error : "Failed to save note."
        );
        return;
      }

      setNote("");
      setSuccess("Note saved.");

      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Network error while saving note.");
    }
  }

  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
          Lead notes
        </h2>
        <p className="mt-2 text-sm leading-7 text-neutral-600">
          Internal notes for follow-up, context, objections, and next steps.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <label htmlFor="lead-note" className="sr-only">
          Add note
        </label>

        <textarea
          id="lead-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={5}
          placeholder="Add internal note..."
          disabled={isPending}
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black/20 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save note"}
          </button>

          {success ? (
            <p className="text-sm text-emerald-600">{success}</p>
          ) : null}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      </form>

      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 bg-neutral-50 p-5 text-sm text-neutral-600">
            No notes yet.
          </div>
        ) : (
          notes.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-black/5 bg-neutral-50 p-5"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                <span>{formatDate(item.created_at)}</span>
                <span>•</span>
                <span>{timeAgo(item.created_at)}</span>
              </div>

              <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-neutral-900">
                {item.note}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}