import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

function normalizeIsoDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;

  const parsed = new Date(value);
  const time = parsed.getTime();

  if (Number.isNaN(time)) return null;
  return parsed.toISOString();
}

function toNullableNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  const num = Number(value);
  return Number.isFinite(num) ? num : NaN;
}

function normalizeOutcomeNotes(value: unknown) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  return trimmed.length > 10000 ? trimmed.slice(0, 10000) : trimmed;
}

function valuesEqual(a: unknown, b: unknown) {
  return a === b;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const id = typeof body?.id === "string" ? body.id.trim() : "";
    const closedAt = normalizeIsoDate(body?.closed_at);
    const commissionEstimate = toNullableNumber(body?.commission_estimate);
    const commissionActual = toNullableNumber(body?.commission_actual);
    const outcomeNotes = normalizeOutcomeNotes(body?.outcome_notes);

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Missing lead id." },
        { status: 400 }
      );
    }

    if (Number.isNaN(commissionEstimate)) {
      return NextResponse.json(
        { ok: false, error: "Invalid commission estimate." },
        { status: 400 }
      );
    }

    if (Number.isNaN(commissionActual)) {
      return NextResponse.json(
        { ok: false, error: "Invalid commission actual." },
        { status: 400 }
      );
    }

    if (
      body?.outcome_notes != null &&
      typeof body?.outcome_notes === "string" &&
      body.outcome_notes.trim().length > 10000
    ) {
      return NextResponse.json(
        { ok: false, error: "Outcome notes are too long." },
        { status: 400 }
      );
    }

    if (
      body?.closed_at != null &&
      body?.closed_at !== "" &&
      closedAt === null
    ) {
      return NextResponse.json(
        { ok: false, error: "Invalid closed date." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServiceClient();

    const { data: existingLead, error: existingLeadError } = await supabase
      .from("leads")
      .select(
        "id, closed_at, commission_estimate, commission_actual, outcome_notes"
      )
      .eq("id", id)
      .maybeSingle();

    if (existingLeadError) {
      console.error("lead-outcome read failed:", existingLeadError);
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

    const previousClosedAt =
      typeof existingLead.closed_at === "string"
        ? existingLead.closed_at
        : existingLead.closed_at ?? null;

    const previousCommissionEstimate =
      typeof existingLead.commission_estimate === "number"
        ? existingLead.commission_estimate
        : existingLead.commission_estimate ?? null;

    const previousCommissionActual =
      typeof existingLead.commission_actual === "number"
        ? existingLead.commission_actual
        : existingLead.commission_actual ?? null;

    const previousOutcomeNotes =
      typeof existingLead.outcome_notes === "string"
        ? existingLead.outcome_notes
        : existingLead.outcome_notes ?? null;

    const changedClosedAt = !valuesEqual(previousClosedAt, closedAt);
    const changedCommissionEstimate = !valuesEqual(
      previousCommissionEstimate,
      commissionEstimate
    );
    const changedCommissionActual = !valuesEqual(
      previousCommissionActual,
      commissionActual
    );
    const changedOutcomeNotes = !valuesEqual(
      previousOutcomeNotes,
      outcomeNotes
    );

    const hasChanges =
      changedClosedAt ||
      changedCommissionEstimate ||
      changedCommissionActual ||
      changedOutcomeNotes;

    if (!hasChanges) {
      return NextResponse.json({
        ok: true,
        lead: {
          id,
          closed_at: previousClosedAt,
          commission_estimate: previousCommissionEstimate,
          commission_actual: previousCommissionActual,
          outcome_notes: previousOutcomeNotes,
          updated_at: null,
        },
        timeline: {
          lead_closed: false,
          commission_estimate_updated: false,
          commission_actual_updated: false,
          outcome_notes_updated: false,
        },
      });
    }

    const { data: updatedLead, error: updateError } = await supabase
      .from("leads")
      .update({
        closed_at: closedAt,
        commission_estimate: commissionEstimate,
        commission_actual: commissionActual,
        outcome_notes: outcomeNotes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        "id, closed_at, commission_estimate, commission_actual, outcome_notes, updated_at"
      )
      .maybeSingle();

    if (updateError) {
      console.error("lead-outcome update failed:", updateError);
      return NextResponse.json(
        { ok: false, error: "Database update failed." },
        { status: 500 }
      );
    }

    if (!updatedLead) {
      return NextResponse.json(
        { ok: false, error: "Lead not found after update." },
        { status: 404 }
      );
    }

    const timelineResults = {
      lead_closed: false,
      commission_estimate_updated: false,
      commission_actual_updated: false,
      outcome_notes_updated: false,
    };

    if (changedClosedAt) {
      const { error } = await supabase.from("lead_events").insert({
        lead_id: id,
        event_type: closedAt ? "lead_closed" : "lead_reopened",
        event_label: closedAt ? "Lead closed" : "Lead reopened",
        event_data: {
          from: previousClosedAt,
          to: closedAt,
        },
      });

      if (error) {
        console.error("lead-outcome closed_at event insert failed:", error);
      } else {
        timelineResults.lead_closed = true;
      }
    }

    if (changedCommissionEstimate) {
      const { error } = await supabase.from("lead_events").insert({
        lead_id: id,
        event_type: "commission_estimate_updated",
        event_label: "Commission estimate updated",
        event_data: {
          from: previousCommissionEstimate,
          to: commissionEstimate,
        },
      });

      if (error) {
        console.error(
          "lead-outcome commission_estimate event insert failed:",
          error
        );
      } else {
        timelineResults.commission_estimate_updated = true;
      }
    }

    if (changedCommissionActual) {
      const { error } = await supabase.from("lead_events").insert({
        lead_id: id,
        event_type: "commission_actual_updated",
        event_label: "Commission actual updated",
        event_data: {
          from: previousCommissionActual,
          to: commissionActual,
        },
      });

      if (error) {
        console.error(
          "lead-outcome commission_actual event insert failed:",
          error
        );
      } else {
        timelineResults.commission_actual_updated = true;
      }
    }

    if (changedOutcomeNotes) {
      const previousPreview =
        previousOutcomeNotes && previousOutcomeNotes.length > 180
          ? `${previousOutcomeNotes.slice(0, 180).trim()}…`
          : previousOutcomeNotes;

      const nextPreview =
        outcomeNotes && outcomeNotes.length > 180
          ? `${outcomeNotes.slice(0, 180).trim()}…`
          : outcomeNotes;

      const { error } = await supabase.from("lead_events").insert({
        lead_id: id,
        event_type: "outcome_notes_updated",
        event_label: outcomeNotes
          ? "Outcome notes updated"
          : "Outcome notes cleared",
        event_data: {
          from: previousPreview,
          to: nextPreview,
        },
      });

      if (error) {
        console.error("lead-outcome notes event insert failed:", error);
      } else {
        timelineResults.outcome_notes_updated = true;
      }
    }

    return NextResponse.json({
      ok: true,
      lead: {
        id: updatedLead.id,
        closed_at: updatedLead.closed_at ?? null,
        commission_estimate: updatedLead.commission_estimate ?? null,
        commission_actual: updatedLead.commission_actual ?? null,
        outcome_notes: updatedLead.outcome_notes ?? null,
        updated_at: updatedLead.updated_at ?? null,
      },
      timeline: timelineResults,
    });
  } catch (err) {
    console.error("lead-outcome route crashed:", err);
    return NextResponse.json(
      { ok: false, error: "Server error." },
      { status: 500 }
    );
  }
}