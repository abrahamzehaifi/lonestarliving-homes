import { NextResponse } from "next/server";
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

type CrmStage = (typeof ALLOWED_STAGES)[number];

function isValidStage(value: unknown): value is CrmStage {
  return (
    typeof value === "string" &&
    ALLOWED_STAGES.includes(value.trim().toLowerCase() as CrmStage)
  );
}

function getNextFollowUpByStage(stage: CrmStage): string | null {
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

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const id = typeof body?.id === "string" ? body.id.trim() : "";
    const rawStage =
      typeof body?.stage === "string" ? body.stage.trim().toLowerCase() : "";

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Missing lead id." },
        { status: 400 }
      );
    }

    if (!isValidStage(rawStage)) {
      return NextResponse.json(
        { ok: false, error: "Invalid stage value." },
        { status: 400 }
      );
    }

    const stage = rawStage as CrmStage;
    const supabase = createSupabaseServiceClient();

    const { data: existingLead, error: existingLeadError } = await supabase
      .from("crm_leads")
      .select("id, stage")
      .eq("id", id)
      .maybeSingle();

    if (existingLeadError) {
      console.error("crm-stage read failed:", existingLeadError);
      return NextResponse.json(
        { ok: false, error: "Database read failed." },
        { status: 500 }
      );
    }

    if (!existingLead) {
      return NextResponse.json(
        { ok: false, error: "Lead not found." },
        { status: 404 }
      );
    }

    const previousStage =
      typeof existingLead.stage === "string" ? existingLead.stage : null;

    if (previousStage === stage) {
      return NextResponse.json({
        ok: true,
        lead: {
          id,
          stage,
          updated_at: null,
        },
        timeline: {
          stage_changed: false,
        },
      });
    }

    const updates: Record<string, string | null> = {
      stage,
      updated_at: new Date().toISOString(),
      next_follow_up_at: getNextFollowUpByStage(stage),
    };

    if (stage === "contacted" || stage === "conversation") {
      updates.last_contacted_at = new Date().toISOString();
    }

    if (stage === "closed") {
      updates.closed_at = new Date().toISOString();
    } else {
      updates.closed_at = null;
    }

    const { data, error } = await supabase
      .from("crm_leads")
      .update(updates)
      .eq("id", id)
      .select("id, stage, updated_at, next_follow_up_at")
      .maybeSingle();

    if (error) {
      console.error("crm-stage update failed:", error);
      return NextResponse.json(
        { ok: false, error: "Database update failed." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { ok: false, error: "Lead not found." },
        { status: 404 }
      );
    }

    const { error: activityError } = await supabase.from("crm_activities").insert({
      lead_id: id,
      activity_type: "stage_changed",
      content: `Stage updated from ${previousStage || "unknown"} to ${stage}.`,
    });

    if (activityError) {
      console.error("crm-stage activity insert failed:", activityError);
    }

    return NextResponse.json({
      ok: true,
      lead: {
        id: data.id,
        stage: data.stage,
        updated_at: data.updated_at ?? null,
        next_follow_up_at: data.next_follow_up_at ?? null,
      },
      timeline: {
        stage_changed: !activityError,
      },
    });
  } catch (err) {
    console.error("crm-stage route crashed:", err);
    return NextResponse.json(
      { ok: false, error: "Server error." },
      { status: 500 }
    );
  }
}