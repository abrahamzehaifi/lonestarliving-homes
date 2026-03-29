import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

type LeadQuality = "priority_a" | "priority_b" | "priority_c";

type CrmLeadDetail = {
  id: string;
  created_at: string | null;
  updated_at: string | null;

  full_name: string | null;
  email: string | null;
  phone: string | null;

  stage: string | null;
  lead_quality: LeadQuality | string | null;
  priority: string | null;
  lead_score: number | null;

  property_address: string | null;
  motivation: string | null;
  source_detail: string | null;
  channel: string | null;
  timeline: string | null;
  pain_point: string | null;

  next_follow_up_at: string | null;
  last_contacted_at: string | null;

  price_expectation: number | null;
  market_low: number | null;
  market_high: number | null;
  recommended_price: number | null;
  cma_notes: string | null;

  closed_at: string | null;
};

type LeadActivity = {
  id: string;
  activity_type: string | null;
  content: string | null;
  created_at: string | null;
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

function getStatusClasses(status: string | null) {
  switch (status) {
    case "new":
      return "bg-blue-50 text-blue-700 ring-blue-100";
    case "contacted":
      return "bg-amber-50 text-amber-700 ring-amber-100";
    case "conversation":
      return "bg-violet-50 text-violet-700 ring-violet-100";
    case "appointment_set":
      return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    case "appointment_done":
      return "bg-teal-50 text-teal-700 ring-teal-100";
    case "follow_up":
      return "bg-orange-50 text-orange-700 ring-orange-100";
    case "listing_signed":
      return "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100";
    case "closed":
      return "bg-green-50 text-green-700 ring-green-100";
    case "lost":
      return "bg-neutral-100 text-neutral-600 ring-neutral-200";
    case "nurture":
      return "bg-sky-50 text-sky-700 ring-sky-100";
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

function TimelineItem({ event }: { event: LeadActivity }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-neutral-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-neutral-950">
            {labelize(event.activity_type)}
          </p>
          <p className="mt-2 text-sm leading-7 text-neutral-700">
            {event.content || "—"}
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
    </div>
  );
}

export default async function DashboardLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("crm_leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const { data: activitiesData, error: activitiesError } = await supabase
    .from("crm_activities")
    .select("id, activity_type, content, created_at")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  if (activitiesError) {
    console.error("crm lead detail activities load failed:", activitiesError);
  }

  const lead = data as CrmLeadDetail;
  const activities = (activitiesData ?? []) as LeadActivity[];

  const createdAgo = timeAgo(lead.created_at);
  const followUpAgo = timeAgo(lead.next_follow_up_at);

  const hasUrgentFollowUp =
    lead.next_follow_up_at && safeDate(lead.next_follow_up_at)
      ? safeDate(lead.next_follow_up_at)!.getTime() < new Date().setHours(0, 0, 0, 0)
      : false;

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-neutral-950">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              CRM
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {lead.full_name || "Unnamed lead"}
              </h1>
              <StatusPill status={lead.stage} />
              <QualityPill quality={lead.lead_quality} />
            </div>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">
              Operational CRM record for qualification, follow-up, notes, and deal movement.
            </p>

            <div className="mt-3 text-sm text-neutral-500">
              Submitted {createdAgo ? `${createdAgo} • ` : ""}
              {formatDateTime(lead.created_at)}
            </div>
          </div>

          <Link
            href="/ops/leads"
            className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-medium text-neutral-900 transition hover:border-black/20 hover:bg-white"
          >
            Back to CRM Leads
          </Link>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-6">
          <SummaryCard label="Stage" value={<StatusPill status={lead.stage} />} />
          <SummaryCard
            label="Lead Quality"
            value={<QualityPill quality={lead.lead_quality} />}
            tone={lead.lead_quality === "priority_a" ? "priority" : "default"}
          />
          <SummaryCard label="Priority" value={labelize(lead.priority)} />
          <SummaryCard label="Lead Score" value={lead.lead_score ?? "—"} />
          <SummaryCard
            label="Next Follow Up"
            value={
              lead.next_follow_up_at
                ? formatDateTime(lead.next_follow_up_at)
                : "—"
            }
            tone={hasUrgentFollowUp ? "urgent" : "default"}
          />
          <SummaryCard
            label="Recommended Price"
            value={formatCurrency(lead.recommended_price)}
            tone="revenue"
          />
        </div>

        <div className="grid gap-6">
          <Section
            title="Lead overview"
            description="High-level CRM details and qualification context."
          >
            <DetailRow label="Created" value={formatDateTime(lead.created_at)} />
            <DetailRow label="Updated" value={formatDateTime(lead.updated_at)} />
            <DetailRow label="Property Address" value={lead.property_address || "—"} />
            <DetailRow label="Motivation" value={labelize(lead.motivation)} />
            <DetailRow label="Timeline" value={labelize(lead.timeline)} />
            <DetailRow label="Pain Point" value={lead.pain_point || "—"} />
            <DetailRow label="Channel" value={labelize(lead.channel)} />
            <DetailRow label="Source Detail" value={lead.source_detail || "—"} />
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
              label="Last Contacted"
              value={formatDateTime(lead.last_contacted_at)}
            />
          </Section>

          <Section
            title="Pricing and CMA"
            description="Pricing strategy and market positioning notes."
          >
            <DetailRow
              label="Price Expectation"
              value={formatCurrency(lead.price_expectation)}
            />
            <DetailRow label="Market Low" value={formatCurrency(lead.market_low)} />
            <DetailRow label="Market High" value={formatCurrency(lead.market_high)} />
            <DetailRow
              label="Recommended Price"
              value={formatCurrency(lead.recommended_price)}
            />
            <DetailRow
              label="CMA Notes"
              value={
                lead.cma_notes ? (
                  <div className="whitespace-pre-wrap text-sm leading-7 text-neutral-900">
                    {lead.cma_notes}
                  </div>
                ) : (
                  "—"
                )
              }
            />
          </Section>

          <Section
            title="Timeline"
            description="CRM activity history for this lead."
          >
            {activities.length === 0 ? (
              <p className="text-sm text-neutral-600">No activity yet.</p>
            ) : (
              activities.map((activity) => (
                <TimelineItem key={activity.id} event={activity} />
              ))
            )}
          </Section>
        </div>
      </section>
    </main>
  );
}