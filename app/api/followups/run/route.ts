import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

const REMINDER_COOLDOWN_HOURS = 12;
const MAX_REMINDERS_PER_RUN = 50;

type TelegramResult =
  | { ok: true }
  | { ok: false; skipped?: boolean; error?: string };

type CrmLeadReminderRow = {
  id: string;
  full_name: string | null;
  property_address: string | null;
  stage: string | null;
  priority: string | null;
  next_follow_up_at: string | null;
  last_reminder_sent_at: string | null;
};

async function sendTelegram(message: string): Promise<TelegramResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return {
      ok: false,
      skipped: true,
      error: "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID",
    };
  }

  try {
    const resp = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      }
    );

    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      return {
        ok: false,
        error: body || `Telegram request failed with status ${resp.status}`,
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown Telegram error",
    };
  }
}

function formatText(value?: string | null) {
  return value && String(value).trim() ? value : "-";
}

function parseIso(value?: string | null) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function addHours(baseIso: string, hours: number) {
  const d = new Date(baseIso);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

function hoursOverdue(nextFollowUpAt?: string | null) {
  const due = parseIso(nextFollowUpAt);
  if (!due) return null;

  const diffMs = Date.now() - due.getTime();
  return diffMs > 0 ? Math.floor(diffMs / (1000 * 60 * 60)) : 0;
}

function shouldSkipForCooldown(
  lastReminderSentAt?: string | null,
  nowIso?: string
) {
  if (!lastReminderSentAt || !nowIso) return false;

  const cooldownUntil = addHours(lastReminderSentAt, REMINDER_COOLDOWN_HOURS);
  return cooldownUntil > nowIso;
}

function buildTelegramMessage(lead: CrmLeadReminderRow) {
  const overdueHours = hoursOverdue(lead.next_follow_up_at);
  const overdueLine =
    overdueHours && overdueHours > 0 ? `Overdue: ${overdueHours}h` : "Due now";

  return [
    "Follow-up due",
    `Lead: ${formatText(lead.full_name)}`,
    `Property: ${formatText(lead.property_address)}`,
    `Stage: ${formatText(lead.stage)}`,
    `Priority: ${formatText(lead.priority)}`,
    `Scheduled: ${formatText(lead.next_follow_up_at)}`,
    overdueLine,
  ].join("\n");
}

export async function POST() {
  const supabase = createSupabaseServiceClient();
  const now = new Date().toISOString();

  const { data: leads, error } = await supabase
    .from("crm_leads")
    .select(
      "id, full_name, property_address, stage, priority, next_follow_up_at, last_reminder_sent_at"
    )
    .lte("next_follow_up_at", now)
    .neq("stage", "closed")
    .neq("stage", "lost")
    .order("next_follow_up_at", { ascending: true })
    .limit(MAX_REMINDERS_PER_RUN);

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  const rows = (leads || []) as CrmLeadReminderRow[];

  let processed = 0;
  let attempted = 0;
  let notified = 0;
  let skippedCooldown = 0;
  let skippedInvalidDate = 0;
  let telegramFailures = 0;
  let updateErrors = 0;
  let activityErrors = 0;

  for (const lead of rows) {
    if (!parseIso(lead.next_follow_up_at)) {
      skippedInvalidDate++;
      continue;
    }

    if (shouldSkipForCooldown(lead.last_reminder_sent_at, now)) {
      skippedCooldown++;
      continue;
    }

    attempted++;

    const message = buildTelegramMessage(lead);
    const telegramResult = await sendTelegram(message);

    if (!telegramResult.ok) {
      telegramFailures++;
      console.error("Telegram reminder failed:", {
        leadId: lead.id,
        error: telegramResult.error,
        skipped: telegramResult.skipped,
      });

      const { error: activityError } = await supabase
        .from("crm_activities")
        .insert({
          lead_id: lead.id,
          activity_type: "follow_up_reminder_failed",
          content: `Follow-up reminder attempt failed. Error: ${formatText(
            telegramResult.error
          )}. Scheduled follow-up: ${formatText(lead.next_follow_up_at)}.`,
        });

      if (activityError) {
        activityErrors++;
        console.error("Failed to log reminder failure activity:", {
          leadId: lead.id,
          error: activityError.message,
        });
      }

      processed++;
      continue;
    }

    notified++;

    const { error: updateError } = await supabase
      .from("crm_leads")
      .update({
        last_reminder_sent_at: now,
      })
      .eq("id", lead.id);

    if (updateError) {
      updateErrors++;
      console.error("Failed to update last_reminder_sent_at:", {
        leadId: lead.id,
        error: updateError.message,
      });
    }

    const { error: activityError } = await supabase
      .from("crm_activities")
      .insert({
        lead_id: lead.id,
        activity_type: "follow_up_reminder",
        content: `Follow-up reminder sent successfully. Scheduled follow-up: ${formatText(
          lead.next_follow_up_at
        )}. Cooldown: ${REMINDER_COOLDOWN_HOURS}h.`,
      });

    if (activityError) {
      activityErrors++;
      console.error("Failed to insert follow_up_reminder activity:", {
        leadId: lead.id,
        error: activityError.message,
      });
    }

    processed++;
  }

  return NextResponse.json({
    ok: true,
    processed,
    attempted,
    notified,
    skippedCooldown,
    skippedInvalidDate,
    telegramFailures,
    updateErrors,
    activityErrors,
    cooldownHours: REMINDER_COOLDOWN_HOURS,
    maxPerRun: MAX_REMINDERS_PER_RUN,
  });
}