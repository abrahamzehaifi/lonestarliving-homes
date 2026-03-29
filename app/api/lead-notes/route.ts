import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

function normalizeNote(value: unknown) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  return trimmed.length > 5000 ? trimmed.slice(0, 5000) : trimmed;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const leadId =
      typeof body?.leadId === "string" ? body.leadId.trim() : "";
    const note = normalizeNote(body?.note);

    if (!leadId) {
      return NextResponse.json(
        { ok: false, error: "Lead id is required." },
        { status: 400 }
      );
    }

    if (!note) {
      return NextResponse.json(
        { ok: false, error: "Note is required." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServiceClient();

    const { data: existingLead, error: existingLeadError } = await supabase
      .from("crm_leads")
      .select("id")
      .eq("id", leadId)
      .maybeSingle();

    if (existingLeadError) {
      console.error("crm-notes lead read failed:", existingLeadError);
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

    const { data: insertedActivity, error: insertError } = await supabase
      .from("crm_activities")
      .insert({
        lead_id: leadId,
        activity_type: "note",
        content: note,
      })
      .select("id, activity_type, content, created_at")
      .maybeSingle();

    if (insertError) {
      console.error("crm-notes insert failed:", insertError);
      return NextResponse.json(
        { ok: false, error: "Failed to save note." },
        { status: 500 }
      );
    }

    if (!insertedActivity) {
      return NextResponse.json(
        { ok: false, error: "Note was not created." },
        { status: 500 }
      );
    }

    revalidatePath("/ops/dashboard/crm");
    revalidatePath("/ops/leads");
    revalidatePath(`/ops/leads/${leadId}`);

    return NextResponse.json({
      ok: true,
      note: {
        id: insertedActivity.id,
        activity_type: insertedActivity.activity_type,
        note: insertedActivity.content,
        created_at: insertedActivity.created_at,
      },
    });
  } catch (error) {
    console.error("crm-notes route error:", error);

    return NextResponse.json(
      { ok: false, error: "Server error." },
      { status: 500 }
    );
  }
}