"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

function addHours(hours: number) {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export async function markLeadContacted(formData: FormData) {
  const supabase = await getSupabase();

  const leadId = String(formData.get("leadId") || "").trim();
  if (!leadId) throw new Error("Missing lead id.");

  const { data: lead, error: leadError } = await supabase
    .from("crm_leads")
    .select("id, stage, priority, lead_quality")
    .eq("id", leadId)
    .single();

  if (leadError || !lead) {
    throw new Error("Lead not found.");
  }

  const nextStage = lead.stage === "new_lead" ? "contacted" : lead.stage;

  const nextFollowUpAt =
    lead.lead_quality === "priority_a" || lead.priority === "high"
      ? addHours(24)
      : addDays(2);

  const { error: updateError } = await supabase
    .from("crm_leads")
    .update({
      stage: nextStage,
      last_contacted_at: new Date().toISOString(),
      next_follow_up_at: nextFollowUpAt,
    })
    .eq("id", leadId);

  if (updateError) throw new Error(updateError.message);

  const { error: activityError } = await supabase.from("crm_activities").insert({
    lead_id: leadId,
    activity_type: "contacted",
    content: `Lead marked contacted from Next Best Action panel. Next follow-up set for ${nextFollowUpAt}.`,
  });

  if (activityError) {
    throw new Error(activityError.message);
  }

  revalidatePath("/ops/dashboard/crm");
}

export async function setQuickFollowUp(formData: FormData) {
  const supabase = await getSupabase();

  const leadId = String(formData.get("leadId") || "").trim();
  const followUpType = String(formData.get("followUpType") || "tomorrow").trim();

  if (!leadId) throw new Error("Missing lead id.");

  let nextFollowUpAt = addDays(1);

  if (followUpType === "today_pm") nextFollowUpAt = addHours(4);
  if (followUpType === "tomorrow") nextFollowUpAt = addDays(1);
  if (followUpType === "two_days") nextFollowUpAt = addDays(2);
  if (followUpType === "next_week") nextFollowUpAt = addDays(7);

  const { error: updateError } = await supabase
    .from("crm_leads")
    .update({
      next_follow_up_at: nextFollowUpAt,
    })
    .eq("id", leadId);

  if (updateError) throw new Error(updateError.message);

  const { error: activityError } = await supabase.from("crm_activities").insert({
    lead_id: leadId,
    activity_type: "follow_up_scheduled",
    content: `Quick follow-up set from Next Best Action panel for ${nextFollowUpAt}.`,
  });

  if (activityError) {
    throw new Error(activityError.message);
  }

  revalidatePath("/ops/dashboard/crm");
}