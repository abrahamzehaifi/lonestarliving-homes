import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import LeadStatusSelect from "@/components/dashboard/LeadStatusSelect";
import LeadNotes from "@/components/dashboard/LeadNotes";
import LeadFollowUp from "@/components/dashboard/LeadFollowUp";
import LeadNextAction from "@/components/dashboard/LeadNextAction";
import LeadShowing from "@/components/dashboard/LeadShowing";
import LeadOutcomeForm from "@/components/dashboard/LeadOutcomeForm";

export const dynamic = "force-dynamic";

type LeadQuality = "priority_a" | "priority_b" | "priority_c";

type LeadDetail = {
  id: string;
  created_at: string;
  updated_at: string;

  name: string;
  email: string;
  phone: string | null;

  segment: string | null;
  lead_type: string;
  reasons: string[] | null;

  status: string | null;
  lead_quality: LeadQuality | string | null;
  quality_reasons: string[] | null;

  follow_up_at: string | null;
  showing_at: string | null;
  next_action: string | null;
  closed_at: string | null;

  commission_estimate: number | null;
  commission_actual: number | null;
  outcome_notes: string | null;

  intent: string | null;
  timeline: string | null;
  source: string | null;
  preferred_language: string | null;
  message: string | null;

  credit_score: number | null;
  budget: number | null;
  income_monthly: number | null;
  move_in_date: string | null;
  areas: string | null;
  pets: string | null;
  eviction: boolean | null;
  broken_lease: boolean | null;
  screening_profile: string | null;
  screening_ack: boolean | null;
  contact_consent: boolean | null;

  price_range: string | null;
  financing_status: string | null;

  property_address: string | null;
  seller_goal: string | null;

  property_area: string | null;
  property_type: string | null;
  ready_to_lease: string | null;
};

type LeadNote = {
  id: string;
  note: string;
  created_at: string;
  updated_at: string;
};

type LeadEvent = {
  id: string;
  event_type: string;
  event_label: string | null;
  event_data: Record<string, unknown> | null;
  created_at: string;
};

function safeDate(value: string | null | undefined) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateTime(value: string | null | undefined) {
  const parsed = safeDate(value);
  if (!parsed) return "—";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(parsed);
  } catch {
    return value ?? "—";
  }
}

function formatDateOnly(value: string | null | undefined) {
  const parsed = safeDate(value);
  if (!parsed) return "—";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(parsed);
  } catch {
    return value ?? "—";
  }
}

function formatCurrency(value: number | null | undefined) {
  if (value == null) return "—";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `$${value}`;
  }
}

