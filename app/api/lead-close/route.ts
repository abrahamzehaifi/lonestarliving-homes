import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

function toNullableNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  const num = Number(value);
  return Number.isFinite(num) ? num : NaN;
}

function normalizeNotes(value: unknown) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  return trimmed.length > 10000 ? trimmed.slice(0, 10000) : trimmed;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const id = typeof body?.id === "string" ? body.id.trim() : "";
    const commissionActual = toNullableNumber(body?.commission_actual);
    const outcomeNotes = normalizeNotes(body?.outcome_notes);

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Missing lead id." },
        { status: 400 }
      );
    }

    if (Number.isNaN(commissionActual)) {
      return NextResponse.json(
        { ok: false, error: "Invalid commission actual." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServiceClient();

    const { data: existingLead, error: existingLeadError } = await supabase
      .from("crm_leads")
      .select(
        "id, stage, closed_at, commission_actual, outcome_notes, commission_estimate, full_name"
      )
      .eq("id", id)
      .maybeSingle();

    if (existingLeadError) {
      console.error("crm lead close read failed:", existingLeadError);
      return NextResponse.json(
        { ok: false, error: "Failed to load CRM lead." },
        { status: 500 }
      );
    }

    if (!existingLead) {
      return NextResponse.json(
        { ok: false, error: "CRM lead not found." },
        { status: 404 }
      );
    }

    const nowIso = new Date().toISOString();

    const nextCommissionActual =
      commissionActual ?? existingLead.commission_actual ?? null;

    const nextOutcomeNotes =
      outcomeNotes ?? existingLead.outcome_notes ?? null;

    const { data: updatedLead, error: updateError } = await supabase
      .from("crm_leads")
      .update({
        stage: "closed",
        closed_at: existingLead.closed_at ?? nowIso,
        commission_actual: nextCommissionActual,
        outcome_notes: nextOutcomeNotes,
      })
      .eq("id", id)
      .select(
        "id, stage, closed_at, commission_actual, outcome_notes"
      )
      .maybeSingle();

    if (updateError) {
      console.error("crm lead close update failed:", updateError);
      return NextResponse.json(
        { ok: false, error: "Failed to close CRM lead." },
        { status: 500 }
      );
    }

    if (!updatedLead) {
      return NextResponse.json(
        { ok: false, error: "CRM lead not found after update." },
        { status: 404 }
      );
    }

    const { error: activityError } = await supabase
      .from("crm_activities")
      .insert({
        lead_id: id,
        activity_type: "deal_closed",
        content: [
          "Deal closed",
          `Previous stage: ${existingLead.stage ?? "-"}`,
          `Closed at: ${updatedLead.closed_at ?? "-"}`,
          `Commission actual: ${
            updatedLead.commission_actual !== null &&
            updatedLead.commission_actual !== undefined
              ? updatedLead.commission_actual
              : "-"
          }`,
          nextOutcomeNotes ? `Outcome notes: ${nextOutcomeNotes}` : null,
        ]
          .filter(Boolean)
          .join(" | "),
      });

    if (activityError) {
      console.error("crm lead close activity insert failed:", activityError);
    }

    return NextResponse.json({
      ok: true,
      lead: {
        id: updatedLead.id,
        stage: updatedLead.stage,
        closed_at: updatedLead.closed_at,
        commission_actual: updatedLead.commission_actual,
        outcome_notes: updatedLead.outcome_notes,
      },
      timeline: {
        deal_closed: !activityError,
      },
    });
  } catch (err) {
    console.error("crm lead close route crashed:", err);
    return NextResponse.json(
      { ok: false, error: "Server error." },
      { status: 500 }
    );
  }
}