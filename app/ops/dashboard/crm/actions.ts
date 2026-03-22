"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { CRM_STAGE_OPTIONS } from "@/lib/crm/stages";

async function getSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );
}

async function getUserId() {
  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  return { supabase, userId: user.id };
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

  if (stage === "new_lead") return highPriority ? addHours(2) : addHours(24);
  if (stage === "contacted") return highPriority ? addHours(24) : addDays(2);
  if (stage === "appointment_set") return addDays(1);
  if (stage === "listing_signed") return addDays(3);
  if (stage === "nurture") return addDays(7);

  return addDays(3);
}

function cleanPriority(value: FormDataEntryValue | null): string | null {
  const x = String(value || "")
    .trim()
    .toLowerCase();

  if (!x) return null;
  return x;
}

function cleanNumber(value: FormDataEntryValue | null): number | null {
  const raw = String(value || "").trim();
  if (!raw) return null;

  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export async function createLead(formData: FormData) {
  const { supabase, userId } = await getUserId();

  const full_name = String(formData.get("full_name") || "").trim();
  const property_address = String(formData.get("property_address") || "").trim();
  const phone = String(formData.get("phone") || "").trim() || null;
  const email = String(formData.get("email") || "").trim() || null;
  const source = String(formData.get("source") || "manual").trim();
  const motivation = String(formData.get("motivation") || "medium").trim();

  const priority = cleanPriority(formData.get("priority")) || "normal";
  const lead_score = cleanNumber(formData.get("lead_score"));
  const source_detail = String(formData.get("source_detail") || "").trim() || null;
  const channel = String(formData.get("channel") || "").trim() || null;

  if (!full_name || !property_address) {
    throw new Error("Name and property address are required.");
  }

  const stage = "new_lead";
  const next_follow_up_at = getNextFollowUpByStage(stage, priority);

  const { error } = await supabase.from("crm_leads").insert({
    user_id: userId,
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
  });

  if (error) throw new Error(error.message);

  revalidatePath("/ops/dashboard/crm");
}

export async function updateLeadStage(formData: FormData) {
  const { supabase, userId } = await getUserId();

  const id = String(formData.get("id") || "");
  const stage = String(formData.get("stage") || "");

  if (!id || !CRM_STAGE_OPTIONS.has(stage as never)) {
    throw new Error("Invalid stage update.");
  }

  const { data: existingLead, error: fetchError } = await supabase
    .from("crm_leads")
    .select("priority")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

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
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  revalidatePath("/ops/dashboard/crm");
}

export async function updateLeadDetails(formData: FormData) {
  const { supabase, userId } = await getUserId();

  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing lead id.");

  const payload = {
    timeline: String(formData.get("timeline") || "").trim() || null,
    pain_point: String(formData.get("pain_point") || "").trim() || null,
    next_follow_up_at:
      String(formData.get("next_follow_up_at") || "").trim() || null,
    price_expectation: cleanNumber(formData.get("price_expectation")),
    market_low: cleanNumber(formData.get("market_low")),
    market_high: cleanNumber(formData.get("market_high")),
    recommended_price: cleanNumber(formData.get("recommended_price")),
    cma_notes: String(formData.get("cma_notes") || "").trim() || null,
  };

  const { error } = await supabase
    .from("crm_leads")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  revalidatePath("/ops/dashboard/crm");
}

export async function addActivity(formData: FormData) {
  const { supabase, userId } = await getUserId();

  const lead_id = String(formData.get("lead_id") || "");
  const activity_type = String(formData.get("activity_type") || "note");
  const content = String(formData.get("content") || "").trim();

  if (!lead_id || !content) {
    throw new Error("Lead and activity content are required.");
  }

  const { error } = await supabase.from("crm_activities").insert({
    lead_id,
    user_id: userId,
    activity_type,
    content,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/ops/dashboard/crm");
}