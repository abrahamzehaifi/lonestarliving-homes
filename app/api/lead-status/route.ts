import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

const ALLOWED_STATUS = [
  "new",
  "contacted",
  "qualified",
  "showing",
  "application",
  "closed",
  "lost",
] as const;

type LeadStatus = (typeof ALLOWED_STATUS)[number];

function isValidStatus(value: unknown): value is LeadStatus {
  return (
    typeof value === "string" &&
    ALLOWED_STATUS.includes(value.trim().toLowerCase() as LeadStatus)
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const id = typeof body?.id === "string" ? body.id.trim() : "";
    const rawStatus =
      typeof body?.status === "string" ? body.status.trim().toLowerCase() : "";

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Missing lead id." },
        { status: 400 }
      );
    }

    if (!isValidStatus(rawStatus)) {
      return NextResponse.json(
        { ok: false, error: "Invalid status value." },
        { status: 400 }
      );
    }

    const status = rawStatus as LeadStatus;
    const supabase = createSupabaseServiceClient();

    const { data: existingLead, error: existingLeadError } = await supabase
      .from("leads")
      .select("id, status")
      .eq("id", id)
      .maybeSingle();

    if (existingLeadError) {
      console.error("lead-status read failed:", existingLeadError);
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

    const previousStatus =
      typeof existingLead.status === "string" ? existingLead.status : null;

    if (previousStatus === status) {
      return NextResponse.json({
        ok: true,
        lead: {
          id,
          status,
          updated_at: null,
        },
        timeline: {
          status_changed: false,
        },
      });
    }

    const { data, error } = await supabase
      .from("leads")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, status, updated_at")
      .maybeSingle();

    if (error) {
      console.error("lead-status update failed:", error);
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

    const { error: eventError } = await supabase.from("lead_events").insert({
      lead_id: id,
      event_type: "status_changed",
      event_label: "Status updated",
      event_data: {
        from: previousStatus,
        to: status,
      },
    });

    if (eventError) {
      console.error("lead-status event insert failed:", eventError);
    }

    return NextResponse.json({
      ok: true,
      lead: {
        id: data.id,
        status: data.status,
        updated_at: data.updated_at ?? null,
      },
      timeline: {
        status_changed: !eventError,
      },
    });
  } catch (err) {
    console.error("lead-status route crashed:", err);
    return NextResponse.json(
      { ok: false, error: "Server error." },
      { status: 500 }
    );
  }
}