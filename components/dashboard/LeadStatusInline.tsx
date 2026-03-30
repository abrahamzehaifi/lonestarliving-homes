"use client";

import { useState, useTransition } from "react";
import { updateLeadStage } from "@/app/ops/dashboard/crm/actions";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "conversation", label: "Conversation" },
  { value: "appointment_set", label: "Appointment Set" },
  { value: "appointment_done", label: "Appointment Done" },
  { value: "follow_up", label: "Follow Up" },
  { value: "listing_signed", label: "Listing Signed" },
  { value: "active_listing", label: "Active Listing" },
  { value: "under_contract", label: "Under Contract" },
  { value: "closed", label: "Closed" },
  { value: "lost", label: "Lost" },
  { value: "nurture", label: "Nurture" },
] as const;

type StatusValue = (typeof STATUS_OPTIONS)[number]["value"];

export default function LeadStatusInline({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: string | null;
}) {
  const [value, setValue] = useState<StatusValue>(
    (currentStatus as StatusValue) || "new"
  );
  const [isPending, startTransition] = useTransition();

  function handleChange(nextValue: string) {
    const prev = value;
    const next = nextValue as StatusValue;

    setValue(next);

    startTransition(() => {
      const formData = new FormData();
      formData.append("id", leadId);
      formData.append("stage", next);

      void updateLeadStage(formData).catch(() => {
        setValue(prev);
      });
    });
  }

  return (
    <select
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      className="rounded-lg border px-2 py-1 text-sm"
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}