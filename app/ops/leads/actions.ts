"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

const ALLOWED_STAGES = [
  "new",
  "contacted",
  "conversation",
  "appointment_set",
  "appointment_done",
  "follow_up",
  "listing_signed",
  "closed",
  "lost",
  "nurture",
] as const;

function getNextFollowUpByStage(stage: string): string | null {
  const now = new Date();

  const addDays = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return d.toISOString();
  };

  const addHours = (hours: number) => {
    const d = new Date(now);
    d.setHours(d.getHours() + hours);
    return d.toISOString();
  };

  if (stage === "new") return addHours(24);
  if (stage === "contacted") return addDays(2);
  if (stage === "conversation") return addDays(3);
  if (stage === "appointment_set") return addDays(1);
  if (stage === "appointment_done") return addDays(2);
  if (stage === "follow_up") return addDays(7);
  if (stage === "listing_signed") return addDays(3);
  if (stage === "nurture") return addDays(7);

  return null;
}

function revalidateCrmViews(leadId: string) {
  revalidatePath("/ops/dashboard/crm");
  revalidatePath("/ops/leads");
  revalidatePath(`/ops/leads/${leadId}`);
  revalidatePath("/ops/today");
  revalidatePath("/ops/pipeline");
  revalidatePath("/ops/dashboard");
}

export async function updateLeadStage(leadId: string, stage: string) {
  try {
    if (
      !leadId ||
      !ALLOWED_STAGES.includes(stage as (typeof ALLOWED_STAGES)[number])
    ) {
      return { ok: false, error: "Invalid stage." };
    }

    const supabase = createSupabaseServiceClient();

    const updates: Record<string, string | null> = {
      stage,
      next_follow_up_at: getNextFollowUpByStage(stage),
    };

    if (stage === "closed") {
      updates.closed_at = new Date().toISOString();
    } else {
      updates.closed_at = null;
    }

    if (stage === "contacted" || stage === "conversation") {
      updates.last_contacted_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("crm_leads")
      .update(updates)
      .eq("id", leadId);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidateCrmViews(leadId);

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}