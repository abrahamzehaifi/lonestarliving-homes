import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

function cleanText(value: FormDataEntryValue | null, max = 500): string | null {
  const s = String(value || "").trim();
  if (!s) return null;
  return s.length > max ? s.slice(0, max) : s;
}

function cleanEmail(value: FormDataEntryValue | null): string | null {
  const email = String(value || "").trim().toLowerCase();
  if (!email) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function cleanNumber(value: FormDataEntryValue | null): number | null {
  const raw = String(value || "").trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function addHours(hours: number) {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function getNextFollowUpByStage(stage: string, priority?: string | null) {
  const highPriority = priority === "high";

  if (stage === "new") return highPriority ? addHours(2) : addHours(24);
  if (stage === "contacted") return highPriority ? addHours(24) : addDays(2);
  if (stage === "conversation") return highPriority ? addDays(1) : addDays(3);
  if (stage === "appointment_set") return addDays(1);
  if (stage === "appointment_done") return addDays(2);
  if (stage === "follow_up") return addDays(7);
  if (stage === "listing_signed") return addDays(3);
  if (stage === "nurture") return addDays(7);

  return addDays(3);
}

async function createLead(formData: FormData) {
  "use server";

  const supabase = createSupabaseServiceClient();

  const full_name = cleanText(formData.get("name"), 120);
  const email = cleanEmail(formData.get("email"));
  const phone = cleanText(formData.get("phone"), 40);
  const property_address = cleanText(formData.get("property_address"), 250);

  const allowedSources = [
    "manual",
    "referral",
    "website",
    "open_house",
    "networking",
    "prospecting",
    "expired",
    "withdrawn",
    "terminated",
    "sphere",
  ] as const;

  const rawSource = String(formData.get("source") || "manual").trim().toLowerCase();
  const source = allowedSources.includes(
    rawSource as (typeof allowedSources)[number]
  )
    ? rawSource
    : "manual";

  const allowedPriorities = ["high", "medium", "low"] as const;
  const rawPriority = String(formData.get("priority") || "medium").trim().toLowerCase();
  const priority = allowedPriorities.includes(
    rawPriority as (typeof allowedPriorities)[number]
  )
    ? rawPriority
    : "medium";

  const allowedMotivations = ["high", "medium", "low"] as const;
  const rawMotivation = String(formData.get("motivation") || "medium").trim().toLowerCase();
  const motivation = allowedMotivations.includes(
    rawMotivation as (typeof allowedMotivations)[number]
  )
    ? rawMotivation
    : "medium";

  const lead_score = cleanNumber(formData.get("lead_score"));
  const timeline = cleanText(formData.get("timeline"), 120);
  const cma_notes = cleanText(formData.get("message"), 4000);
  const source_detail = cleanText(formData.get("source_detail"), 120);
  const channel = cleanText(formData.get("channel"), 80)?.toLowerCase() || null;
  const pain_point = cleanText(formData.get("pain_point"), 500);

  if (!full_name || !property_address) {
    throw new Error("Name and property address are required.");
  }

  const stage = "new";
  const next_follow_up_at = getNextFollowUpByStage(stage, priority);

  const payload = {
    full_name,
    property_address,
    phone,
    email,
    source,
    source_detail,
    channel,
    motivation,
    priority,
    lead_score,
    stage,
    next_follow_up_at,
    timeline,
    pain_point,
    cma_notes,
  };

  console.log("CRM INSERT PAYLOAD:", payload);

  const { data, error } = await supabase
    .from("crm_leads")
    .insert(payload)
    .select("id")
    .single();

  if (error || !data?.id) {
    console.error("CRM lead create error:", error);
    return;
  }

  redirect(`/ops/leads/${data.id}`);
}

export default function NewLeadPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f3] text-neutral-950">
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              CRM
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Add Lead
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600">
              Manually add a CRM lead from calls, referrals, networking, HAR conversations,
              open houses, or direct outreach.
            </p>
          </div>

          <Link
            href="/ops/leads"
            className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-medium text-neutral-900 transition hover:border-black/20 hover:bg-white"
          >
            Back to CRM Leads
          </Link>
        </div>

        <form action={createLead} className="rounded-[1.5rem] border border-black/5 bg-white p-6 md:p-8">
          <div className="grid gap-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
                Core details
              </h2>
              <p className="mt-2 text-sm leading-7 text-neutral-600">
                Capture enough information to move the lead immediately into the CRM pipeline.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="name"
                placeholder="Full name"
                required
                className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />

              <input
                name="phone"
                placeholder="Phone"
                className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />

              <input
                name="property_address"
                placeholder="Property address"
                required
                className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />

              <select
                name="source"
                defaultValue="manual"
                className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              >
                <option value="manual">Manual Entry</option>
                <option value="referral">Referral</option>
                <option value="networking">Networking</option>
                <option value="website">Website</option>
                <option value="open_house">Open House</option>
                <option value="prospecting">Prospecting</option>
                <option value="expired">Expired</option>
                <option value="withdrawn">Withdrawn</option>
                <option value="terminated">Terminated</option>
                <option value="sphere">Sphere</option>
              </select>

              <select
                name="priority"
                defaultValue="medium"
                className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
                Qualification
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="timeline"
                placeholder="Timeline (ex: within 2 weeks)"
                className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />

              <input
                name="lead_score"
                placeholder="Lead score"
                type="number"
                min="0"
                max="100"
                className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />

              <select
                name="motivation"
                defaultValue="medium"
                className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              >
                <option value="high">High Motivation</option>
                <option value="medium">Medium Motivation</option>
                <option value="low">Low Motivation</option>
              </select>

              <input
                name="channel"
                placeholder="Channel (ex: outbound, referral)"
                className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
                Operations
              </h2>
            </div>

            <div className="grid gap-4">
              <input
                name="source_detail"
                placeholder="Source detail (ex: expired_batch_1)"
                className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />

              <input
                name="pain_point"
                placeholder="Pain point"
                className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />

              <textarea
                name="message"
                placeholder="Conversation notes / CMA notes..."
                rows={5}
                className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Create Lead
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}