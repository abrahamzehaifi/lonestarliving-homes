import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

function normalizeIsoDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;

  const parsed = new Date(value);
  const time = parsed.getTime();

  if (Number.isNaN(time)) return null;
  return parsed.toISOString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const id = typeof body?.id === "string" ? body.id.trim() : "";
    const followUpAt = normalizeIsoDate(body?.followUpAt);

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Lead id is required." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServiceClient();

    const { data: existingLead, error: existingLeadError } = await supabase
      .from("leads")
      .select("id, follow_up_at")
      .eq("id", id)
      .maybeSingle();

    if (existingLeadError) {
      console.error("lead-follow-up read failed:", existingLeadError);
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

    const previousFollowUpAt =
      typeof existingLead.follow_up_at === "string"
        ? existingLead.follow_up_at
        : existingLead.follow_up_at ?? null;

    if (previousFollowUpAt === followUpAt) {
      return NextResponse.json({
        ok: true,
        lead: {
          id,
          follow_up_at: followUpAt,
        },
        timeline: {
          follow_up_scheduled: false,
        },
      });
    }

    const { data: updatedLead, error: updateError } = await supabase
      .from("leads")
      .update({
        follow_up_at: followUpAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, follow_up_at, updated_at")
      .maybeSingle();

    if (updateError) {
      console.error("lead-follow-up update failed:", updateError);
      return NextResponse.json(
        { ok: false, error: "Failed to update follow-up." },
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
      event_type: "follow_up_scheduled",
      event_label: follow-upAt
        ? "Follow-up scheduled"
        : "Follow-up cleared",
      event_data: {
        from: previousFollowUpAt,
        to: followUpAt,
      },
    });

    if (eventError) {
      console.error("lead-follow-up event insert failed:", eventError);
    }

    return NextResponse.json({
      ok: true,
      lead: {
        id: updatedLead.id,
        follow_up_at: updatedLead.follow_up_at ?? null,
        updated_at: updatedLead.updated_at ?? null,
      },
      timeline: {
        follow_up_scheduled: !eventError,
      },
    });
  } catch (error) {
    console.error("lead-follow-up route error:", error);

    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}