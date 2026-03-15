import { NextResponse } from "next/server";
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
      .from("leads")
      .select("id")
      .eq("id", leadId)
      .maybeSingle();

    if (existingLeadError) {
      console.error("lead-notes read failed:", existingLeadError);
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

    const now = new Date().toISOString();

    const { data: insertedNote, error: insertError } = await supabase
      .from("lead_notes")
      .insert({
        lead_id: leadId,
        note,
        created_at: now,
        updated_at: now,
      })
      .select("id, note, created_at, updated_at")
      .maybeSingle();

    if (insertError) {
      console.error("lead-notes insert failed:", insertError);
      return NextResponse.json(
        { ok: false, error: "Failed to save note." },
        { status: 500 }
      );
    }

    if (!insertedNote) {
      return NextResponse.json(
        { ok: false, error: "Note was not created." },
        { status: 500 }
      );
    }

    const preview =
      note.length > 180 ? `${note.slice(0, 180).trim()}…` : note;

    const { error: eventError } = await supabase.from("lead_events").insert({
      lead_id: leadId,
      event_type: "note_added",
      event_label: "Note added",
      event_data: {
        note_preview: preview,
        note_id: insertedNote.id,
      },
    });

    if (eventError) {
      console.error("lead-notes event insert failed:", eventError);
    }

    return NextResponse.json({
      ok: true,
      note: {
        id: insertedNote.id,
        note: insertedNote.note,
        created_at: insertedNote.created_at,
        updated_at: insertedNote.updated_at,
      },
      timeline: {
        note_added: !eventError,
      },
    });
  } catch (error) {
    console.error("lead-notes route error:", error);

    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}