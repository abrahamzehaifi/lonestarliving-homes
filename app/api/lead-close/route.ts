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
      .from("leads")
      .select(
        "id, status, closed_at, commission_actual, outcome_notes, commission_estimate, name"
      )
      .eq("id", id)
      .maybeSingle();

    if (existingLeadError) {
      console.error("lead-close read failed:", existingLeadError);
      return NextResponse.json(
        { ok: false, error: "Failed to load lead." },
        { status: 500 }
      );
    }

    if (!existingLead) {
      return NextResponse.json(
        { ok: false, error: "Lead not found." },
        { status: 404 }
      );
    }

    const nowIso = new Date().toISOString();

    const nextCommissionActual =
      commissionActual ?? existingLead.commission_actual ?? null;

    const nextOutcomeNotes =
      outcomeNotes ?? existingLead.outcome_notes ?? null;

    const { data: updatedLead, error: updateError } = await supabase
      .from("leads")
      .update({
        status: "closed",
        closed_at: existingLead.closed_at ?? nowIso,
        commission_actual: nextCommissionActual,
        outcome_notes: nextOutcomeNotes,
        updated_at: nowIso,
      })
      .eq("id", id)
      .select(
        "id, status, closed_at, commission_actual, outcome_notes, updated_at"
      )
      .maybeSingle();

    if (updateError) {
      console.error("lead-close update failed:", updateError);
      return NextResponse.json(
        { ok: false, error: "Failed to close lead." },
        { status: 500 }
      );
    }

    if (!updatedLead) {
      return NextResponse.json(
        { ok: false, error: "Lead not found after update." },
        { status: 404 }
      );
    }

    const { error: eventError } = await supabase.from("lead_events").insert({
      lead_id: id,
      event_type: "deal_closed",
      event_label: "Deal closed",
      event_data: {
        previous_status: existingLead.status,
        closed_at: updatedLead.closed_at,
        commission_actual: updatedLead.commission_actual,
        commission_estimate: existingLead.commission_estimate ?? null,
        outcome_notes: updatedLead.outcome_notes,
      },
    });

    if (eventError) {
      console.error("lead-close event insert failed:", eventError);
    }

    return NextResponse.json({
      ok: true,
      lead: {
        id: updatedLead.id,
        status: updatedLead.status,
        closed_at: updatedLead.closed_at,
        commission_actual: updatedLead.commission_actual,
        outcome_notes: updatedLead.outcome_notes,
        updated_at: updatedLead.updated_at ?? null,
      },
      timeline: {
        deal_closed: !eventError,
      },
    });
  } catch (err) {
    console.error("lead-close route crashed:", err);
    return NextResponse.json(
      { ok: false, error: "Server error." },
      { status: 500 }
    );
  }
}