"use client";

import { useState, useTransition } from "react";
import { updateLeadStatus } from "@/app/ops/leads/actions";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "showing", label: "Showing" },
  { value: "application", label: "Application" },
  { value: "closed", label: "Closed" },
  { value: "lost", label: "Lost" },
] as const;

function normalizeStatus(value?: string | null) {
  const status = String(value || "").trim().toLowerCase();
  return STATUS_OPTIONS.some((option) => option.value === status) ? status : "new";
}

function getStatusClass(status: string) {
  switch (status) {
    case "new":
      return "border-slate-200 bg-slate-50 text-slate-700";
    case "contacted":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "qualified":
      return "border-blue-200 bg-blue-50 text-blue-800";
    case "showing":
      return "border-violet-200 bg-violet-50 text-violet-800";
    case "application":
      return "border-cyan-200 bg-cyan-50 text-cyan-800";
    case "closed":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "lost":
      return "border-neutral-200 bg-neutral-100 text-neutral-700";
    default:
      return "border-black/10 bg-white text-neutral-800";
  }
}

type Props = {
  leadId: string;
  initialStatus?: string | null;
};

export default function LeadStatusInline({
  leadId,
  initialStatus,
}: Props) {
  const [status, setStatus] = useState(normalizeStatus(initialStatus));
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleChange(nextStatus: string) {
    const previous = status;
    setStatus(nextStatus);
    setSaved(false);
    setError("");

    startTransition(() => {
      void (async () => {
        const result = await updateLeadStatus(leadId, nextStatus);

        if (!result.ok) {
          setStatus(previous);
          setError(result.error || "Failed to save");
          return;
        }

        setSaved(true);
        window.setTimeout(() => setSaved(false), 1200);
      })();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        className={`h-9 rounded-full border px-3 text-xs font-medium outline-none transition disabled:cursor-not-allowed disabled:opacity-60 ${getStatusClass(
          status
        )}`}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <span className="min-w-[52px] text-xs text-neutral-500">
        {isPending ? "Saving" : saved ? "Saved" : error ? "Error" : ""}
      </span>
    </div>
  );
}