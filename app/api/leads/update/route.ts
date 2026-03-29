import { createSupabaseServiceClient } from "@/lib/supabase/service";

type ActivityType = "stage_change" | "note" | "follow_up" | "system";

function isValidActivityType(value: unknown): value is ActivityType {
  return (
    value === "stage_change" ||
    value === "note" ||
    value === "follow_up" ||
    value === "system"
  );
}

export async function POST(req: Request) {
  try {
    const supabase = createSupabaseServiceClient();
    const body = await req.json();

    const {
      id,
      stage,
      next_follow_up_at,
      timeline,
      pain_point,
      cma_notes,
    } = body as {
      id?: string;
      stage?: string;
      next_follow_up_at?: string | null;
      timeline?: string | null;
      pain_point?: string | null;
      cma_notes?: string | null;
    };

    if (!id || typeof id !== "string") {
      return Response.json({ error: "Missing id" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    const activityLogs: Array<{ activity_type: ActivityType; content: string }> =
      [];

    const normalizedStage =
      typeof stage === "string" ? stage.trim().toLowerCase() : undefined;

    if (normalizedStage !== undefined && normalizedStage !== "") {
      updates.stage = normalizedStage;
      activityLogs.push({
        activity_type: "stage_change",
        content: `Stage changed to ${normalizedStage}.`,
      });
    }

    if (next_follow_up_at !== undefined) {
      updates.next_follow_up_at = next_follow_up_at || null;
      activityLogs.push({
        activity_type: "follow_up",
        content: next_follow_up_at
          ? `Follow-up set for ${next_follow_up_at}.`
          : "Follow-up cleared.",
      });
    }

    if (timeline !== undefined) {
      updates.timeline = timeline || null;
      if (timeline) {
        activityLogs.push({
          activity_type: "note",
          content: `Timeline updated: ${timeline}.`,
        });
      }
    }

    if (pain_point !== undefined) {
      updates.pain_point = pain_point || null;
      if (pain_point) {
        activityLogs.push({
          activity_type: "note",
          content: `Pain point updated: ${pain_point}.`,
        });
      }
    }

    if (cma_notes !== undefined) {
      updates.cma_notes = cma_notes || null;
      if (cma_notes) {
        activityLogs.push({
          activity_type: "note",
          content: "CMA notes updated via API.",
        });
      }
    }

    if (normalizedStage === "contacted" || normalizedStage === "conversation") {
      updates.last_contacted_at = new Date().toISOString();
    }

    if (Object.keys(updates).length === 0) {
      return Response.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from("crm_leads")
      .update(updates)
      .eq("id", id);

    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 500 });
    }

    const activityRows = activityLogs
      .filter(
        (log) =>
          isValidActivityType(log.activity_type) &&
          typeof log.content === "string" &&
          log.content.trim().length > 0
      )
      .map((log) => ({
        lead_id: id,
        activity_type: log.activity_type,
        content: log.content,
      }));

    if (activityRows.length > 0) {
      const { error: activityError } = await supabase
        .from("crm_activities")
        .insert(activityRows);

      if (activityError) {
        return Response.json({ error: activityError.message }, { status: 500 });
      }
    }

    if (activityRows.length === 0) {
      const { error: fallbackActivityError } = await supabase
        .from("crm_activities")
        .insert({
          lead_id: id,
          activity_type: "system",
          content: "Lead updated via API.",
        });

      if (fallbackActivityError) {
        return Response.json(
          { error: fallbackActivityError.message },
          { status: 500 }
        );
      }
    }

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}