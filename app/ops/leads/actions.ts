"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

const ALLOWED_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "showing",
  "application",
  "closed",
  "lost",
] as const;

export async function updateLeadStatus(leadId: string, status: string) {
  try {
    if (!leadId || !ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
      return { ok: false, error: "Invalid status." };
    }

    const supabase = createSupabaseServiceClient();

    const updates: Record<string, string | null> = {
      status,
    };

    if (status === "closed") {
      updates.closed_at = new Date().toISOString();
    } else {
      updates.closed_at = null;
    }

    const { error } = await supabase.from("leads").update(updates).eq("id", leadId);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/ops/leads");
    revalidatePath(`/ops/leads/${leadId}`);
    revalidatePath("/ops/today");
    revalidatePath("/ops/pipeline");

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error.",
    };
  }
}