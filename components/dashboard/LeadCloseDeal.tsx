"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  leadId: string;
  currentStage: string | null;
  commissionActual: number | null;
  outcomeNotes: string | null;
};

export default function LeadCloseDeal({
  leadId,
  currentStage,
  commissionActual,
  outcomeNotes,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [amount, setAmount] = useState(
    commissionActual != null ? String(commissionActual) : ""
  );
  const [notes, setNotes] = useState(outcomeNotes ?? "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setAmount(commissionActual != null ? String(commissionActual) : "");
  }, [commissionActual]);

  useEffect(() => {
    setNotes(outcomeNotes ?? "");
  }, [outcomeNotes]);

  useEffect(() => {
    if (!success) return;

    const timeout = window.setTimeout(() => {
      setSuccess("");
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [success]);

  async function handleCloseDeal() {
    setError("");
    setSuccess("");

    if (!amount.trim()) {
      setError("Enter commission actual before closing the deal.");
      return;
    }

    const parsed = Number(amount.replace(/,/g, "").trim());

    if (!Number.isFinite(parsed) || parsed < 0) {
      setError("Enter a valid commission actual amount.");
      return;
    }

    try {
      const res = await fetch("/api/lead-close", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: leadId,
          commission_actual: parsed,
          outcome_notes: notes.trim() || null,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof data?.error === "string"
            ? data.error
            : "Failed to close deal."
        );
        return;
      }

      setSuccess(
        currentStage === "closed"
          ? "Closed deal details updated."
          : "Deal closed successfully."
      );

      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Network error while closing the deal.");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="commission-actual"
          className="mb-2 block text-sm font-medium text-neutral-700"
        >
          Commission actual
        </label>
        <input
          id="commission-actual"
          type="text"
          inputMode="decimal"
          value={amount}
          disabled={isPending}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="3500"
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div>
        <label
          htmlFor="outcome-notes"
          className="mb-2 block text-sm font-medium text-neutral-700"
        >
          Outcome notes
        </label>
        <textarea
          id="outcome-notes"
          rows={4}
          value={notes}
          disabled={isPending}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Example: Lease executed, client moved in, commission received."
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() => void handleCloseDeal()}
          className="inline-flex h-11 items-center justify-center rounded-full bg-green-600 px-5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? "Saving..."
            : currentStage === "closed"
            ? "Update closed deal"
            : "Close deal"}
        </button>

        {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}