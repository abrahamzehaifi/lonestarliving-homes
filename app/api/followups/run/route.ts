import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

async function sendTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  }).catch(() => {});
}

export async function POST() {
  const supabase = createSupabaseServiceClient();

  const now = new Date().toISOString();

  const { data: leads, error } = await supabase
    .from("crm_leads")
    .select("*")
    .lte("next_follow_up_at", now)
    .neq("stage", "closed");

  if (error) {
    return NextResponse.json({ ok: false, error: error.message });
  }

  let processed = 0;

  for (const lead of leads || []) {
    const message = `Follow-up due\n${lead.full_name}\n${lead.property_address}\nStage: ${lead.stage}`;

    await sendTelegram(message);

    await supabase
      .from("crm_leads")
      .update({
        last_contacted_at: now,
        next_follow_up_at: null,
      })
      .eq("id", lead.id);

    processed++;
  }

  return NextResponse.json({ ok: true, processed });
}