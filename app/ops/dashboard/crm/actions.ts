"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { CRM_STAGE_OPTIONS } from "@/lib/crm/stages";

async function getSupabase() {
  return createSupabaseServiceClient();
}

function getNextFollowUpByStage(stage: string, priority?: string | null) {
  const now = new Date();
  const highPriority = priority === "high";

  const addHours = (hours: number) => {
    const d = new Date(now);
    d.setHours(d.getHours() + hours);
    return d.toISOString();
  };

  const addDays = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return d.toISOString();
  };

  if (stage === "new") return highPriority ? addHours(2) : addHours(24);
  if (stage === "contacted") return highPriority ? addHours(24) : addDays(2);
  if (stage === "conversation") return highPriority ? addDays(1) : addDays(3);
  if (stage === "appointment_set") return addDays(1);
  if (stage === "appointment_done") return addDays(2);
  if (stage === "follow_up") return addDays(7);
  if (stage === "listing_signed") return addDays(3);
  if (stage === "nurture") return addDays(7);

  return addDays(3);
}

function cleanPriority(value: FormDataEntryValue | null): string | null {
  const x = String(value || "").trim().toLowerCase();
  if (!x) return null;

  if (x === "normal") return "medium";
  if (x === "high" || x === "medium" || x === "low") return x;

  return "medium";
}

function cleanNumber(value: FormDataEntryValue | null): number | null {
  const raw = String(value || "").trim();
  if (!raw) return null;

  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function cleanText(value: FormDataEntryValue | null, max = 500): string | null {
  const s = String(value || "").trim();
  if (!s) return null;
  return s.length > max ? s.slice(0, max) : s;
}

function cleanEmail(value: FormDataEntryValue | null): string | null {
  const email = String(value || "").trim().toLowerCase();
  if (!email) return null;

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return isValid ? email : null;
}

function revalidateCrmViews() {
  revalidatePath("/ops/dashboard/crm");
  revalidatePath("/ops/leads");
  revalidatePath("/ops/pipeline");
  revalidatePath("/ops/dashboard");
}

export async function createLead(formData: FormData) {
  const supabase = await getSupabase();

  const full_name = cleanText(formData.get("full_name"), 120);
  const property_address = cleanText(formData.get("property_address"), 250);
  const phone = cleanText(formData.get("phone"), 40);
  const email = cleanEmail(formData.get("email"));

  const allowedSources = [
    "expired",
    "withdrawn",
    "terminated",
    "referral",
    "sphere",
    "website",
    "manual",
  ] as const;

  const rawSource = String(formData.get("source") || "manual")
    .trim()
    .toLowerCase();

  const source = allowedSources.includes(
    rawSource as (typeof allowedSources)[number]
  )
    ? rawSource
    : "manual";

  const allowedMotivations = ["high", "medium", "low"] as const;
  const rawMotivation = String(formData.get("motivation") || "medium")
    .trim()
    .toLowerCase();

  const motivation = allowedMotivations.includes(
    rawMotivation as (typeof allowedMotivations)[number]
  )
    ? rawMotivation
    : "medium";

  const priority = cleanPriority(formData.get("priority")) || "medium";
  const lead_score = cleanNumber(formData.get("lead_score"));
  const source_detail = cleanText(formData.get("source_detail"), 120);
  const channel = cleanText(formData.get("channel"), 80)?.toLowerCase() || null;

  if (!full_name || !property_address) {
    throw new Error("Name and property address are required.");
  }

  const stage = "new";
  const next_follow_up_at = getNextFollowUpByStage(stage, priority);

  const payload = {
    full_name,
    property_address,
    phone,
    email,
    source,
    source_detail,
    channel,
    motivation,
    priority,
    lead_score,
    stage,
    next_follow_up_at,
  };

  console.log("CRM INSERT PAYLOAD:", payload);

  const { data, error } = await supabase
    .from("crm_leads")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    console.error("CRM INSERT ERROR:", error);
    return;
  }

  console.log("CRM INSERT SUCCESS:", data?.id);

  revalidateCrmViews();
}

export async function updateLeadStage(formData: FormData) {
  const supabase = await getSupabase();

  const id = String(formData.get("id") || "").trim();
  const stage = String(formData.get("stage") || "").trim();

  if (!id || !CRM_STAGE_OPTIONS.has(stage)) {
    throw new Error("Invalid stage update.");
  }

  const { data: existingLead, error: fetchError } = await supabase
    .from("crm_leads")
    .select("priority")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("CRM FETCH ERROR:", fetchError);
    return;
  }

  const next_follow_up_at = getNextFollowUpByStage(
    stage,
    existingLead?.priority ?? null
  );

  const { error } = await supabase
    .from("crm_leads")
    .update({
      stage,
      last_contacted_at: new Date().toISOString(),
      next_follow_up_at,
    })
    .eq("id", id);

  if (error) {
    console.error("CRM STAGE UPDATE ERROR:", error);
    return;
  }

  revalidateCrmViews();
}

export async function updateLeadDetails(formData: FormData) {
  const supabase = await getSupabase();

  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("Missing lead id.");

  const payload = {
    timeline: cleanText(formData.get("timeline"), 80),
    pain_point: cleanText(formData.get("pain_point"), 500),
    next_follow_up_at: cleanText(formData.get("next_follow_up_at"), 80),
    price_expectation: cleanNumber(formData.get("price_expectation")),
    market_low: cleanNumber(formData.get("market_low")),
    market_high: cleanNumber(formData.get("market_high")),
    recommended_price: cleanNumber(formData.get("recommended_price")),
    cma_notes: cleanText(formData.get("cma_notes"), 4000),
  };

  const { error } = await supabase
    .from("crm_leads")
    .update(payload)
    .eq("id", id);

  if (error) {
    console.error("CRM DETAILS UPDATE ERROR:", error);
    return;
  }

  revalidateCrmViews();
}

export async function addActivity(formData: FormData) {
  const supabase = await getSupabase();

  const lead_id = String(formData.get("lead_id") || "").trim();
  const activity_type = String(formData.get("activity_type") || "note").trim();
  const content = String(formData.get("content") || "").trim();

  if (!lead_id || !content) {
    throw new Error("Lead and activity content are required.");
  }

  const { error } = await supabase.from("crm_activities").insert({
    lead_id,
    activity_type,
    content,
  });

  if (error) {
    console.error("CRM ACTIVITY INSERT ERROR:", error);
    return;
  }

  revalidateCrmViews();
}