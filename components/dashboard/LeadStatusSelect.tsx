"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  leadId: string;
  currentStatus: string | null;
};

const OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "showing", label: "Showing" },
  { value: "application", label: "Application" },
  { value: "closed", label: "Closed" },
  { value: "lost", label: "Lost" },
] as const;

const VALID_STATUSES = new Set(OPTIONS.map((option) => option.value));

function normalizeStatus(status: string | null | undefined) {
  if (!status) return "new";
  return VALID_STATUSES.has(status as (typeof OPTIONS)[number]["value"])
    ? status
    : "new";
}

function getStatusClasses(status: string) {
  switch (status) {
    case "new":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "contacted":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "qualified":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "showing":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "application":
      return "border-orange-200 bg-orange-50 text-orange-700";
    case "closed":
      return "border-green-200 bg-green-50 text-green-700";
    case "lost":
      return "border-neutral-200 bg-neutral-100 text-neutral-600";
    default:
      return "border-neutral-300 bg-white text-neutral-900";
  }
}

export default function LeadStatusSelect({
  leadId,
  currentStatus,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const normalizedCurrentStatus = normalizeStatus(currentStatus);

  const [status, setStatus] = useState(normalizedCurrentStatus);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setStatus(normalizedCurrentStatus);
  }, [normalizedCurrentStatus]);

  useEffect(() => {
    if (!success) return;

    const timeout = window.setTimeout(() => {
      setSuccess("");
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [success]);

  async function updateStatus(nextStatus: string) {
    if (isPending) return;

    const safeNextStatus = normalizeStatus(nextStatus);

    if (safeNextStatus === normalizedCurrentStatus) {
      setStatus(safeNextStatus);
      setError("");
      setSuccess("No changes to save.");
      return;
    }

    setError("");
    setSuccess("");
    setStatus(safeNextStatus);

    try {
      const res = await fetch("/api/lead-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: leadId,
          status: safeNextStatus,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof data?.error === "string"
            ? data.error
            : "Failed to update status."
        );
        setStatus(normalizedCurrentStatus);
        return;
      }

      setSuccess("Status updated.");

      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Network error while updating status.");
      setStatus(normalizedCurrentStatus);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <select
          aria-label="Update lead status"
          value={status}
          disabled={isPending}
          onChange={(e) => void updateStatus(e.target.value)}
          className={`min-w-[180px] rounded-xl border px-3 py-2 text-sm font-medium transition outline-none disabled:cursor-not-allowed disabled:opacity-60 ${getStatusClasses(
            status
          )}`}
        >
          {OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="min-h-[20px] text-xs">
          {isPending ? (
            <span className="text-neutral-500">Saving…</span>
          ) : success ? (
            <span className="text-emerald-600">{success}</span>
          ) : null}
        </div>
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}