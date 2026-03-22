import { createSupabaseServiceClient } from "@/lib/supabase/service";

export async function POST(req: Request) {
  const supabase = createSupabaseServiceClient();

  const body = await req.json();

  const { id, status, notes, next_action, follow_up_at } = body;

  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};

  if (status !== undefined) updates.status = status;
  if (notes !== undefined) updates.notes = notes;
  if (next_action !== undefined) updates.next_action = next_action;
  if (follow_up_at !== undefined) updates.follow_up_at = follow_up_at;

  const { error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}