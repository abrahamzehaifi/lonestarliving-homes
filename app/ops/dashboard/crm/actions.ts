"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { CRM_STAGE_OPTIONS } from "@/lib/crm/stages";

async function getSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );
}

async function getUserId() {
  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  return { supabase, userId: user.id };
}

export async function createLead(formData: FormData) {
  const { supabase, userId } = await getUserId();

  const full_name = String(formData.get("full_name") || "").trim();
  const property_address = String(formData.get("property_address") || "").trim();
  const phone = String(formData.get("phone") || "").trim() || null;
  const email = String(formData.get("email") || "").trim() || null;
  const source = String(formData.get("source") || "expired").trim();
  const motivation = String(formData.get("motivation") || "medium").trim();

  if (!full_name || !property_address) {
    throw new Error("Name and property address are required.");
  }

  const { error } = await supabase.from("crm_leads").insert({
    user_id: userId,
    full_name,
    property_address,
    phone,
    email,
    source,
    motivation,
    stage: "new_lead",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/ops/dashboard/crm");
}

export async function updateLeadStage(formData: FormData) {
  const { supabase, userId } = await getUserId();

  const id = String(formData.get("id") || "");
  const stage = String(formData.get("stage") || "");

  if (!id || !CRM_STAGE_OPTIONS.has(stage as never)) {
    throw new Error("Invalid stage update.");
  }

  const { error } = await supabase
    .from("crm_leads")
    .update({
      stage,
      last_contacted_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  revalidatePath("/ops/dashboard/crm");
}

export async function updateLeadDetails(formData: FormData) {
  const { supabase, userId } = await getUserId();

  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing lead id.");

  const payload = {
    timeline: String(formData.get("timeline") || "").trim() || null,
    pain_point: String(formData.get("pain_point") || "").trim() || null,
    next_follow_up_at: String(formData.get("next_follow_up_at") || "").trim() || null,
    price_expectation: formData.get("price_expectation")
      ? Number(formData.get("price_expectation"))
      : null,
    market_low: formData.get("market_low") ? Number(formData.get("market_low")) : null,
    market_high: formData.get("market_high") ? Number(formData.get("market_high")) : null,
    recommended_price: formData.get("recommended_price")
      ? Number(formData.get("recommended_price"))
      : null,
    cma_notes: String(formData.get("cma_notes") || "").trim() || null,
  };

  const { error } = await supabase
    .from("crm_leads")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  revalidatePath("/ops/dashboard/crm");
}

export async function addActivity(formData: FormData) {
  const { supabase, userId } = await getUserId();

  const lead_id = String(formData.get("lead_id") || "");
  const activity_type = String(formData.get("activity_type") || "note");
  const content = String(formData.get("content") || "").trim();

  if (!lead_id || !content) {
    throw new Error("Lead and activity content are required.");
  }

  const { error } = await supabase.from("crm_activities").insert({
    lead_id,
    user_id: userId,
    activity_type,
    content,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/ops/dashboard/crm");
}