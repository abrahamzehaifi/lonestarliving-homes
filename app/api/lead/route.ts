// app/api/lead/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { Resend } from "resend";

type LeadType = "rent" | "buy" | "sell" | "landlord" | "other";
type LeadQuality = "priority_a" | "priority_b" | "priority_c";
type Segment =
  | "medical_center"
  | "rice_student"
  | "relocation"
  | "apartment_locator"
  | "general"
  | "other";

type NormalizedLead = {
  leadType: LeadType;
  name: string;
  email: string;
  phone: string;
  message?: string;

  intent?: string;
  timeline?: string;
  source?: string;
  segment?: Segment;
  preferredLanguage?: string;
  lang?: string;
  area?: string;
  sourcePage?: string;
  sourcePath?: string;
  contactConsent?: boolean;
  ref?: string;

  budget?: number;
  moveInDate?: string;
  areas?: string;

  priceRange?: string;
  financingStatus?: string;

  propertyAddress?: string;
  sellerGoal?: string;

  propertyArea?: string;
  propertyType?: string;
  readyToLease?: string;

  ip?: string | null;
  userAgent?: string | null;
};

type NormalizeLeadResult =
  | { ok: true; lead: NormalizedLead }
  | { ok: false; error: string };

function jsonError(status: number, message: string, extra?: unknown) {
  return NextResponse.json(
    {
      ok: false,
      error: message,
      ...(process.env.NODE_ENV !== "production" ? { debug: extra } : {}),
    },
    { status }
  );
}

function cleanString(v: unknown, max = 2000): string {
  const s = String(v ?? "").trim();
  if (!s) return "";
  return s.length > max ? s.slice(0, max) : s;
}

