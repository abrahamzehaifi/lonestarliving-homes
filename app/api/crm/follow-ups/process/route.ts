import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

type DueLead = {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  stage: string | null;
  next_follow_up_at: string | null;
  priority: string | null;
  lead_score: number | null;
  source_detail: string | null;
  channel: string | null;
};

async function getAuthedUser() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

function formatDateTime(value: string | null) {
  if (!value) return "Not set";

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

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
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

    return { ok: true as const };
  } catch (e: unknown) {
    return {
      ok: false as const,
      skipped: false as const,
      error: e instanceof Error ? e.message : "Telegram error",
    };
  }
}

export async function POST() {
  const user = await getAuthedUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  const supabase = createSupabaseServiceClient();
  const now = new Date().toISOString();

  const { data: leads, error } = await supabase
    .from("crm_leads")
    .select(
      "id, user_id, full_name, phone, email, stage, next_follow_up_at, priority, lead_score, source_detail, channel"
    )
    .eq("user_id", user.id)
    .not("next_follow_up_at", "is", null)
    .lte("next_follow_up_at", now)
    .order("next_follow_up_at", { ascending: true })
    .limit(50);

  if (error) {
    console.error("follow-up query failed:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to load due follow-ups." },
      { status: 500 }
    );
  }

  const dueLeads = ((leads ?? []) as DueLead[]).filter(
    (lead) => lead.stage !== "closed" && lead.stage !== "archived"
  );

  if (dueLeads.length === 0) {
    return NextResponse.json({
      ok: true,
      dueCount: 0,
      telegram: {
        ok: false,
        skipped: true,
        error: "No due follow-ups.",
      },
    });
  }

  const highPriority = dueLeads.filter((lead) => lead.priority === "high");
  const normalPriority = dueLeads.filter((lead) => lead.priority !== "high");

  const lines: string[] = [];
  lines.push(`Follow-ups due: ${dueLeads.length}`);
  lines.push("");

  if (highPriority.length > 0) {
    lines.push("🔥 High Priority");
    for (const lead of highPriority) {
      lines.push(`• ${lead.full_name || "Unknown lead"}`);
      lines.push(`  Score: ${lead.lead_score ?? "—"}`);
      lines.push(`  Stage: ${lead.stage || "—"}`);
      lines.push(`  Due: ${formatDateTime(lead.next_follow_up_at)}`);
      lines.push(
        `  Source: ${[lead.source_detail, lead.channel].filter(Boolean).join(" · ") || "—"}`
      );
      lines.push("");
    }
  }

  if (normalPriority.length > 0) {
    lines.push("• Standard Follow-Ups");
    for (const lead of normalPriority) {
      lines.push(`• ${lead.full_name || "Unknown lead"}`);
      lines.push(`  Score: ${lead.lead_score ?? "—"}`);
      lines.push(`  Stage: ${lead.stage || "—"}`);
      lines.push(`  Due: ${formatDateTime(lead.next_follow_up_at)}`);
      lines.push(
        `  Source: ${[lead.source_detail, lead.channel].filter(Boolean).join(" · ") || "—"}`
      );
      lines.push("");
    }
  }

  const telegram = await sendTelegramNotification(lines.join("\n"));

  const activityRows = dueLeads.map((lead) => ({
    lead_id: lead.id,
    user_id: user.id,
    activity_type: "system_followup_due",
    content: `Follow-up due processed. Priority: ${lead.priority || "normal"} | Score: ${lead.lead_score ?? "—"} | Source: ${lead.source_detail || "—"}${lead.channel ? ` | Channel: ${lead.channel}` : ""}`,
  }));

  const { error: activityError } = await supabase
    .from("crm_activities")
    .insert(activityRows);

  if (activityError) {
    console.error("follow-up activity insert failed:", activityError);
  }

  return NextResponse.json({
    ok: true,
    dueCount: dueLeads.length,
    highPriorityCount: highPriority.length,
    dueLeadIds: dueLeads.map((lead) => lead.id),
    telegram,
  });
}