function timeAgo(value: string | null | undefined) {
  const parsed = safeDate(value);
  if (!parsed) return "";

  const diffMs = Date.now() - parsed.getTime();
  if (Number.isNaN(diffMs) || diffMs < 0) return "";

  const seconds = Math.floor(diffMs / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

function labelize(value: string | null | undefined) {
  if (!value) return "—";

  return value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatBoolean(value: boolean | null | undefined) {
  if (value == null) return "—";
  return value ? "Yes" : "No";
}

function getStatusClasses(status: string | null) {
  switch (status) {
    case "new":
      return "bg-blue-50 text-blue-700 ring-blue-100";
    case "contacted":
      return "bg-amber-50 text-amber-700 ring-amber-100";
    case "qualified":
      return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    case "showing":
      return "bg-violet-50 text-violet-700 ring-violet-100";
    case "application":
      return "bg-orange-50 text-orange-700 ring-orange-100";
    case "closed":
      return "bg-green-50 text-green-700 ring-green-100";
    case "lost":
      return "bg-neutral-100 text-neutral-600 ring-neutral-200";
    default:
      return "bg-neutral-100 text-neutral-700 ring-neutral-200";
  }
}

function getQualityClasses(quality: string | null) {
  switch (quality) {
    case "priority_a":
      return "bg-neutral-950 text-white ring-neutral-950/10";
    case "priority_b":
      return "bg-sky-50 text-sky-700 ring-sky-100";
    case "priority_c":
      return "bg-neutral-100 text-neutral-600 ring-neutral-200";
    default:
      return "bg-neutral-100 text-neutral-700 ring-neutral-200";
  }
}

function StatusPill({ status }: { status: string | null }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
        status
      )}`}
    >
      {labelize(status)}
    </span>
  );
}

function QualityPill({ quality }: { quality: string | null }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getQualityClasses(
        quality
      )}`}
    >
      {quality === "priority_a"
        ? "Priority A"
        : quality === "priority_b"
        ? "Priority B"
        : quality === "priority_c"
        ? "Priority C"
        : "—"}
    </span>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-4">
      <div className="text-sm font-medium text-neutral-500">{label}</div>
      <div className="text-sm text-neutral-900">{value ?? "—"}</div>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-black/5 bg-white p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-7 text-neutral-600">{description}</p>
        ) : null}
      </div>

      <div className="grid gap-5">{children}</div>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  tone?: "default" | "priority" | "revenue" | "urgent";
}) {
  const toneClasses =
    tone === "priority"
      ? "border-neutral-950/10 bg-neutral-950 text-white"
      : tone === "revenue"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "urgent"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-black/5 bg-white text-neutral-950";

  return (
    <div className={`rounded-2xl border p-4 ${toneClasses}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-80">
        {label}
      </p>
      <div className="mt-2 text-sm font-medium">{value}</div>
    </div>
  );
}

function TagList({ values }: { values: string[] | null | undefined }) {
  if (!values || values.length === 0) {
    return <span>—</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <span
          key={value}
          className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700"
        >
          {labelize(value)}
        </span>
      ))}
    </div>
  );
}

function TimelineItem({ event }: { event: LeadEvent }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-neutral-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-neutral-950">
            {event.event_label || labelize(event.event_type)}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-neutral-500">
            {labelize(event.event_type)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-neutral-700">
            {formatDateTime(event.created_at)}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {timeAgo(event.created_at)}
          </p>
        </div>
      </div>

      {event.event_data ? (
        <div className="mt-3 rounded-xl border border-black/5 bg-white p-3">
          <pre className="whitespace-pre-wrap break-words text-xs leading-6 text-neutral-600">
            {JSON.stringify(event.event_data, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}

function isRentalLead(leadType: string | null | undefined) {
  return leadType === "rent";
}

function isBuyerLead(leadType: string | null | undefined) {
  return leadType === "buy";
}

function isSellerLead(leadType: string | null | undefined) {
  return leadType === "sell";
}

function isLandlordLead(leadType: string | null | undefined) {
  return leadType === "landlord";
}

export default async function DashboardLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("leads")
    .select(
      `
      id,
      created_at,
      updated_at,
      name,
      email,
      phone,
      segment,
      lead_type,
      reasons,
      status,
      lead_quality,
      quality_reasons,
      follow_up_at,
      showing_at,
      next_action,
      closed_at,
      commission_estimate,
      commission_actual,
      outcome_notes,
      intent,
      timeline,
      source,
      preferred_language,
      message,
      credit_score,
      budget,
      income_monthly,
      move_in_date,
      areas,
      pets,
      eviction,
      broken_lease,
      screening_profile,
      screening_ack,
      contact_consent,
      price_range,
      financing_status,
      property_address,
      seller_goal,
      property_area,
      property_type,
      ready_to_lease
      `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const { data: notesData, error: notesError } = await supabase
    .from("lead_notes")
    .select("id, note, created_at, updated_at")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  if (notesError) {
    console.error("lead detail notes load failed:", notesError);
  }

  const { data: eventsData, error: eventsError } = await supabase
    .from("lead_events")
    .select("id, event_type, event_label, event_data, created_at")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  if (eventsError) {
    console.error("lead detail events load failed:", eventsError);
  }

  const notes = (notesData ?? []) as LeadNote[];
  const events = (eventsData ?? []) as LeadEvent[];
  const lead = data as LeadDetail;

  const createdAgo = timeAgo(lead.created_at);
  const followUpAgo = timeAgo(lead.follow_up_at);
  const isRental = isRentalLead(lead.lead_type);
  const isBuyer = isBuyerLead(lead.lead_type);
  const isSeller = isSellerLead(lead.lead_type);
  const isLandlord = isLandlordLead(lead.lead_type);

  const hasUrgentFollowUp =
    lead.follow_up_at && safeDate(lead.follow_up_at)
      ? safeDate(lead.follow_up_at)!.getTime() < new Date().setHours(0, 0, 0, 0)
      : false;

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-neutral-950">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              Dashboard
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {lead.name}
              </h1>
              <StatusPill status={lead.status} />
              <QualityPill quality={lead.lead_quality} />
            </div>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">
              Operational lead record for qualification, follow-up, notes, and
              transaction movement.
            </p>

            <div className="mt-3 text-sm text-neutral-500">
              Submitted {createdAgo ? `${createdAgo} • ` : ""}
              {formatDateTime(lead.created_at)}
            </div>
          </div>

          <Link
            href="/dashboard/leads"
            className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-medium text-neutral-900 transition hover:border-black/20 hover:bg-white"
          >
            Back to leads
          </Link>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-6">
          <SummaryCard label="Lead Type" value={labelize(lead.lead_type)} />
          <SummaryCard label="Status" value={<StatusPill status={lead.status} />} />
          <SummaryCard
            label="Lead Quality"
            value={<QualityPill quality={lead.lead_quality} />}
            tone={lead.lead_quality === "priority_a" ? "priority" : "default"}
          />
          <SummaryCard label="Segment" value={labelize(lead.segment)} />
          <SummaryCard
            label="Next Follow Up"
            value={lead.follow_up_at ? formatDateTime(lead.follow_up_at) : "—"}
            tone={hasUrgentFollowUp ? "urgent" : "default"}
          />
          <SummaryCard
            label="Commission Estimate"
            value={formatCurrency(lead.commission_estimate)}
            tone="revenue"
          />
        </div>

        <div className="grid gap-6">
          <Section
            title="Lead overview"
            description="High-level intake details, priority context, and pipeline controls."
          >
            <DetailRow label="Created" value={formatDateTime(lead.created_at)} />
            <DetailRow label="Updated" value={formatDateTime(lead.updated_at)} />
            <DetailRow label="Lead Type" value={labelize(lead.lead_type)} />
            <DetailRow label="Intent" value={labelize(lead.intent)} />
            <DetailRow label="Timeline" value={labelize(lead.timeline)} />
            <DetailRow label="Source" value={labelize(lead.source)} />
            <DetailRow label="Segment" value={labelize(lead.segment)} />
            <DetailRow
              label="Preferred Language"
              value={labelize(lead.preferred_language)}
            />
            <DetailRow
              label="Routing Reasons"
              value={<TagList values={lead.reasons} />}
            />
            <DetailRow
              label="Quality Reasons"
              value={<TagList values={lead.quality_reasons} />}
            />

            <div className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-4">
              <div className="text-sm font-medium text-neutral-500">Status</div>
              <div>
                <LeadStatusSelect leadId={lead.id} currentStatus={lead.status} />
              </div>
            </div>

            <div className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-4">
              <div className="text-sm font-medium text-neutral-500">
                Next Follow Up
              </div>
              <div>
                <LeadFollowUp leadId={lead.id} followUpAt={lead.follow_up_at} />
                {lead.follow_up_at ? (
                  <p className="mt-2 text-xs text-neutral-500">
                    {followUpAgo ? `${followUpAgo} • ` : ""}
                    {formatDateTime(lead.follow_up_at)}
                  </p>
                ) : null}
              </div>
            </div>
          </Section>

          <Section
            title="Contact information"
            description="Direct outreach details for immediate contact."
          >
            <DetailRow
              label="Email"
              value={
                lead.email ? (
                  <a
                    href={`mailto:${lead.email}`}
                    className="break-all text-neutral-950 underline underline-offset-4 hover:text-neutral-700"
                  >
                    {lead.email}
                  </a>
                ) : (
                  "—"
                )
              }
            />

            <DetailRow
              label="Phone"
              value={
                lead.phone ? (
                  <a
                    href={`tel:${lead.phone}`}
                    className="text-neutral-950 underline underline-offset-4 hover:text-neutral-700"
                  >
                    {lead.phone}
                  </a>
                ) : (
                  "—"
                )
              }
            />

            <DetailRow
              label="Consent To Contact"
              value={formatBoolean(lead.contact_consent)}
            />
          </Section>

          {isRental ? (
            <Section
              title="Rental qualification"
              description="Leasing-specific intake fields used to qualify, search inventory, and move toward showings and application."
            >
              <DetailRow label="Budget" value={formatCurrency(lead.budget)} />
              <DetailRow
                label="Monthly Income"
                value={formatCurrency(lead.income_monthly)}
              />
              <DetailRow label="Credit Score" value={lead.credit_score ?? "—"} />
              <DetailRow
                label="Move-in Date"
                value={formatDateOnly(lead.move_in_date)}
              />
              <DetailRow label="Areas" value={lead.areas || "—"} />
              <DetailRow label="Pets" value={lead.pets || "—"} />
              <DetailRow
                label="Screening Profile"
                value={labelize(lead.screening_profile)}
              />
              <DetailRow
                label="Screening Acknowledged"
                value={formatBoolean(lead.screening_ack)}
              />
              <DetailRow
                label="Prior Eviction"
                value={formatBoolean(lead.eviction)}
              />
              <DetailRow
                label="Broken Lease"
                value={formatBoolean(lead.broken_lease)}
              />
            </Section>
          ) : null}

          {isBuyer ? (
            <Section
              title="Buyer qualification"
              description="Purchase-specific criteria and financing readiness."
            >
              <DetailRow label="Price Range" value={lead.price_range || "—"} />
              <DetailRow
                label="Financing Status"
                value={labelize(lead.financing_status)}
              />
              <DetailRow label="Areas" value={lead.areas || "—"} />
            </Section>
          ) : null}

          {isSeller ? (
            <Section
              title="Seller qualification"
              description="Seller-specific property and objective details."
            >
              <DetailRow
                label="Property Address"
                value={lead.property_address || "—"}
              />
              <DetailRow label="Seller Goal" value={labelize(lead.seller_goal)} />
            </Section>
          ) : null}

          {isLandlord ? (
            <Section
              title="Landlord qualification"
              description="Landlord-specific property and readiness details."
            >
              <DetailRow label="Property Area" value={lead.property_area || "—"} />
              <DetailRow
                label="Property Type"
                value={labelize(lead.property_type)}
              />
              <DetailRow
                label="Ready To Lease"
                value={labelize(lead.ready_to_lease)}
              />
            </Section>
          ) : null}

          {!isRental && !isBuyer && !isSeller && !isLandlord ? (
            <Section
              title="Qualification details"
              description="General structured intake fields for this lead."
            >
              <DetailRow label="Budget" value={formatCurrency(lead.budget)} />
              <DetailRow
                label="Monthly Income"
                value={formatCurrency(lead.income_monthly)}
              />
              <DetailRow label="Credit Score" value={lead.credit_score ?? "—"} />
              <DetailRow
                label="Move-in Date"
                value={formatDateOnly(lead.move_in_date)}
              />
              <DetailRow label="Areas" value={lead.areas || "—"} />
              <DetailRow label="Pets" value={lead.pets || "—"} />
              <DetailRow
                label="Screening Profile"
                value={labelize(lead.screening_profile)}
              />
              <DetailRow
                label="Price Range"
                value={lead.price_range || "—"}
              />
              <DetailRow
                label="Financing Status"
                value={labelize(lead.financing_status)}
              />
              <DetailRow
                label="Property Address"
                value={lead.property_address || "—"}
              />
              <DetailRow
                label="Seller Goal"
                value={labelize(lead.seller_goal)}
              />
              <DetailRow label="Property Area" value={lead.property_area || "—"} />
              <DetailRow
                label="Property Type"
                value={labelize(lead.property_type)}
              />
              <DetailRow
                label="Ready To Lease"
                value={labelize(lead.ready_to_lease)}
              />
            </Section>
          ) : null}

          <Section
            title="Showing"
            description="Schedule, move, or clear the showing step for this lead."
          >
            <DetailRow
              label="Scheduled"
              value={lead.showing_at ? formatDateTime(lead.showing_at) : "—"}
            />

            <div className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-4">
              <div className="text-sm font-medium text-neutral-500">Update</div>
              <div>
                <LeadShowing leadId={lead.id} showingAt={lead.showing_at} />
              </div>
            </div>
          </Section>

          <Section
            title="Next action"
            description="Define the immediate next step so the lead remains operationally clear."
          >
            <DetailRow
              label="Current"
              value={
                lead.next_action ? (
                  <div className="whitespace-pre-wrap text-sm leading-7 text-neutral-900">
                    {lead.next_action}
                  </div>
                ) : (
                  "—"
                )
              }
            />

            <div className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-4">
              <div className="text-sm font-medium text-neutral-500">Update</div>
              <div>
                <LeadNextAction
                  leadId={lead.id}
                  nextAction={lead.next_action}
                />
              </div>
            </div>
          </Section>

          <Section
            title="Outcome and revenue"
            description="Closed-deal tracking, revenue visibility, and outcome notes."
          >
            <DetailRow
              label="Closed At"
              value={lead.closed_at ? formatDateTime(lead.closed_at) : "—"}
            />
            <DetailRow
              label="Commission Estimate"
              value={formatCurrency(lead.commission_estimate)}
            />
            <DetailRow
              label="Commission Actual"
              value={formatCurrency(lead.commission_actual)}
            />
            <DetailRow
              label="Outcome Notes"
              value={
                lead.outcome_notes ? (
                  <div className="whitespace-pre-wrap text-sm leading-7 text-neutral-900">
                    {lead.outcome_notes}
                  </div>
                ) : (
                  "—"
                )
              }
            />

            <div className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-4">
              <div className="text-sm font-medium text-neutral-500">Update</div>
              <div>
                <LeadOutcomeForm
                  leadId={lead.id}
                  closedAt={lead.closed_at}
                  commissionEstimate={lead.commission_estimate}
                  commissionActual={lead.commission_actual}
                  outcomeNotes={lead.outcome_notes}
                />
              </div>
            </div>
          </Section>

          <Section
            title="Original message"
            description="Original submission text captured from the intake form."
          >
            <div className="rounded-2xl border border-black/5 bg-neutral-50 p-5">
              <div className="whitespace-pre-wrap text-sm leading-7 text-neutral-900">
                {lead.message || "—"}
              </div>
            </div>
          </Section>

          <Section
            title="Timeline"
            description="Operational history for this lead."
          >
            {events.length === 0 ? (
              <p className="text-sm text-neutral-600">No timeline events yet.</p>
            ) : (
              events.map((event) => <TimelineItem key={event.id} event={event} />)
            )}
          </Section>

          <LeadNotes leadId={lead.id} notes={notes} />
        </div>
      </section>
    </main>
  );
}