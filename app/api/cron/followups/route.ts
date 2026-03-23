import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

type DueLead = {
  id: string;
  user_id: string;
  full_name: string | null;
  stage: string | null;
  next_follow_up_at: string | null;
  priority: string | null;
  lead_score: number | null;
  source_detail: string | null;
  channel: string | null;
};

function formatDateTime(value: string | null) {
  if (!value) return "Not set";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

async function sendTelegramNotification(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return {
      ok: false as const,
      skipped: true as const,
      error: "Missing Telegram env vars",
    };
  }

  const safeMessage = message.slice(0, 3800);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: safeMessage,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        ok: false as const,
        skipped: false as const,
        error: text,
      };
    }

    return { ok: true as const, skipped: false as const };
  } catch (error) {
    return {
      ok: false as const,
      skipped: false as const,
      error: error instanceof Error ? error.message : "Telegram request failed",
    };
  }
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { ok: false, where: "auth", error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const supabase = createSupabaseServiceClient();
    const now = new Date().toISOString();

    const { data: leads, error: leadsError } = await supabase
      .from("crm_leads")
      .select(
        "id, user_id, full_name, stage, next_follow_up_at, priority, lead_score, source_detail, channel"
      )
      .not("next_follow_up_at", "is", null)
      .lte("next_follow_up_at", now)
      .order("next_follow_up_at", { ascending: true })
      .limit(50);

    if (leadsError) {
      console.error("cron followups leads query failed:", leadsError);
      return NextResponse.json(
        {
          ok: false,
          where: "crm_leads_query",
          error: leadsError.message,
          details: leadsError,
        },
        { status: 500 }
      );
    }

    const dueLeads = ((leads ?? []) as DueLead[]).filter(
      (lead) => lead.stage !== "closed"
    );

    if (dueLeads.length === 0) {
      return NextResponse.json({
        ok: true,
        dueCount: 0,
        message: "No due follow-ups.",
      });
    }

    const high = dueLeads.filter((lead) => lead.priority === "high");
    const normal = dueLeads.filter((lead) => lead.priority !== "high");

    const lines: string[] = [];
    lines.push(`Follow-ups due: ${dueLeads.length}`);
    lines.push("");

    if (high.length > 0) {
      lines.push("High Priority");
      for (const lead of high) {
        lines.push(`• ${lead.full_name || "Lead"}`);
        lines.push(`  Score: ${lead.lead_score ?? "-"}`);
        lines.push(`  Stage: ${lead.stage ?? "-"}`);
        lines.push(`  Due: ${formatDateTime(lead.next_follow_up_at)}`);
        lines.push("");
      }
    }

    if (normal.length > 0) {
      lines.push("Standard");
      for (const lead of normal) {
        lines.push(`• ${lead.full_name || "Lead"}`);
        lines.push(`  Stage: ${lead.stage ?? "-"}`);
        lines.push("");
      }
    }

    const telegram = await sendTelegramNotification(lines.join("\n"));

    if (!telegram.ok && !telegram.skipped) {
      console.error("cron followups telegram failed:", telegram.error);
      return NextResponse.json(
        {
          ok: false,
          where: "telegram",
          error: telegram.error,
        },
        { status: 500 }
      );
    }

    const { error: activityError } = await supabase.from("crm_activities").insert(
      dueLeads.map((lead) => ({
        lead_id: lead.id,
        user_id: lead.user_id,
        activity_type: "followup_due",
        content: "Automated follow-up reminder",
      }))
    );

    if (activityError) {
      console.error("cron followups activity insert failed:", activityError);
      return NextResponse.json(
        {
          ok: false,
          where: "crm_activities_insert",
          error: activityError.message,
          details: activityError,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      dueCount: dueLeads.length,
      highPriority: high.length,
      telegram,
    });
  } catch (error) {
    console.error("cron followups unhandled error:", error);

    return NextResponse.json(
      {
        ok: false,
        where: "unhandled",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}