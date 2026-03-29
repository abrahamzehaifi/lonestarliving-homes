"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  leadId: string;
  closedAt: string | null;
  commissionEstimate: number | null;
  commissionActual: number | null;
  outcomeNotes: string | null;
};

function toDatetimeLocalValue(value: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function LeadOutcomeFields({
  leadId,
  closedAt,
  commissionEstimate,
  commissionActual,
  outcomeNotes,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [closedAtValue, setClosedAtValue] = useState(
    toDatetimeLocalValue(closedAt)
  );
  const [commissionEstimateValue, setCommissionEstimateValue] = useState(
    commissionEstimate?.toString() ?? ""
  );
  const [commissionActualValue, setCommissionActualValue] = useState(
    commissionActual?.toString() ?? ""
  );
  const [outcomeNotesValue, setOutcomeNotesValue] = useState(
    outcomeNotes ?? ""
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setClosedAtValue(toDatetimeLocalValue(closedAt));
    setCommissionEstimateValue(commissionEstimate?.toString() ?? "");
    setCommissionActualValue(commissionActual?.toString() ?? "");
    setOutcomeNotesValue(outcomeNotes ?? "");
  }, [closedAt, commissionEstimate, commissionActual, outcomeNotes]);

  useEffect(() => {
    if (!success) return;

    const timeout = window.setTimeout(() => {
      setSuccess("");
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [success]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isPending) return;

    setError("");
    setSuccess("");

    const payload = {
      id: leadId,
      closed_at: closedAtValue ? new Date(closedAtValue).toISOString() : null,
      commission_estimate:
        commissionEstimateValue.trim() === ""
          ? null
          : Number(commissionEstimateValue),
      commission_actual:
        commissionActualValue.trim() === ""
          ? null
          : Number(commissionActualValue),
      outcome_notes: outcomeNotesValue.trim() || null,
    };

    if (
      payload.commission_estimate !== null &&
      !Number.isFinite(payload.commission_estimate)
    ) {
      setError("Commission estimate must be a valid number.");
      return;
    }

    if (
      payload.commission_actual !== null &&
      !Number.isFinite(payload.commission_actual)
    ) {
      setError("Commission actual must be a valid number.");
      return;
    }

    try {
      const res = await fetch("/api/lead-outcome", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof data?.error === "string"
            ? data.error
            : "Failed to save outcome fields."
        );
        return;
      }

      setSuccess("Outcome updated.");

      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Network error while saving outcome fields.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-4">
        <div className="text-sm font-medium text-neutral-500">Closed At</div>
        <input
          type="datetime-local"
          value={closedAtValue}
          onChange={(e) => setClosedAtValue(e.target.value)}
          disabled={isPending}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-black/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-4">
        <div className="text-sm font-medium text-neutral-500">
          Commission Estimate
        </div>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          value={commissionEstimateValue}
          onChange={(e) => setCommissionEstimateValue(e.target.value)}
          disabled={isPending}
          placeholder="e.g. 1250"
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-4">
        <div className="text-sm font-medium text-neutral-500">
          Commission Actual
        </div>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          value={commissionActualValue}
          onChange={(e) => setCommissionActualValue(e.target.value)}
          disabled={isPending}
          placeholder="e.g. 1410"
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-4">
        <div className="text-sm font-medium text-neutral-500">Outcome Notes</div>
        <textarea
          value={outcomeNotesValue}
          onChange={(e) => setOutcomeNotesValue(e.target.value)}
          disabled={isPending}
          rows={5}
          placeholder="Add closing notes, payout details, referral notes, issues, or lessons learned..."
          className="w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save outcome"}
        </button>

        {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </form>
  );
}