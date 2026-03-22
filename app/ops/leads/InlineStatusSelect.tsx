"use client";

import { useState, useTransition } from "react";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "showing", label: "Showing" },
  { value: "application", label: "Application" },
  { value: "closed", label: "Closed" },
  { value: "lost", label: "Lost" },
] as const;

export default function InlineStatusSelect({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: string | null;
}) {
  const [value, setValue] = useState(currentStatus || "new");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleChange(nextValue: string) {
    const previousValue = value;
    setValue(nextValue);
    setError("");

    startTransition(async () => {
      try {
        const res = await fetch("/api/leads/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: leadId,
            status: nextValue,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setValue(previousValue);
          setError(
            typeof data?.error === "string"
              ? data.error
              : "Failed to update status."
          );
        }
      } catch {
        setValue(previousValue);
        setError("Failed to update status.");
      }
    });
  }

  return (
    <div className="min-w-[170px]">
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 disabled:opacity-60"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}