function cleanEmail(v: unknown): string {
  return cleanString(v, 320).toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cleanPhone(v: unknown): string | undefined {
  const s = cleanString(v, 50);
  if (!s) return undefined;

  const normalized = s.replace(/[^\d+()\-\s]/g, "").trim();
  const plusCount = (normalized.match(/\+/g) || []).length;

  if (plusCount > 1) return undefined;
  if (normalized.includes("+") && !normalized.startsWith("+")) return undefined;

  const digits = normalized.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return undefined;

  if (normalized.startsWith("+")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;

  return `+${digits}`;
}

function toNumber(v: unknown): number | undefined {
  const s = cleanString(v, 32);
  if (!s) return undefined;

  const n = Number(s.replace(/,/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

function toBool(v: unknown): boolean | undefined {
  if (typeof v === "boolean") return v;

  const s = cleanString(v, 16).toLowerCase();
  if (!s) return undefined;

  if (["true", "t", "yes", "y", "1", "on"].includes(s)) return true;
  if (["false", "f", "no", "n", "0", "off"].includes(s)) return false;

  return undefined;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

function isValidLeadType(v: unknown): v is LeadType {
  return (
    v === "rent" ||
    v === "buy" ||
    v === "sell" ||
    v === "landlord" ||
    v === "other"
  );
}

function coerceSegment(v: unknown): Segment | undefined {
  const x = cleanString(v, 80).toLowerCase();

  if (
    x === "medical_center" ||
    x === "rice_student" ||
    x === "relocation" ||
    x === "apartment_locator" ||
    x === "general" ||
    x === "other"
  ) {
    return x;
  }

  return undefined;
}

function coerceLang(v: unknown): string | undefined {
  const x = cleanString(v, 12).toLowerCase();
  if (x === "en" || x === "es" || x === "ar") return x;
  return undefined;
}

function inferSegmentFromContext(body: Record<string, unknown>): Segment {
  const directSegment = coerceSegment(body.segment);
  if (directSegment) return directSegment;

  const requestContext = isRecord(body.requestContext) ? body.requestContext : null;

  const nestedSegment =
    coerceSegment(requestContext?.segment) ??
    coerceSegment(requestContext?.contextBucket);

  if (nestedSegment) return nestedSegment;

  const sourcePath = cleanString(body.source_path, 1000).toLowerCase();
  const sourcePage = cleanString(body.source_page, 500).toLowerCase();
  const ref = cleanString(body.ref, 120).toLowerCase();

  const combined = `${sourcePath} ${sourcePage} ${ref}`;

  if (combined.includes("medical")) return "medical_center";
  if (combined.includes("rice")) return "rice_student";
  if (combined.includes("relocation")) return "relocation";
  if (combined.includes("apartment")) return "apartment_locator";

  return "general";
}

function getNestedIntent(body: Record<string, unknown>): string | undefined {
  const requestContext = isRecord(body.requestContext) ? body.requestContext : null;

  return (
    cleanString(body.intent, 40).toLowerCase() ||
    cleanString(requestContext?.intent, 40).toLowerCase() ||
    undefined
  );
}

function getNestedArea(body: Record<string, unknown>): string | undefined {
  const requestContext = isRecord(body.requestContext) ? body.requestContext : null;

  return (
    cleanString(body.area, 120).toLowerCase() ||
    cleanString(requestContext?.area, 120).toLowerCase() ||
    undefined
  );
}

function normalizeLead(raw: unknown): NormalizeLeadResult {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const body = raw as Record<string, unknown>;

  const leadTypeRaw = body.leadType;
  if (!isValidLeadType(leadTypeRaw)) {
    return { ok: false, error: "Invalid lead type." };
  }

  const name = cleanString(body.name, 120);
  const email = cleanEmail(body.email);
  const phone = cleanPhone(body.phone);
  const message = cleanString(body.message, 4000) || undefined;

  if (!name) {
    return { ok: false, error: "Name is required." };
  }

  if (!email || !isValidEmail(email)) {
    return { ok: false, error: "Valid email is required." };
  }

  if (!phone) {
    return {
      ok: false,
      error: "Valid phone is required. Include country code if outside the U.S.",
    };
  }

  const leadType: LeadType = leadTypeRaw;

  const normalizedLang =
    coerceLang(body.lang) ??
    coerceLang(body.preferredLanguage) ??
    "en";

  const lead: NormalizedLead = {
    leadType,
    name,
    email,
    phone,
    message,
    intent: getNestedIntent(body),
    timeline: cleanString(body.timeline, 40).toLowerCase() || undefined,
    source: cleanString(body.source, 80).toLowerCase() || "website",
    segment: inferSegmentFromContext(body),
    preferredLanguage:
      cleanString(body.preferredLanguage, 12).toLowerCase() || normalizedLang,
    lang: normalizedLang,
    area: getNestedArea(body),
    sourcePage: cleanString(body.source_page, 500) || undefined,
    sourcePath: cleanString(body.source_path, 1000) || undefined,
    contactConsent: toBool(body.contactConsent),
    ref: cleanString(body.ref, 120).toLowerCase() || undefined,
  };

  if (lead.contactConsent !== true) {
    return { ok: false, error: "Contact consent is required." };
  }

  if (!lead.timeline) {
    return { ok: false, error: "Timeline is required." };
  }

  if (leadType === "rent") {
    lead.budget = toNumber(body.budget);
    lead.moveInDate = cleanString(body.moveInDate, 120) || undefined;
    lead.areas = cleanString(body.areas, 400) || undefined;

    if (lead.budget === undefined || lead.budget < 500) {
      return { ok: false, error: "Minimum rental budget is $500." };
    }

    if (!lead.moveInDate) {
      return { ok: false, error: "Move-in date is required for rentals." };
    }
  }

  if (leadType === "buy") {
    lead.priceRange = cleanString(body.priceRange, 120) || undefined;
    lead.financingStatus =
      cleanString(body.financingStatus, 80).toLowerCase() || undefined;
    lead.areas = cleanString(body.areas, 400) || undefined;

    if (!lead.priceRange) {
      return { ok: false, error: "Price range is required for buyers." };
    }
  }

  if (leadType === "sell") {
    lead.propertyAddress = cleanString(body.propertyAddress, 250) || undefined;
    lead.sellerGoal = cleanString(body.sellerGoal, 80).toLowerCase() || undefined;

    if (!lead.propertyAddress) {
      return { ok: false, error: "Property address is required for sellers." };
    }
  }

  if (leadType === "landlord") {
    lead.propertyArea = cleanString(body.propertyArea, 120) || undefined;
    lead.propertyType = cleanString(body.propertyType, 80).toLowerCase() || undefined;
    lead.readyToLease = cleanString(body.readyToLease, 20).toLowerCase() || undefined;

    if (!lead.propertyArea) {
      return {
        ok: false,
        error: "Property area is required for landlord requests.",
      };
    }
  }

  return { ok: true, lead };
}

function routeLead(lead: NormalizedLead): { reasons: string[] } {
  const reasons: string[] = [];

  reasons.push(`lead_type_${lead.leadType}`);

  if (lead.segment) {
    reasons.push(`segment_${lead.segment}`);
  }

  if (lead.lang) {
    reasons.push(`lang_${lead.lang}`);
  }

  if (lead.area) {
    reasons.push(`area_${lead.area}`);
  }

  if (lead.leadType === "rent") {
    if ((lead.budget ?? 0) >= 1800) {
      reasons.push("rent_budget_ready");
    }

    if (
      lead.timeline === "asap" ||
      lead.timeline === "30_days" ||
      lead.timeline === "within_30_days"
    ) {
      reasons.push("rent_timeline_active");
    }
  }

  return { reasons };
}

function scoreLeadQuality(
  lead: NormalizedLead
): { leadQuality: LeadQuality; qualityReasons: string[] } {
  let score = 0;
  const qualityReasons: string[] = [];

  if (
    lead.timeline === "asap" ||
    lead.timeline === "30_days" ||
    lead.timeline === "within_30_days"
  ) {
    score += 2;
    qualityReasons.push("timeline_urgent");
  } else if (
    lead.timeline === "1_3_months" ||
    lead.timeline === "3_plus_months"
  ) {
    score += 1;
    qualityReasons.push("timeline_defined");
  }

  if (lead.leadType === "rent") {
    if ((lead.budget ?? 0) >= 1800) {
      score += 1;
      qualityReasons.push("rent_budget_1800_plus");
    }

    if ((lead.budget ?? 0) >= 2500) {
      score += 1;
      qualityReasons.push("rent_budget_2500_plus");
    }

    if (lead.moveInDate) {
      score += 1;
      qualityReasons.push("rent_move_in_provided");
    }
  }

  if (lead.leadType === "buy") {
    score += 2;
    qualityReasons.push("buyer_lead");

    if (
      lead.financingStatus === "preapproved" ||
      lead.financingStatus === "cash"
    ) {
      score += 2;
      qualityReasons.push(`financing_${lead.financingStatus}`);
    } else if (lead.financingStatus === "need_lender") {
      score += 1;
      qualityReasons.push("financing_in_progress");
    }

    if (lead.priceRange) {
      score += 1;
      qualityReasons.push("buyer_budget_defined");
    }
  }

  if (lead.leadType === "sell") {
    score += 2;
    qualityReasons.push("seller_lead");

    if (
      lead.sellerGoal === "max_price" ||
      lead.sellerGoal === "fast_sale" ||
      lead.sellerGoal === "both"
    ) {
      score += 1;
      qualityReasons.push(`seller_goal_${lead.sellerGoal}`);
    }
  }

  if (lead.leadType === "landlord") {
    score += 2;
    qualityReasons.push("landlord_lead");

    if (lead.readyToLease === "yes") {
      score += 1;
      qualityReasons.push("landlord_ready_now");
    }
  }

  if (lead.source === "referral") {
    score += 2;
    qualityReasons.push("referral_source");
  }

  if (lead.message && lead.message.length >= 40) {
    score += 1;
    qualityReasons.push("detailed_message");
  }

  if (lead.segment === "medical_center") {
    qualityReasons.push("niche_medical_center");
  }

  if (lead.segment === "rice_student") {
    qualityReasons.push("niche_rice_student");
  }

  if (lead.segment === "relocation") {
    qualityReasons.push("niche_relocation");
  }

  if (lead.lang) {
    qualityReasons.push(`lang_${lead.lang}`);
  }

  if (lead.area) {
    qualityReasons.push(`area_${lead.area}`);
  }

  if (score >= 5) {
    return { leadQuality: "priority_a", qualityReasons };
  }

  if (score >= 3) {
    return { leadQuality: "priority_b", qualityReasons };
  }

  return { leadQuality: "priority_c", qualityReasons };
}

function getClientIp(req: Request): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || null;

  const realIp = req.headers.get("x-real-ip");
  return realIp?.trim() || null;
}

function sanitizeRawForStorage(raw: unknown) {
  if (!raw || typeof raw !== "object") return {};

  const body = raw as Record<string, unknown>;
  const requestContext = isRecord(body.requestContext) ? body.requestContext : null;

  return {
    leadType: cleanString(body.leadType, 40),
    name: cleanString(body.name, 120),
    email: cleanEmail(body.email),
    phone: cleanString(body.phone, 50),
    message: cleanString(body.message, 4000) || null,

    intent: cleanString(body.intent, 40) || null,
    timeline: cleanString(body.timeline, 40) || null,
    source: cleanString(body.source, 80) || null,
    segment: cleanString(body.segment, 80) || null,
    preferredLanguage: cleanString(body.preferredLanguage, 12) || null,
    lang: cleanString(body.lang, 12) || null,
    area: cleanString(body.area, 120) || null,
    source_page: cleanString(body.source_page, 500) || null,
    source_path: cleanString(body.source_path, 1000) || null,
    ref: cleanString(body.ref, 120) || null,
    contactConsent: toBool(body.contactConsent) ?? null,

    budget: toNumber(body.budget) ?? null,
    moveInDate: cleanString(body.moveInDate, 120) || null,
    areas: cleanString(body.areas, 400) || null,

    priceRange: cleanString(body.priceRange, 120) || null,
    financingStatus: cleanString(body.financingStatus, 80) || null,

    propertyAddress: cleanString(body.propertyAddress, 250) || null,
    sellerGoal: cleanString(body.sellerGoal, 80) || null,

    propertyArea: cleanString(body.propertyArea, 120) || null,
    propertyType: cleanString(body.propertyType, 80) || null,
    readyToLease: cleanString(body.readyToLease, 20) || null,

    requestContext: requestContext
      ? {
          intent: cleanString(requestContext.intent, 40) || null,
          area: cleanString(requestContext.area, 120) || null,
          segment: cleanString(requestContext.segment, 80) || null,
          contextBucket: cleanString(requestContext.contextBucket, 80) || null,
        }
      : null,
  };
}

async function persistLeadToSupabase(
  supabase: ReturnType<typeof createSupabaseServiceClient>,
  lead: NormalizedLead,
  reasons: string[],
  leadQuality: LeadQuality,
  qualityReasons: string[],
  raw: unknown
) {
  const safeRaw = sanitizeRawForStorage(raw);

  const { data, error } = await supabase
    .from("leads")
    .insert({
      segment: lead.segment ?? "general",
      lead_type: lead.leadType,
      reasons,
      lead_quality: leadQuality,
      quality_reasons: qualityReasons,
      status: "new",

      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      message: lead.message ?? null,

      intent: lead.intent ?? null,
      timeline: lead.timeline ?? null,
      source: lead.source ?? "website",
      preferred_language: lead.preferredLanguage ?? null,
      lang: lead.lang ?? null,
      area: lead.area ?? null,
      source_page: lead.sourcePage ?? null,
      source_path: lead.sourcePath ?? null,
      contact_consent: lead.contactConsent ?? null,

      budget: lead.budget ?? null,
      move_in_date: lead.moveInDate ?? null,
      areas: lead.areas ?? null,

      price_range: lead.priceRange ?? null,
      financing_status: lead.financingStatus ?? null,

      property_address: lead.propertyAddress ?? null,
      seller_goal: lead.sellerGoal ?? null,

      property_area: lead.propertyArea ?? null,
      property_type: lead.propertyType ?? null,
      ready_to_lease: lead.readyToLease ?? null,

      ip: lead.ip ?? null,
      user_agent: lead.userAgent ?? null,

      raw: safeRaw,
    })
    .select("id")
    .single();

  if (error) return { ok: false as const, error };
  return { ok: true as const, id: data?.id as string | undefined };
}

async function insertLeadCreatedEvent(
  supabase: ReturnType<typeof createSupabaseServiceClient>,
  params: {
    leadId: string;
    lead: NormalizedLead;
    leadQuality: LeadQuality;
    reasons: string[];
    qualityReasons: string[];
  }
) {
  const { error } = await supabase.from("lead_events").insert({
    lead_id: params.leadId,
    event_type: "lead_created",
    event_label: "Lead submitted",
    event_data: {
      lead_type: params.lead.leadType,
      segment: params.lead.segment ?? "general",
      quality: params.leadQuality,
      reasons: params.reasons,
      quality_reasons: params.qualityReasons,
      source: params.lead.source ?? "website",
      timeline: params.lead.timeline ?? null,
      lang: params.lead.lang ?? null,
      area: params.lead.area ?? null,
      source_page: params.lead.sourcePage ?? null,
      source_path: params.lead.sourcePath ?? null,
      ref: params.lead.ref ?? null,
    },
  });

  if (error) {
    console.error("lead_events insert failed:", error);
    return { ok: false as const, error };
  }

  return { ok: true as const };
}

function formatLeadSummary(
  lead: NormalizedLead,
  reasons: string[],
  leadQuality: LeadQuality,
  qualityReasons: string[],
  id?: string | null
) {
  const icon =
    leadQuality === "priority_a"
      ? "🔥"
      : leadQuality === "priority_b"
      ? "⚡"
      : "•";

  const lines: string[] = [];

  lines.push(`${icon} New lead (${lead.leadType.toUpperCase()}) — ${lead.name}`);
  if (id) lines.push(`Lead ID: ${id}`);
  lines.push(`Segment: ${lead.segment ?? "general"}`);
  lines.push(`Lead quality: ${leadQuality}`);
  lines.push(`Routing reasons: ${reasons.join(", ") || "—"}`);
  lines.push(`Quality reasons: ${qualityReasons.join(", ") || "—"}`);
  lines.push(`Email: ${lead.email}`);
  lines.push(`Phone: ${lead.phone}`);

  if (lead.intent) lines.push(`Intent: ${lead.intent}`);
  if (lead.timeline) lines.push(`Timeline: ${lead.timeline}`);
  if (lead.source) lines.push(`Source: ${lead.source}`);
  if (lead.ref) lines.push(`Ref: ${lead.ref}`);
  if (lead.preferredLanguage) lines.push(`Language: ${lead.preferredLanguage}`);
  if (lead.lang) lines.push(`Lang: ${lead.lang}`);
  if (lead.area) lines.push(`Area: ${lead.area}`);
  if (lead.sourcePage) lines.push(`Source page: ${lead.sourcePage}`);
  if (lead.sourcePath) lines.push(`Source path: ${lead.sourcePath}`);

  if (lead.leadType === "rent") {
    if (lead.budget !== undefined) lines.push(`Budget: $${lead.budget}`);
    if (lead.moveInDate) lines.push(`Move-in: ${lead.moveInDate}`);
    if (lead.areas) lines.push(`Areas: ${lead.areas}`);
  }

  if (lead.leadType === "buy") {
    if (lead.priceRange) lines.push(`Price range: ${lead.priceRange}`);
    if (lead.financingStatus) lines.push(`Financing: ${lead.financingStatus}`);
    if (lead.areas) lines.push(`Areas: ${lead.areas}`);
  }

  if (lead.leadType === "sell") {
    if (lead.propertyAddress) lines.push(`Property address: ${lead.propertyAddress}`);
    if (lead.sellerGoal) lines.push(`Seller goal: ${lead.sellerGoal}`);
  }

  if (lead.leadType === "landlord") {
    if (lead.propertyArea) lines.push(`Property area: ${lead.propertyArea}`);
    if (lead.propertyType) lines.push(`Property type: ${lead.propertyType}`);
    if (lead.readyToLease) lines.push(`Ready to lease: ${lead.readyToLease}`);
  }

  if (lead.message) {
    lines.push("");
    lines.push("Message:");
    lines.push(lead.message);
  }

  return lines.join("\n");
}

async function sendEmailNotification(opts: { subject: string; text: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEADS_FROM_EMAIL;
  const to = process.env.LEADS_TO_EMAIL;

  if (!apiKey || !from || !to) {
    console.error("Email skipped: missing env vars", {
      hasApiKey: Boolean(apiKey),
      hasFrom: Boolean(from),
      hasTo: Boolean(to),
    });

    return {
      ok: false as const,
      skipped: true as const,
      error: "Missing RESEND_API_KEY/LEADS_FROM_EMAIL/LEADS_TO_EMAIL",
    };
  }

  const resend = new Resend(apiKey);

  try {
    const resp = await resend.emails.send({
      from,
      to,
      subject: opts.subject,
      text: opts.text,
    });

    if ((resp as { error?: { message?: string } | null })?.error) {
      const errorMessage =
        (resp as { error?: { message?: string } | null }).error?.message ||
        "Resend API returned an unknown error";

      console.error("Lead email failed:", resp);

      return {
        ok: false as const,
        skipped: false as const,
        error: errorMessage,
      };
    }

    return {
      ok: true as const,
      id: (resp as { data?: { id?: string } })?.data?.id ?? null,
    };
  } catch (e: unknown) {
    console.error("Lead email failed:", e);

    return {
      ok: false as const,
      skipped: false as const,
      error: e instanceof Error ? e.message : "Resend error",
    };
  }
}

async function sendTelegramNotification(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram skipped: missing env vars", {
      hasToken: Boolean(token),
      hasChatId: Boolean(chatId),
    });

    return {
      ok: false as const,
      skipped: true as const,
      error: "Missing TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID",
    };
  }

  try {
    const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      console.error("Telegram notification failed:", body);

      return {
        ok: false as const,
        skipped: false as const,
        error: body || "Telegram send failed",
      };
    }

    return { ok: true as const };
  } catch (e: unknown) {
    console.error("Telegram notification failed:", e);

    return {
      ok: false as const,
      skipped: false as const,
      error: e instanceof Error ? e.message : "Telegram error",
    };
  }
}

export async function POST(req: Request) {
  let raw: unknown;

  try {
    raw = await req.json();
  } catch (e) {
    return jsonError(400, "Invalid JSON body.", e);
  }

  const normalized = normalizeLead(raw);
  if (!normalized.ok) {
    return jsonError(400, normalized.error);
  }

  const lead = normalized.lead;
  lead.ip = getClientIp(req);
  lead.userAgent = req.headers.get("user-agent");

  const { reasons } = routeLead(lead);
  const { leadQuality, qualityReasons } = scoreLeadQuality(lead);

  const supabase = createSupabaseServiceClient();

  const persisted = await persistLeadToSupabase(
    supabase,
    lead,
    reasons,
    leadQuality,
    qualityReasons,
    raw
  );

  if (!persisted.ok) {
    console.error("Lead insert failed:", persisted.error);
    return jsonError(500, "Failed to save lead.", persisted.error);
  }

  if (persisted.id) {
    await insertLeadCreatedEvent(supabase, {
      leadId: persisted.id,
      lead,
      leadQuality,
      reasons,
      qualityReasons,
    });
  }

  const summary = formatLeadSummary(
    lead,
    reasons,
    leadQuality,
    qualityReasons,
    persisted.id ?? null
  );

  const subject = `New Lead (${lead.leadType.toUpperCase()}) — ${lead.name}`;

  const [telegramResult, emailResult] = await Promise.allSettled([
    sendTelegramNotification(summary),
    sendEmailNotification({ subject, text: summary }),
  ]);

  if (telegramResult.status === "rejected") {
    console.error("Telegram notification promise rejected:", telegramResult.reason);
  }

  if (emailResult.status === "rejected") {
    console.error("Email notification promise rejected:", emailResult.reason);
  }

  return NextResponse.json({
    ok: true,
    leadId: persisted.id ?? null,
  });
}