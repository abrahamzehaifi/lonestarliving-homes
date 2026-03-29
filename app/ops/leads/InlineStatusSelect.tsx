"use client";

import { useState, useTransition } from "react";

const STAGE_OPTIONS = [
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
];

export default function InlineStatusSelect({
  leadId,
  currentStage,
}: {
  leadId: string;
  currentStage: string | null;
}) {
  const [value, setValue] = useState(currentStage || "new");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleChange(nextValue: string) {
    const prev = value;
    setValue(nextValue);
    setMessage("");

    startTransition(() => {
      void (async () => {
        try {
          const res = await fetch("/api/crm/update-stage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: leadId,
              stage: nextValue,
            }),
          });

          const data = await res.json().catch(() => null);

          if (!res.ok) {
            setValue(prev);
            setMessage(data?.error || "Failed to update");
            return;
          }

          setMessage("Saved");
        } catch {
          setValue(prev);
          setMessage("Failed to update");
        }
      })();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        className="rounded-lg border px-2 py-1 text-sm"
      >
        {STAGE_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {message ? (
        <span className="text-xs text-neutral-500">{message}</span>
      ) : null}
    </div>
  );
}