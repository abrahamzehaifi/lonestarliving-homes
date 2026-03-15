import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

function normalizeNextAction(value: unknown) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  return trimmed.length > 2000 ? trimmed.slice(0, 2000) : trimmed;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const id = typeof body?.id === "string" ? body.id.trim() : "";
    const nextAction = normalizeNextAction(body?.nextAction);

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Lead id is required." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServiceClient();

    const { data: existingLead, error: existingLeadError } = await supabase
      .from("leads")
      .select("id, next_action")
      .eq("id", id)
      .maybeSingle();

    if (existingLeadError) {
      console.error("lead-next-action read failed:", existingLeadError);
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

    const previousNextAction =
      typeof existingLead.next_action === "string"
        ? existingLead.next_action
        : existingLead.next_action ?? null;

    if (previousNextAction === nextAction) {
      return NextResponse.json({
        ok: true,
        lead: {
          id,
          next_action: nextAction,
          updated_at: null,
        },
        timeline: {
          next_action_updated: false,
        },
      });
    }

    const { data: updatedLead, error: updateError } = await supabase
      .from("leads")
      .update({
        next_action: nextAction,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, next_action, updated_at")
      .maybeSingle();

    if (updateError) {
      console.error("lead-next-action update failed:", updateError);
      return NextResponse.json(
        { ok: false, error: "Failed to update next action." },
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
      event_type: "next_action_updated",
      event_label: nextAction ? "Next action updated" : "Next action cleared",
      event_data: {
        from: previousNextAction,
        to: nextAction,
      },
    });

    if (eventError) {
      console.error("lead-next-action event insert failed:", eventError);
    }

    return NextResponse.json({
      ok: true,
      lead: {
        id: updatedLead.id,
        next_action: updatedLead.next_action ?? null,
        updated_at: updatedLead.updated_at ?? null,
      },
      timeline: {
        next_action_updated: !eventError,
      },
    });
  } catch (error) {
    console.error("lead-next-action route error:", error);

    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}