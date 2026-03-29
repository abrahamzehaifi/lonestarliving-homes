export type MotivationLevel = "high" | "medium" | "low";

export type LeadStage =
  | "new"
  | "contacted"
  | "conversation"
  | "appointment_set"
  | "appointment_done"
  | "follow_up"
  | "listing_signed"
  | "closed"
  | "lost"
  | "nurture";

export type LeadSource =
  | "expired"
  | "withdrawn"
  | "terminated"
  | "referral"
  | "sphere"
  | "website"
  | "manual";

export type LeadPriority = "high" | "medium" | "low";

export type LeadQuality = "priority_a" | "priority_b" | "priority_c" | null;

export type CrmLead = {
  id: string;
  user_id: string;

  full_name: string;
  phone: string | null;
  email: string | null;

  property_address: string;

  source: LeadSource;
  source_detail: string | null;
  channel: string | null;

  stage: LeadStage;
  priority: LeadPriority;
  lead_score: number | null;
  lead_quality: LeadQuality;

  motivation: MotivationLevel;
  timeline: string | null;

  price_expectation: number | null;
  pain_point: string | null;

  market_low: number | null;
  market_high: number | null;
  recommended_price: number | null;
  cma_notes: string | null;

  last_contacted_at: string | null;
  next_follow_up_at: string | null;

  created_at: string;
  updated_at: string;
};

export type CrmActivity = {
  id: string;
  lead_id: string;
  user_id: string;

  activity_type: string; // can tighten later if needed
  content: string;

  created_at: string;
};