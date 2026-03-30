import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { Resend } from "resend";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type LeadType = "rent" | "buy" | "sell" | "landlord" | "other";
type LeadQuality = "priority_a" | "priority_b" | "priority_c";
type Segment =
  | "medical_center"
  | "rice_student"
  | "relocation"
  | "apartment_locator"
  | "general"
  | "other";
type Language = "en" | "es" | "ar";

type NormalizedLead = {
  leadType: LeadType;
  name: string;
  email: string;
  phone: string;
  message?: string;

  intent?: string;
  timeline?: string;
  source?: string;
  sourceDetail?: string;
  channel?: string;
  segment?: Segment;
  preferredLanguage?: Language;
  area?: string;
  sourcePage?: string;
  sourcePath?: string;
  contactConsent?: boolean;
  ref?: string;
  leadScore?: number;
  priority?: string;

  // rent
  budget?: number;
  moveInDate?: string;
  areas?: string;

  // buy
  priceRange?: string;
  financingStatus?: string;

  // sell
  propertyAddress?: string;
  sellerGoal?: string;

  // landlord
  propertyArea?: string;
  propertyType?: string;
  readyToLease?: string;

  ip?: string | null;
  userAgent?: string | null;
};

type NormalizeLeadResult =
  | { ok: true; lead: NormalizedLead }
  | { ok: false; error: string };

// ---------------------------------------------------------------------------
// Primitive cleaners
// ---------------------------------------------------------------------------

