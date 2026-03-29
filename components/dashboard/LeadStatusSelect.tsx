"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  leadId: string;
  currentStage: string | null;
};

const OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "conversation", label: "Conversation" },
  { value: "appointment_set", label: "Appointment Set" },
  { value: "appointment_done", label: "Appointment Done" },
  { value: "follow_up", label: "Follow-Up" },
  { value: "listing_signed", label: "Listing Signed" },
  { value: "closed", label: "Closed" },
  { value: "lost", label: "Lost" },
  { value: "nurture", label: "Nurture" },
] as const;

const VALID_STAGES = new Set(OPTIONS.map((option) => option.value));

function normalizeStage(stage: string | null | undefined) {
  if (!stage) return "new";
  return VALID_STAGES.has(stage as (typeof OPTIONS)[number]["value"])
    ? stage
    : "new";
}

function getStageClasses(stage: string) {
  switch (stage) {
    case "new":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "contacted":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "conversation":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "appointment_set":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "appointment_done":
      return "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700";
    case "follow_up":
      return "border-orange-200 bg-orange-50 text-orange-700";
    case "listing_signed":
      return "border-cyan-200 bg-cyan-50 text-cyan-700";
    case "closed":
      return "border-green-200 bg-green-50 text-green-700";
    case "lost":
      return "border-neutral-200 bg-neutral-100 text-neutral-600";
    case "nurture":
      return "border-stone-200 bg-stone-50 text-stone-700";
    default:
      return "border-neutral-300 bg-white text-neutral-900";
  }
}

export default function LeadStatusSelect({
  leadId,
  currentStage,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const normalizedCurrentStage = normalizeStage(currentStage);

  const [stage, setStage] = useState(normalizedCurrentStage);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setStage(normalizedCurrentStage);
  }, [normalizedCurrentStage]);

  useEffect(() => {
    if (!success) return;

    const timeout = window.setTimeout(() => {
      setSuccess("");
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [success]);

  async function updateStage(nextStage: string) {
    if (isPending) return;

    const safeNextStage = normalizeStage(nextStage);

    if (safeNextStage === normalizedCurrentStage) {
      setStage(safeNextStage);
      setError("");
      setSuccess("No changes to save.");
      return;
    }

    setError("");
    setSuccess("");
    setStage(safeNextStage);

    try {
      const res = await fetch("/api/crm/update-stage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: leadId,
          stage: safeNextStage,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof data?.error === "string"
            ? data.error
            : "Failed to update stage."
        );
        setStage(normalizedCurrentStage);
        return;
      }

      setSuccess("Stage updated.");

      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Network error while updating stage.");
      setStage(normalizedCurrentStage);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <select
          aria-label="Update lead stage"
          value={stage}
          disabled={isPending}
          onChange={(e) => void updateStage(e.target.value)}
          className={`min-w-[180px] rounded-xl border px-3 py-2 text-sm font-medium transition outline-none disabled:cursor-not-allowed disabled:opacity-60 ${getStageClasses(
            stage
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