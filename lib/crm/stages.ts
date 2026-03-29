export const CRM_STAGES = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "conversation", label: "Conversation" },
  { key: "appointment_set", label: "Appointment Set" },
  { key: "appointment_done", label: "Appointment Done" },
  { key: "follow_up", label: "Follow-Up" },
  { key: "listing_signed", label: "Listing Signed" },
  { key: "active_listing", label: "Active Listing" },
  { key: "under_contract", label: "Under Contract" },
  { key: "closed", label: "Closed" },
  { key: "lost", label: "Lost" },
  { key: "nurture", label: "Nurture" },
] as const;

export type CrmStage = (typeof CRM_STAGES)[number]["key"];

export const CRM_STAGE_OPTIONS = new Set<CrmStage>(
  CRM_STAGES.map((s) => s.key)
);

export const CRM_STAGE_LABELS = Object.fromEntries(
  CRM_STAGES.map((s) => [s.key, s.label])
) as Record<CrmStage, string>;