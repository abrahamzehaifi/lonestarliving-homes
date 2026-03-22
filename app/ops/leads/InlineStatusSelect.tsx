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
    const prev = value;
    setValue(nextValue);
    setError("");

    startTransition(async () => {
      try {
        const res = await fetch("/api/leads/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: leadId,
            status: nextValue,
          }),
        });

        if (!res.ok) {
          setValue(prev);
          setError("Update failed");
        }
      } catch {
        setValue(prev);
        setError("Network error");
      }
    });
  }

  return (
    <div className="min-w-[160px]">
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        className="w-full rounded-lg border px-3 py-2 text-sm"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}