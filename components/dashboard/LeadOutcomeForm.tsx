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

function normalizeMoneyInput(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const num = Number(trimmed);
  return Number.isFinite(num) ? num : NaN;
}

export default function LeadOutcomeForm({
  leadId,
  closedAt,
  commissionEstimate,
  commissionActual,
  outcomeNotes,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [closedAtValue, setClosedAtValue] = useState(toLocalInputValue(closedAt));
  const [commissionEstimateValue, setCommissionEstimateValue] = useState(
    commissionEstimate != null ? String(commissionEstimate) : ""
  );
  const [commissionActualValue, setCommissionActualValue] = useState(
    commissionActual != null ? String(commissionActual) : ""
  );
  const [outcomeNotesValue, setOutcomeNotesValue] = useState(outcomeNotes ?? "");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setClosedAtValue(toLocalInputValue(closedAt));
  }, [closedAt]);

  useEffect(() => {
    setCommissionEstimateValue(
      commissionEstimate != null ? String(commissionEstimate) : ""
    );
  }, [commissionEstimate]);

  useEffect(() => {
    setCommissionActualValue(
      commissionActual != null ? String(commissionActual) : ""
    );
  }, [commissionActual]);

  useEffect(() => {
    setOutcomeNotesValue(outcomeNotes ?? "");
  }, [outcomeNotes]);

  useEffect(() => {
    if (!success) return;

    const timeout = window.setTimeout(() => {
      setSuccess("");
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [success]);

  async function handleSave() {
    if (isPending) return;

    const estimate = normalizeMoneyInput(commissionEstimateValue);
    const actual = normalizeMoneyInput(commissionActualValue);

    if (Number.isNaN(estimate)) {
      setError("Commission estimate must be a valid number.");
      setSuccess("");
      return;
    }

    if (Number.isNaN(actual)) {
      setError("Commission actual must be a valid number.");
      setSuccess("");
      return;
    }

    const trimmedOutcomeNotes = outcomeNotesValue.trim();

    const currentClosedAt = toLocalInputValue(closedAt);
    const currentEstimate =
      commissionEstimate != null ? String(commissionEstimate) : "";
    const currentActual =
      commissionActual != null ? String(commissionActual) : "";
    const currentOutcomeNotes = outcomeNotes ?? "";

    if (
      closedAtValue === currentClosedAt &&
      commissionEstimateValue.trim() === currentEstimate &&
      commissionActualValue.trim() === currentActual &&
      outcomeNotesValue === currentOutcomeNotes
    ) {
      setError("");
      setSuccess("No changes to save.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/lead-outcome", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: leadId,
          closed_at: closedAtValue || null,
          commission_estimate: estimate,
          commission_actual: actual,
          outcome_notes: trimmedOutcomeNotes || null,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof data?.error === "string"
            ? data.error
            : "Failed to update outcome and revenue."
        );
        return;
      }

      setSuccess("Outcome and revenue updated.");

      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Network error while updating outcome and revenue.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="lead-closed-at"
            className="mb-2 block text-sm font-medium text-neutral-800"
          >
            Closed at
          </label>
          <input
            id="lead-closed-at"
            type="datetime-local"
            value={closedAtValue}
            disabled={isPending}
            onChange={(e) => setClosedAtValue(e.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-black/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor="lead-commission-estimate"
            className="mb-2 block text-sm font-medium text-neutral-800"
          >
            Commission estimate
          </label>
          <input
            id="lead-commission-estimate"
            type="number"
            min="0"
            step="0.01"
            value={commissionEstimateValue}
            disabled={isPending}
            onChange={(e) => setCommissionEstimateValue(e.target.value)}
            placeholder="0"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor="lead-commission-actual"
            className="mb-2 block text-sm font-medium text-neutral-800"
          >
            Commission actual
          </label>
          <input
            id="lead-commission-actual"
            type="number"
            min="0"
            step="0.01"
            value={commissionActualValue}
            disabled={isPending}
            onChange={(e) => setCommissionActualValue(e.target.value)}
            placeholder="0"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="lead-outcome-notes"
          className="mb-2 block text-sm font-medium text-neutral-800"
        >
          Outcome notes
        </label>
        <textarea
          id="lead-outcome-notes"
          rows={5}
          value={outcomeNotesValue}
          disabled={isPending}
          onChange={(e) => setOutcomeNotesValue(e.target.value)}
          placeholder="Add outcome notes, deal summary, objections, or closing context..."
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() => void handleSave()}
          className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save outcome"}
        </button>

        {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}