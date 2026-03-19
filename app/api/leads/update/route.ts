import { createSupabaseServiceClient } from "@/lib/supabase/service";

export async function POST(req: Request) {
  const supabase = createSupabaseServiceClient();

  const body = await req.json();

  const { id, status, notes, next_action, follow_up_at } = body;

  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("leads")
    .update({
      status,
      notes,
      next_action,
      follow_up_at,
    })
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}