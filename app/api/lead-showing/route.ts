import { NextResponse } from "next/server";
import Twilio from "twilio";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

function normalizeIsoDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;

  const parsed = new Date(value);
  const time = parsed.getTime();

  if (Number.isNaN(time)) return null;
  return parsed.toISOString();
}

function formatShowingDateTime(value: string | null) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

async function sendShowingSmsNotification(opts: { body: string }) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const to = process.env.TWILIO_TO_NUMBER;

  if (!sid || !token || !from || !to) {
    return {
      ok: false as const,
      skipped: true as const,
      error: "Missing Twilio env vars",
    };
  }

  const client = Twilio(sid, token);

  try {
    const msg = await client.messages.create({ from, to, body: opts.body });
    return { ok: true as const, sid: msg.sid };
  } catch (e: unknown) {
    return {
      ok: false as const,
      skipped: false as const,
      error: e instanceof Error ? e.message : "Twilio error",
    };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const id = typeof body?.id === "string" ? body.id.trim() : "";
    const showingAt = normalizeIsoDate(body?.showingAt);

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Lead id is required." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServiceClient();

    const { data: existingLead, error: existingLeadError } = await supabase
      .from("leads")
      .select("id, name, showing_at")
      .eq("id", id)
      .maybeSingle();

    if (existingLeadError) {
      console.error("lead-showing read failed:", existingLeadError);
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

    const leadName =
      typeof existingLead.name === "string" && existingLead.name.trim()
        ? existingLead.name.trim()
        : "Unknown lead";

    const previousShowingAt =
      typeof existingLead.showing_at === "string"
        ? existingLead.showing_at
        : existingLead.showing_at ?? null;

    if (previousShowingAt === showingAt) {
      return NextResponse.json({
        ok: true,
        lead: {
          id,
          showing_at: showingAt,
          updated_at: null,
        },
        timeline: {
          showing_scheduled: false,
        },
        notifications: {
          sms: {
            ok: false,
            skipped: true,
            error: "No showing change detected.",
          },
        },
      });
    }

    const { data: updatedLead, error: updateError } = await supabase
      .from("leads")
      .update({
        showing_at: showingAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, showing_at, updated_at")
      .maybeSingle();

    if (updateError) {
      console.error("lead-showing update failed:", updateError);
      return NextResponse.json(
        { ok: false, error: "Failed to update showing." },
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
      event_type: showingAt ? "showing_scheduled" : "showing_cleared",
      event_label: showingAt ? "Showing scheduled" : "Showing cleared",
      event_data: {
        from: previousShowingAt,
        to: showingAt,
      },
    });

    if (eventError) {
      console.error("lead-showing event insert failed:", eventError);
    }

    const smsRes = showingAt
      ? await sendShowingSmsNotification({
          body: `Showing scheduled\nLead: ${leadName}\nTime: ${formatShowingDateTime(
            showingAt
          )}`,
        })
      : await sendShowingSmsNotification({
          body: `Showing cleared\nLead: ${leadName}`,
        });

    return NextResponse.json({
      ok: true,
      lead: {
        id: updatedLead.id,
        showing_at: updatedLead.showing_at ?? null,
        updated_at: updatedLead.updated_at ?? null,
      },
      timeline: {
        showing_scheduled: !eventError,
      },
      notifications: {
        sms: smsRes,
      },
    });
  } catch (error) {
    console.error("lead-showing route error:", error);

    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}