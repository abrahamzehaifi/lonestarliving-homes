export type MotivationLevel = "high" | "medium" | "low";

export type CrmLead = {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  property_address: string;
  source: string;
  stage: string;
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
  activity_type: string;
  content: string;
  created_at: string;
};