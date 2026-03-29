"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type Outcome =
  | "no_answer"
  | "spoke"
  | "interested"
  | "appointment_set"
  | "lost";

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

function revalidateCrmViews() {
  revalidatePath("/ops/dashboard/crm");
  revalidatePath("/ops/leads");
  revalidatePath("/ops/pipeline");
  revalidatePath("/ops/dashboard");
}

function nextFollowUpFromOutcome(outcome: Outcome): string | null {
  const now = new Date();

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

  if (outcome === "no_answer") return addDays(1);
  if (outcome === "spoke") return addDays(2);
  if (outcome === "interested") return addHours(24);
  if (outcome === "appointment_set") return addDays(1);
  return null;
}

function stageFromOutcome(currentStage: string, outcome: Outcome): string {
  if (outcome === "appointment_set") return "appointment_set";
  if (outcome === "lost") return "lost";

  if (
    currentStage === "new" &&
    (outcome === "no_answer" ||
      outcome === "spoke" ||
      outcome === "interested")
  ) {
    return "contacted";
  }

  return currentStage;
}

function labelFromOutcome(outcome: Outcome): string {
  if (outcome === "no_answer") return "No answer";
  if (outcome === "spoke") return "Spoke";
  if (outcome === "interested") return "Interested";
  if (outcome === "appointment_set") return "Appointment set";
  return "Lost";
}

export async function saveLeadOutcome(formData: FormData) {
  const supabase = await getSupabase();

  const leadId = String(formData.get("leadId") || "").trim();
  const outcome = String(formData.get("outcome") || "").trim() as Outcome;
  const notes = String(formData.get("notes") || "").trim();

  if (!leadId) {
    throw new Error("Missing lead id.");
  }

  const validOutcomes: Outcome[] = [
    "no_answer",
    "spoke",
    "interested",
    "appointment_set",
    "lost",
  ];

  if (!validOutcomes.includes(outcome)) {
    throw new Error("Invalid outcome.");
  }

  const { data: lead, error: leadError } = await supabase
    .from("crm_leads")
    .select("id, stage")
    .eq("id", leadId)
    .single();

  if (leadError) {
    console.error("SAVE OUTCOME FETCH ERROR:", leadError);
    return;
  }

  if (!lead) {
    console.error("SAVE OUTCOME: lead not found:", leadId);
    return;
  }

  const nextFollowUpAt = nextFollowUpFromOutcome(outcome);
  const nextStage = stageFromOutcome(lead.stage, outcome);
  const nowIso = new Date().toISOString();

  const { error: updateError } = await supabase
    .from("crm_leads")
    .update({
      stage: nextStage,
      last_contacted_at: nowIso,
      next_follow_up_at: nextFollowUpAt,
      last_outcome: outcome,
      last_outcome_at: nowIso,
      outcome_notes: notes || null,
    })
    .eq("id", leadId);

  if (updateError) {
    console.error("SAVE OUTCOME UPDATE ERROR:", updateError);
    return;
  }

  const activityText = [
    `Outcome recorded: ${labelFromOutcome(outcome)}`,
    notes ? `Notes: ${notes}` : null,
    nextFollowUpAt ? `Next follow-up: ${nextFollowUpAt}` : "No next follow-up",
  ]
    .filter(Boolean)
    .join(" | ");

  const { error: activityError } = await supabase.from("crm_activities").insert({
    lead_id: leadId,
    activity_type: "outcome",
    content: activityText,
  });

  if (activityError) {
    console.error("SAVE OUTCOME ACTIVITY ERROR:", activityError);
    return;
  }

  revalidateCrmViews();
}