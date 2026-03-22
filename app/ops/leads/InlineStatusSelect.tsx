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
];

export default function InlineStatusSelect({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: string | null;
}) {
  const [value, setValue] = useState(currentStatus || "new");
  const [isPending, startTransition] = useTransition();

  function handleChange(nextValue: string) {
    const prev = value;
    setValue(nextValue);

    startTransition(() => {
      void (async () => {
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
          }
        } catch {
          setValue(prev);
        }
      })();
    });
  }

  return (
    <select
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      className="rounded-lg border px-2 py-1 text-sm"
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}