function cleanString(v: unknown, max = 2000): string {
  const s = String(v ?? "").trim();
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
  const plusCount = (normalized.match(/\+/g) ?? []).length;

  if (plusCount > 1) return undefined;
  if (normalized.includes("+") && !normalized.startsWith("+")) return undefined;

  const digits = normalized.replace(/\D/g, "");
  // FIX: guard against empty digits string
  if (!digits || digits.length < 8 || digits.length > 15) return undefined;

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

// ---------------------------------------------------------------------------
// Type guards / coercers
// ---------------------------------------------------------------------------

function isValidLeadType(v: unknown): v is LeadType {
  return v === "rent" || v === "buy" || v === "sell" || v === "landlord" || v === "other";
}

function coerceSegment(v: unknown): Segment | undefined {
  const x = cleanString(v, 80).toLowerCase();
  const valid: Segment[] = [
    "medical_center", "rice_student", "relocation",
    "apartment_locator", "general", "other",
  ];
  return valid.includes(x as Segment) ? (x as Segment) : undefined;
}

function coerceLang(v: unknown): Language | undefined {
  const x = cleanString(v, 12).toLowerCase();
  return x === "en" || x === "es" || x === "ar" ? x : undefined;
}

// ---------------------------------------------------------------------------
// Timeline helper — eliminates repeated logic across the file
// ---------------------------------------------------------------------------

function isUrgentTimeline(timeline?: string): boolean {
  return (
    timeline === "asap" ||
    timeline === "30_days" ||
    timeline === "within_30_days"
  );
}

// ---------------------------------------------------------------------------
// Context extraction helpers
// ---------------------------------------------------------------------------

function getRequestContext(body: Record<string, unknown>) {
  return isRecord(body.requestContext) ? body.requestContext : null;
}

function inferSegmentFromContext(body: Record<string, unknown>): Segment {
  const directSegment = coerceSegment(body.segment);
  if (directSegment) return directSegment;

  const ctx = getRequestContext(body);
  const nestedSegment = coerceSegment(ctx?.segment) ?? coerceSegment(ctx?.contextBucket);
  if (nestedSegment) return nestedSegment;

  const combined = [
    cleanString(body.source_path, 1000),
    cleanString(body.source_page, 500),
    cleanString(body.ref, 120),
  ]
    .join(" ")
    .toLowerCase();

  if (combined.includes("medical")) return "medical_center";
  if (combined.includes("rice")) return "rice_student";
  if (combined.includes("relocation")) return "relocation";
  if (combined.includes("apartment")) return "apartment_locator";
  return "general";
}

// FIX: previous version could return "" and pollute data with empty strings
function getNestedField(
  body: Record<string, unknown>,
  key: string,
  max: number
): string | undefined {
  const ctx = getRequestContext(body);

  const direct = cleanString(body[key], max);
  if (direct) return direct.toLowerCase();

  const nested = cleanString(ctx?.[key], max);
  if (nested) return nested.toLowerCase();

  return undefined;
}

// ---------------------------------------------------------------------------
// Lead normalization
// ---------------------------------------------------------------------------

function normalizeLead(raw: unknown): NormalizeLeadResult {
  if (!isRecord(raw)) return { ok: false, error: "Invalid request body." };

  const body = raw;
  const leadTypeRaw = body.leadType;

  if (!isValidLeadType(leadTypeRaw)) return { ok: false, error: "Invalid lead type." };

  const name = cleanString(body.name, 120);
  const email = cleanEmail(body.email);
  const phone = cleanPhone(body.phone);
  const message = cleanString(body.message, 4000) || undefined;

  if (!name) return { ok: false, error: "Name is required." };
  if (!email || !isValidEmail(email)) return { ok: false, error: "Valid email is required." };
  if (!phone) {
    return {
      ok: false,
      error: "Valid phone is required. Include country code if outside the U.S.",
    };
  }

  const lead: NormalizedLead = {
    leadType: leadTypeRaw,
    name,
    email,
    phone,
    message,
    intent: getNestedField(body, "intent", 40),
    timeline: cleanString(body.timeline, 40).toLowerCase() || undefined,
    source: cleanString(body.source, 80).toLowerCase() || "website",
    sourceDetail: cleanString(body.source_detail, 120).toLowerCase() || undefined,
    channel: cleanString(body.channel, 80).toLowerCase() || undefined,
    segment: inferSegmentFromContext(body),
    preferredLanguage: coerceLang(body.lang) ?? coerceLang(body.preferredLanguage) ?? "en",
    area: getNestedField(body, "area", 120),
    sourcePage: cleanString(body.source_page, 500) || undefined,
    sourcePath: cleanString(body.source_path, 1000) || undefined,
    contactConsent: toBool(body.contactConsent),
    ref: cleanString(body.ref, 120).toLowerCase() || undefined,
    leadScore: toNumber(body.lead_score),
    priority: cleanString(body.priority, 20).toLowerCase() || undefined,
  };

  if (lead.contactConsent !== true) return { ok: false, error: "Contact consent is required." };
  if (!lead.timeline) return { ok: false, error: "Timeline is required." };

  if (leadTypeRaw === "rent") {
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

  if (leadTypeRaw === "buy") {
    lead.priceRange = cleanString(body.priceRange, 120) || undefined;
    lead.financingStatus = cleanString(body.financingStatus, 80).toLowerCase() || undefined;
    lead.areas = cleanString(body.areas, 400) || undefined;

    if (!lead.priceRange) return { ok: false, error: "Price range is required for buyers." };
  }

  if (leadTypeRaw === "sell") {
    lead.propertyAddress = cleanString(body.propertyAddress, 250) || undefined;
    lead.sellerGoal = cleanString(body.sellerGoal, 80).toLowerCase() || undefined;

    if (!lead.propertyAddress) {
      return { ok: false, error: "Property address is required for sellers." };
    }
  }

  if (leadTypeRaw === "landlord") {
    lead.propertyArea = cleanString(body.propertyArea, 120) || undefined;
    lead.propertyType = cleanString(body.propertyType, 80).toLowerCase() || undefined;
    lead.readyToLease = cleanString(body.readyToLease, 20).toLowerCase() || undefined;

    if (!lead.propertyArea) {
      return { ok: false, error: "Property area is required for landlord requests." };
    }
  }

  return { ok: true, lead };
}

// ---------------------------------------------------------------------------
// Routing & scoring
// ---------------------------------------------------------------------------

function routeLead(lead: NormalizedLead): { reasons: string[] } {
  const reasons: string[] = [`lead_type_${lead.leadType}`];

  if (lead.segment) reasons.push(`segment_${lead.segment}`);
  if (lead.preferredLanguage) reasons.push(`lang_${lead.preferredLanguage}`);
  if (lead.area) reasons.push(`area_${lead.area}`);
  if (lead.sourceDetail) reasons.push(`source_detail_${lead.sourceDetail}`);
  if (lead.channel) reasons.push(`channel_${lead.channel}`);
  if (lead.priority) reasons.push(`priority_${lead.priority}`);

  if (lead.leadType === "rent") {
    if ((lead.budget ?? 0) >= 1800) reasons.push("rent_budget_ready");
    if (isUrgentTimeline(lead.timeline)) reasons.push("rent_timeline_active");
  }

  return { reasons };
}

function scoreLeadQuality(lead: NormalizedLead): {
  leadQuality: LeadQuality;
  qualityReasons: string[];
} {
  let score = 0;
  const qualityReasons: string[] = [];

  if (isUrgentTimeline(lead.timeline)) {
    score += 2;
    qualityReasons.push("timeline_urgent");
  } else if (lead.timeline === "1_3_months" || lead.timeline === "3_plus_months") {
    score += 1;
    qualityReasons.push("timeline_defined");
  }

  if (lead.leadType === "rent") {
    if ((lead.budget ?? 0) >= 2500) {
      score += 2;
      qualityReasons.push("rent_budget_2500_plus");
    } else if ((lead.budget ?? 0) >= 1800) {
      score += 1;
      qualityReasons.push("rent_budget_1800_plus");
    }
    if (lead.moveInDate) {
      score += 1;
      qualityReasons.push("rent_move_in_provided");
    }
  }

  if (lead.leadType === "buy") {
    score += 2;
    qualityReasons.push("buyer_lead");

    if (lead.financingStatus === "preapproved" || lead.financingStatus === "cash") {
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

  if (lead.sourceDetail?.includes("priority")) {
    score += 2;
    qualityReasons.push("priority_source_detail");
  } else if (lead.sourceDetail?.includes("seo")) {
    score += 1;
    qualityReasons.push("seo_source_detail");
  }

  if (lead.channel === "organic") qualityReasons.push("channel_organic");

  if ((lead.leadScore ?? 0) >= 80) {
    score += 2;
    qualityReasons.push("lead_score_80_plus");
  } else if ((lead.leadScore ?? 0) >= 60) {
    score += 1;
    qualityReasons.push("lead_score_60_plus");
  }

  if (lead.leadScore !== undefined) qualityReasons.push(`lead_score_${lead.leadScore}`);
  if (lead.priority) qualityReasons.push(`priority_${lead.priority}`);
  if (lead.message && lead.message.length >= 40) {
    score += 1;
    qualityReasons.push("detailed_message");
  }

  if (lead.segment === "medical_center") qualityReasons.push("niche_medical_center");
  if (lead.segment === "rice_student") qualityReasons.push("niche_rice_student");
  if (lead.segment === "relocation") qualityReasons.push("niche_relocation");
  if (lead.preferredLanguage) qualityReasons.push(`lang_${lead.preferredLanguage}`);
  if (lead.area) qualityReasons.push(`area_${lead.area}`);

  const leadQuality: LeadQuality =
    score >= 5 ? "priority_a" : score >= 3 ? "priority_b" : "priority_c";

  return { leadQuality, qualityReasons };
}

// ---------------------------------------------------------------------------
// CRM helpers
// ---------------------------------------------------------------------------

function getNextFollowUpAt(lead: NormalizedLead, leadQuality: LeadQuality): string {
  const addHours = (hours: number) => {
    const d = new Date();
    d.setHours(d.getHours() + hours);
    return d.toISOString();
  };

  const addDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
  };

  if (lead.priority === "high" || leadQuality === "priority_a") return addHours(24);
  if (isUrgentTimeline(lead.timeline)) return addDays(2);
  return addDays(3);
}

function buildPropertyAddressForCrm(lead: NormalizedLead): string {
  if (lead.propertyAddress) return lead.propertyAddress;

  if (lead.leadType === "rent" || lead.leadType === "buy") {
    const parts = [lead.area, lead.areas].filter(Boolean);
    if (parts.length) return parts.join(" | ");
  }

  if (lead.leadType === "landlord") {
    const parts = [lead.propertyArea, lead.propertyType].filter(Boolean);
    if (parts.length) return parts.join(" | ");
  }

  return "Not provided";
}

function buildMotivationForCrm(lead: NormalizedLead): string {
  if (lead.priority === "high") return "high";
  if (isUrgentTimeline(lead.timeline)) return "high";
  if (lead.sellerGoal === "fast_sale") return "high";
  if (lead.readyToLease === "yes") return "high";
  return "medium";
}

function buildNotesForCrm(lead: NormalizedLead): string | null {
  const notes: string[] = [];

  if (lead.message) notes.push(`Message: ${lead.message}`);
  if (lead.intent) notes.push(`Intent: ${lead.intent}`);
  if (lead.financingStatus) notes.push(`Financing: ${lead.financingStatus}`);
  if (lead.sellerGoal) notes.push(`Seller goal: ${lead.sellerGoal}`);
  if (lead.readyToLease) notes.push(`Ready to lease: ${lead.readyToLease}`);
  if (lead.segment) notes.push(`Segment: ${lead.segment}`);

  return notes.length ? notes.join(" | ") : null;
}

function buildCmaNotes(lead: NormalizedLead): string {
  switch (lead.leadType) {
    case "sell":
      return `Seller intake | Goal: ${lead.sellerGoal ?? "-"} | Address: ${lead.propertyAddress ?? "-"}`;
    case "buy":
      return `Buyer intake | Price range: ${lead.priceRange ?? "-"} | Financing: ${lead.financingStatus ?? "-"}`;
    case "rent":
      return `Rental intake | Budget: ${lead.budget ?? "-"} | Move-in: ${lead.moveInDate ?? "-"} | Areas: ${lead.areas ?? "-"}`;
    case "landlord":
      return `Landlord intake | Area: ${lead.propertyArea ?? "-"} | Type: ${lead.propertyType ?? "-"} | Ready: ${lead.readyToLease ?? "-"}`;
    default:
      return `General intake | Type: ${lead.leadType}`;
  }
}

function sanitizeRawForStorage(raw: unknown): Record<string, unknown> {
  if (!isRecord(raw)) return {};

  const body = raw;
  const ctx = getRequestContext(body);

  return {
    leadType: cleanString(body.leadType, 40),
    name: cleanString(body.name, 120),
    email: cleanEmail(body.email),
    phone: cleanString(body.phone, 50),
    message: cleanString(body.message, 4000) || null,
    intent: cleanString(body.intent, 40) || null,
    timeline: cleanString(body.timeline, 40) || null,
    source: cleanString(body.source, 80) || null,
    source_detail: cleanString(body.source_detail, 120) || null,
    channel: cleanString(body.channel, 80) || null,
    segment: cleanString(body.segment, 80) || null,
    preferredLanguage: coerceLang(body.preferredLanguage) ?? null,
    lang: coerceLang(body.lang) ?? null,
    area: cleanString(body.area, 120) || null,
    source_page: cleanString(body.source_page, 500) || null,
    source_path: cleanString(body.source_path, 1000) || null,
    ref: cleanString(body.ref, 120) || null,
    contactConsent: toBool(body.contactConsent) ?? null,
    lead_score: toNumber(body.lead_score) ?? null,
    priority: cleanString(body.priority, 20) || null,
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
    requestContext: ctx
      ? {
          intent: cleanString(ctx.intent, 40) || null,
          area: cleanString(ctx.area, 120) || null,
          segment: cleanString(ctx.segment, 80) || null,
          contextBucket: cleanString(ctx.contextBucket, 80) || null,
        }
      : null,
  };
}

type PersistLeadResult =
  | { ok: true; id: string }
  | { ok: false; error: unknown };

// Isolated CRM payload builder — single source of truth for DB contract
function buildCrmPayload(
  lead: NormalizedLead,
  leadQuality: LeadQuality,
  raw: unknown
) {
  return {
    full_name: lead.name,
    property_address: buildPropertyAddressForCrm(lead),
    phone: lead.phone,
    email: lead.email,
    source: lead.source ?? "website",
    source_detail: lead.sourceDetail ?? null,
    channel: lead.channel ?? null,
    motivation: buildMotivationForCrm(lead),
    priority: lead.priority ?? "medium",
    lead_score: lead.leadScore ?? null,
    lead_quality: leadQuality,
    stage: "new",
    next_follow_up_at: getNextFollowUpAt(lead, leadQuality),
    timeline: lead.timeline ?? null,
    pain_point: buildNotesForCrm(lead),
    cma_notes: buildCmaNotes(lead),
    raw: sanitizeRawForStorage(raw),
  };
}

async function persistLeadToCrm(
  supabase: ReturnType<typeof createSupabaseServiceClient>,
  lead: NormalizedLead,
  leadQuality: LeadQuality,
  raw: unknown
): Promise<PersistLeadResult> {
  const payload = buildCrmPayload(lead, leadQuality, raw);

  const { data, error } = await supabase
    .from("crm_leads")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    // FIX: log full payload on failure so DB mismatches are immediately visible
    console.error("🔥 CRM INSERT FAILED");
    console.error("Payload:", JSON.stringify(payload, null, 2));
    console.error("Supabase error:", JSON.stringify(error, null, 2));
    return { ok: false as const, error };
  }

  return { ok: true as const, id: data?.id as string };
}

async function insertCrmLeadCreatedActivity(
  supabase: ReturnType<typeof createSupabaseServiceClient>,
  params: {
    leadId: string;
    lead: NormalizedLead;
    leadQuality: LeadQuality;
    reasons: string[];
    qualityReasons: string[];
  }
) {
  const content = [
    `Lead created from website intake.`,
    `Type: ${params.lead.leadType}`,
    `Segment: ${params.lead.segment ?? "general"}`,
    `Quality: ${params.leadQuality}`,
    `Reasons: ${params.reasons.join(", ") || "—"}`,
    `Quality reasons: ${params.qualityReasons.join(", ") || "—"}`,
    `Source: ${params.lead.source ?? "website"}`,
    `Source detail: ${params.lead.sourceDetail ?? "—"}`,
    `Channel: ${params.lead.channel ?? "—"}`,
    `Timeline: ${params.lead.timeline ?? "—"}`,
    `Language: ${params.lead.preferredLanguage ?? "—"}`,
    `Area: ${params.lead.area ?? "—"}`,
  ].join(" | ");

  const { error } = await supabase.from("crm_activities").insert({
    lead_id: params.leadId,
    activity_type: "lead_created",
    content,
  });

  if (error) {
    console.error("crm_activities insert failed:", error);
    return { ok: false as const, error };
  }

  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

function formatLeadSummary(
  lead: NormalizedLead,
  reasons: string[],
  leadQuality: LeadQuality,
  qualityReasons: string[],
  id?: string | null
): string {
  const icon =
    leadQuality === "priority_a" ? "🔥" : leadQuality === "priority_b" ? "⚡" : "•";

  const lines: string[] = [
    `${icon} New CRM lead (${lead.leadType.toUpperCase()}) — ${lead.name}`,
  ];

  if (id) lines.push(`CRM Lead ID: ${id}`);
  if (lead.priority) lines.push(`Priority: ${lead.priority}`);
  if (lead.leadScore !== undefined) lines.push(`Lead score: ${lead.leadScore}`);

  lines.push(
    `Segment: ${lead.segment ?? "general"}`,
    `Lead quality: ${leadQuality}`,
    `Routing reasons: ${reasons.join(", ") || "—"}`,
    `Quality reasons: ${qualityReasons.join(", ") || "—"}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`
  );

  if (lead.intent) lines.push(`Intent: ${lead.intent}`);
  if (lead.timeline) lines.push(`Timeline: ${lead.timeline}`);
  if (lead.source) lines.push(`Source: ${lead.source}`);
  if (lead.sourceDetail) lines.push(`Source detail: ${lead.sourceDetail}`);
  if (lead.channel) lines.push(`Channel: ${lead.channel}`);
  if (lead.ref) lines.push(`Ref: ${lead.ref}`);
  if (lead.preferredLanguage) lines.push(`Language: ${lead.preferredLanguage}`);
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
    lines.push("", "Message:", lead.message);
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
    return { ok: false as const, skipped: true as const, error: "Missing email env vars." };
  }

  try {
    const resend = new Resend(apiKey);
    const resp = await resend.emails.send({ from, to, subject: opts.subject, text: opts.text });
    const result = resp as { error?: { message?: string } | null; data?: { id?: string } };

    if (result.error) {
      console.error("Lead email failed:", resp);
      return {
        ok: false as const,
        skipped: false as const,
        error: result.error.message ?? "Resend API returned an unknown error",
      };
    }

    return { ok: true as const, id: result.data?.id ?? null };
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
    return { ok: false as const, skipped: true as const, error: "Missing Telegram env vars." };
  }

  try {
    const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      console.error("Telegram notification failed:", body);
      return { ok: false as const, skipped: false as const, error: body || "Telegram send failed" };
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

// ---------------------------------------------------------------------------
// Request handler
// ---------------------------------------------------------------------------

function getClientIp(req: Request): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? null;
  return req.headers.get("x-real-ip")?.trim() ?? null;
}

export async function POST(req: Request) {
  let raw: unknown;

  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const normalized = normalizeLead(raw);
  if (!normalized.ok) {
    return NextResponse.json({ ok: false, error: normalized.error }, { status: 400 });
  }

  const lead = normalized.lead;
  lead.ip = getClientIp(req);
  lead.userAgent = req.headers.get("user-agent");

  const { reasons } = routeLead(lead);
  const { leadQuality, qualityReasons } = scoreLeadQuality(lead);

  const supabase = createSupabaseServiceClient();
  const persisted = await persistLeadToCrm(supabase, lead, leadQuality, raw);

  if (!persisted.ok) {
    // FIX: surface the error in the response body (not just logs) so callers
    // can see what broke instead of receiving a generic 500
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't save your request right now. Please try again shortly.",
        debug: process.env.NODE_ENV !== "production" ? persisted.error : undefined,
      },
      { status: 500 }
    );
  }

  if (persisted.id) {
    await insertCrmLeadCreatedActivity(supabase, {
      leadId: persisted.id,
      lead,
      leadQuality,
      reasons,
      qualityReasons,
    });
  }

  const summary = formatLeadSummary(lead, reasons, leadQuality, qualityReasons, persisted.id);
  const subject = `New CRM Lead (${lead.leadType.toUpperCase()}) — ${lead.name}`;

  const [telegramResult, emailResult] = await Promise.allSettled([
    sendTelegramNotification(summary),
    sendEmailNotification({ subject, text: summary }),
  ]);

  if (telegramResult.status === "rejected") {
    console.error("Telegram promise rejected:", telegramResult.reason);
  }
  if (emailResult.status === "rejected") {
    console.error("Email promise rejected:", emailResult.reason);
  }

  return NextResponse.json({ ok: true, leadId: persisted.id ?? null });
}
