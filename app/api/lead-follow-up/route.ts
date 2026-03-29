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
      .from("crm_leads")
      .select("id, next_follow_up_at")
      .eq("id", id)
      .maybeSingle();

    if (existingLeadError) {
      console.error("crm lead follow-up read failed:", existingLeadError);
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
      typeof existingLead.next_follow_up_at === "string"
        ? existingLead.next_follow_up_at
        : existingLead.next_follow_up_at ?? null;

    if (previousFollowUpAt === followUpAt) {
      return NextResponse.json({
        ok: true,
        lead: {
          id,
          next_follow_up_at: followUpAt,
        },
        timeline: {
          follow_up_scheduled: false,
        },
      });
    }

    const { data: updatedLead, error: updateError } = await supabase
      .from("crm_leads")
      .update({
        next_follow_up_at: followUpAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, next_follow_up_at, updated_at")
      .maybeSingle();

    if (updateError) {
      console.error("crm lead follow-up update failed:", updateError);
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

    const { error: activityError } = await supabase.from("crm_activities").insert({
      lead_id: id,
      activity_type: followUpAt ? "follow_up_scheduled" : "follow_up_cleared",
      content: followUpAt
        ? `Follow-up scheduled. From: ${previousFollowUpAt ?? "-"} | To: ${followUpAt}`
        : `Follow-up cleared. Previous: ${previousFollowUpAt ?? "-"}`,
    });

    if (activityError) {
      console.error("crm follow-up activity insert failed:", activityError);
    }

    return NextResponse.json({
      ok: true,
      lead: {
        id: updatedLead.id,
        next_follow_up_at: updatedLead.next_follow_up_at ?? null,
        updated_at: updatedLead.updated_at ?? null,
      },
      timeline: {
        follow_up_scheduled: !activityError,
      },
    });
  } catch (error) {
    console.error("crm follow-up route error:", error);

    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}