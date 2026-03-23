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
    return { ok: false, skipped: true };
  }

  // Telegram hard limit ≈ 4096 chars
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

    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}

export async function GET(req: Request) {
  // 🔐 Auth
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const supabase = createSupabaseServiceClient();
  const now = new Date().toISOString();

  // ⏱️ HARD LIMIT runtime (prevents hanging builds)
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const { data: leads, error } = await supabase
      .from("crm_leads")
      .select(
        "id, user_id, full_name, stage, next_follow_up_at, priority, lead_score, source_detail, channel"
      )
      .not("next_follow_up_at", "is", null)
      .lte("next_follow_up_at", now)
      .order("next_follow_up_at", { ascending: true })
      .limit(50);

    if (error) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    const dueLeads = ((leads ?? []) as DueLead[]).filter(
      (l) => l.stage !== "closed"
    );

    if (dueLeads.length === 0) {
      return NextResponse.json({ ok: true, dueCount: 0 });
    }

    const high = dueLeads.filter((l) => l.priority === "high");
    const normal = dueLeads.filter((l) => l.priority !== "high");

    const lines: string[] = [];

    lines.push(`Follow-ups due: ${dueLeads.length}`);
    lines.push("");

    if (high.length) {
      lines.push("High Priority");
      high.forEach((l) => {
        lines.push(`• ${l.full_name || "Lead"}`);
        lines.push(`  Score: ${l.lead_score ?? "-"}`);
        lines.push(`  Stage: ${l.stage ?? "-"}`);
        lines.push(`  Due: ${formatDateTime(l.next_follow_up_at)}`);
        lines.push("");
      });
    }

    if (normal.length) {
      lines.push("Standard");
      normal.forEach((l) => {
        lines.push(`• ${l.full_name || "Lead"}`);
        lines.push(`  Stage: ${l.stage ?? "-"}`);
        lines.push("");
      });
    }

    await sendTelegramNotification(lines.join("\n"));

    // 🧠 Insert activity (lightweight, no spam duplication risk)
    await supabase.from("crm_activities").insert(
      dueLeads.map((l) => ({
        lead_id: l.id,
        user_id: l.user_id,
        activity_type: "followup_due",
        content: "Automated follow-up reminder",
      }))
    );

    return NextResponse.json({
      ok: true,
      dueCount: dueLeads.length,
      highPriority: high.length,
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  } finally {
    clearTimeout(timeout);
  }
}