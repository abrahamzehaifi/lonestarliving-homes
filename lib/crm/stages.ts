export const CRM_STAGES = [
  { key: "new_lead", label: "New Leads" },
  { key: "contacted", label: "Contacted" },
  { key: "conversation", label: "Conversation" },
  { key: "appointment_set", label: "Appointment Set" },
  { key: "appointment_done", label: "Appointment Done" },
  { key: "follow_up", label: "Follow-Up" },
  { key: "listing_signed", label: "Listing Signed" },
  { key: "active_listing", label: "Active Listing" },
  { key: "under_contract", label: "Under Contract" },
  { key: "closed", label: "Closed" },
] as const;

export type CrmStage = (typeof CRM_STAGES)[number]["key"];

export const CRM_STAGE_OPTIONS = new Set(CRM_STAGES.map((s) => s.key));