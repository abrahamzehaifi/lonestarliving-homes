"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  leadId: string;
  currentStage: string | null;
};

function toLocalDateTime(daysFromNow: number) {
  const date = new Date();

  date.setDate(date.getDate() + daysFromNow);
  date.setHours(9, 0, 0, 0);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function LeadQuickActions({
  leadId,
  currentStage,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function postJson(url: string, body: Record<string, unknown>) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        typeof data?.error === "string" ? data.error : "Request failed."
      );
    }

    return data;
  }

  function refreshWithMessage(message: string) {
    setSuccess(message);

    startTransition(() => {
      router.refresh();
    });
  }

  async function handleFollowUp(daysFromNow: number) {
    setError("");
    setSuccess("");

    try {
      await postJson("/api/crm/follow-up", {
        id: leadId,
        next_follow_up_at:
          daysFromNow === -1 ? null : toLocalDateTime(daysFromNow),
      });

      if (daysFromNow === -1) {
        refreshWithMessage("Follow-up cleared.");
      } else if (daysFromNow === 0) {
        refreshWithMessage("Follow-up set for today.");
      } else {
        refreshWithMessage("Follow-up set for tomorrow.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update follow-up."
      );
    }
  }

  async function handleStage(
    stage:
      | "contacted"
      | "conversation"
      | "appointment_set"
      | "lost"
      | "nurture"
  ) {
    if (currentStage === stage) {
      setError("");
      setSuccess(`Already marked ${stage.replace(/_/g, " ")}.`);
      return;
    }

    setError("");
    setSuccess("");

    try {
      await postJson("/api/crm/stage", {
        id: leadId,
        stage,
      });

      refreshWithMessage(`Marked ${stage.replace(/_/g, " ")}.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update stage."
      );
    }
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => void handleFollowUp(0)}
          className="inline-flex h-8 items-center justify-center rounded-full border border-black/10 bg-white px-3 text-xs font-medium text-neutral-900 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Today
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => void handleFollowUp(1)}
          className="inline-flex h-8 items-center justify-center rounded-full border border-black/10 bg-white px-3 text-xs font-medium text-neutral-900 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Tomorrow
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => void handleFollowUp(-1)}
          className="inline-flex h-8 items-center justify-center rounded-full border border-black/10 bg-white px-3 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Clear Follow-Up
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => void handleStage("contacted")}
          className="inline-flex h-8 items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-3 text-xs font-medium text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Contacted
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => void handleStage("conversation")}
          className="inline-flex h-8 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-3 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Conversation
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => void handleStage("appointment_set")}
          className="inline-flex h-8 items-center justify-center rounded-full border border-violet-200 bg-violet-50 px-3 text-xs font-medium text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Appointment Set
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => void handleStage("nurture")}
          className="inline-flex h-8 items-center justify-center rounded-full border border-sky-200 bg-sky-50 px-3 text-xs font-medium text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Nurture
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => void handleStage("lost")}
          className="inline-flex h-8 items-center justify-center rounded-full border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Mark Lost
        </button>
      </div>

      <div className="min-h-[20px] text-xs">
        {isPending ? (
          <span className="text-neutral-500">Updating...</span>
        ) : success ? (
          <span className="text-emerald-600">{success}</span>
        ) : error ? (
          <span className="text-red-600">{error}</span>
        ) : null}
      </div>
    </div>
  );
}