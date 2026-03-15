import type { ReactNode } from "react";
import Link from "next/link";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import LeadQuickActions from "@/components/dashboard/LeadQuickActions";

export const dynamic = "force-dynamic";

type LeadRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  lead_type: string;
  status: string | null;
  lead_quality: string | null;
  follow_up_at: string | null;
  next_action: string | null;
  timeline: string | null;
  source: string | null;
  segment: string | null;
  commission_estimate: number | null;
  commission_actual: number | null;
};

type LeadEventRow = {
  lead_id: string;
  event_type: string;
  event_data: Record<string, unknown> | null;
  created_at: string;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";

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

function formatCurrency(value: number) {
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

function formatPercent(numerator: number, denominator: number) {
  if (denominator <= 0) return "—";
  const value = (numerator / denominator) * 100;
  return `${Math.round(value)}%`;
}

function safeTime(value: string | null | undefined) {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

function daysSince(value: string | null | undefined) {
  const time = safeTime(value);
  if (time == null) return null;

  const diffMs = Date.now() - time;
  if (diffMs < 0) return 0;

  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function timeAgo(value: string | null | undefined) {
  if (!value) return "";

  const timestamp = safeTime(value);
  if (timestamp == null) return "";

  const diffMs = Date.now() - timestamp;
  if (diffMs < 0) return "";

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

function getEventStatusTo(event: LeadEventRow) {
  const to = event.event_data?.to;
  return typeof to === "string" ? to : null;
}

function getLatestStageEnteredAt(
  events: LeadEventRow[],
  leadId: string,
  stage: "qualified" | "showing" | "application"
) {
  const matching = events
    .filter(
      (event) =>
        event.lead_id === leadId &&
        event.event_type === "status_changed" &&
        getEventStatusTo(event) === stage
    )
    .sort(
      (a, b) => (safeTime(b.created_at) ?? 0) - (safeTime(a.created_at) ?? 0)
    );

  return matching[0]?.created_at ?? null;
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

function SummaryCard({
  label,
  value,
  href,
  tone = "default",
}: {
  label: string;
  value: number | string;
  href?: string;
  tone?: "default" | "urgent" | "priority" | "revenue";
}) {
  const toneClasses =
    tone === "urgent"
      ? "border-red-200 bg-red-50 text-red-700"
      : tone === "priority"
      ? "border-neutral-950/10 bg-neutral-950 text-white"
      : tone === "revenue"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-black/5 bg-white text-neutral-950";

  const content = (
    <div className={`rounded-2xl border p-4 ${toneClasses}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-80">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="transition hover:opacity-90">
      {content}
    </Link>
  );
}

function LeadCard({
  lead,
  badge,
}: {
  lead: LeadRow;
  badge?: ReactNode;
}) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStartMs = todayStart.getTime();
  const followUpMs = safeTime(lead.follow_up_at);

  const overdue =
    followUpMs != null &&
    followUpMs < todayStartMs &&
    lead.status !== "closed" &&
    lead.status !== "lost";

  return (
    <div
      className={`rounded-[1.5rem] border p-5 ${
        overdue ? "border-red-200 bg-red-50/60" : "border-black/5 bg-white"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/dashboard/leads/${lead.id}`}
            className="text-base font-semibold tracking-tight text-neutral-950 underline-offset-4 hover:underline"
          >
            {lead.name}
          </Link>

          <div className="mt-2 flex flex-wrap gap-2">
            <StatusPill status={lead.status} />
            <QualityPill quality={lead.lead_quality} />
            {badge}
          </div>
        </div>

        <div className="text-sm text-neutral-500">
          {formatDate(lead.created_at)}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Lead
          </p>
          <p className="mt-1 text-sm text-neutral-800">
            {labelize(lead.lead_type)} • {labelize(lead.segment)}
          </p>
          <p className="mt-1 text-sm text-neutral-600">{lead.email || "—"}</p>
          <p className="mt-1 text-sm text-neutral-600">{lead.phone || "—"}</p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Next Action
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-neutral-800">
            {lead.next_action || "—"}
          </p>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Follow Up
          </p>
          <p className="mt-1 text-sm text-neutral-800">
            {lead.follow_up_at ? formatDate(lead.follow_up_at) : "—"}
          </p>
          {lead.follow_up_at ? (
            <p className="mt-1 text-xs text-neutral-500">
              {timeAgo(lead.follow_up_at)}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Estimated Commission
          </p>
          <p className="mt-1 text-sm text-neutral-800">
            {lead.commission_estimate != null
              ? formatCurrency(lead.commission_estimate)
              : "—"}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Actual Commission
          </p>
          <p className="mt-1 text-sm text-neutral-800">
            {lead.commission_actual != null
              ? formatCurrency(lead.commission_actual)
              : "—"}
          </p>
        </div>
      </div>

      <LeadQuickActions leadId={lead.id} currentStatus={lead.status} />

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/dashboard/leads/${lead.id}`}
          className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Open lead
        </Link>

        <Link
          href="/dashboard/leads"
          className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 px-4 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
        >
          Full queue
        </Link>
      </div>
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
    <section className="rounded-[1.75rem] border border-black/5 bg-white p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-7 text-neutral-600">{description}</p>
        ) : null}
      </div>

      <div className="grid gap-4">{children}</div>
    </section>
  );
}

export default async function OpsTodayPage() {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("leads")
    .select(
      "id, created_at, name, email, phone, lead_type, status, lead_quality, follow_up_at, next_action, timeline, source, segment, commission_estimate, commission_actual"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  const allLeads = (data ?? []) as LeadRow[];

  const leadIds = allLeads.map((lead) => lead.id);

  const { data: eventsData, error: eventsError } =
    leadIds.length === 0
      ? { data: [], error: null }
      : await supabase
          .from("lead_events")
          .select("lead_id, event_type, event_data, created_at")
          .in("lead_id", leadIds);

  if (eventsError) {
    console.error("ops today events load failed:", eventsError);
  }

  const allEvents = (eventsData ?? []) as LeadEventRow[];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStartMs = today.getTime();

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStartMs = tomorrow.getTime();

  function isActiveLead(lead: LeadRow) {
    return lead.status !== "closed" && lead.status !== "lost";
  }

  function isFollowUpToday(lead: LeadRow) {
    if (!lead.follow_up_at || !isActiveLead(lead)) return false;
    const time = safeTime(lead.follow_up_at);
    if (time == null) return false;
    return time >= todayStartMs && time < tomorrowStartMs;
  }

  function isFollowUpOverdue(lead: LeadRow) {
    if (!lead.follow_up_at || !isActiveLead(lead)) return false;
    const time = safeTime(lead.follow_up_at);
    if (time == null) return false;
    return time < todayStartMs;
  }

  function byFollowUpSoonest(a: LeadRow, b: LeadRow) {
    const aTime = safeTime(a.follow_up_at);
    const bTime = safeTime(b.follow_up_at);

    if (aTime != null && bTime != null) {
      return aTime - bTime;
    }
    if (aTime != null && bTime == null) return -1;
    if (aTime == null && bTime != null) return 1;

    const aCreated = safeTime(a.created_at) ?? 0;
    const bCreated = safeTime(b.created_at) ?? 0;
    return bCreated - aCreated;
  }

  const overdueFollowUps = allLeads
    .filter(isFollowUpOverdue)
    .sort(byFollowUpSoonest);

  const todayFollowUps = allLeads
    .filter(isFollowUpToday)
    .sort(byFollowUpSoonest);

  const newLeads = allLeads
    .filter((lead) => lead.status === "new")
    .sort((a, b) => (safeTime(b.created_at) ?? 0) - (safeTime(a.created_at) ?? 0));

  const priorityALeads = allLeads
    .filter(
      (lead) => lead.lead_quality === "priority_a" && isActiveLead(lead)
    )
    .sort((a, b) => (safeTime(b.created_at) ?? 0) - (safeTime(a.created_at) ?? 0));

  const openEstimatedCommission = allLeads
    .filter(isActiveLead)
    .reduce((sum, lead) => sum + (lead.commission_estimate ?? 0), 0);

  const qualifiedEstimatedCommission = allLeads
    .filter((lead) => lead.status === "qualified")
    .reduce((sum, lead) => sum + (lead.commission_estimate ?? 0), 0);

  const showingEstimatedCommission = allLeads
    .filter((lead) => lead.status === "showing")
    .reduce((sum, lead) => sum + (lead.commission_estimate ?? 0), 0);

  const applicationEstimatedCommission = allLeads
    .filter((lead) => lead.status === "application")
    .reduce((sum, lead) => sum + (lead.commission_estimate ?? 0), 0);

  const closedActualCommission = allLeads
    .filter((lead) => lead.status === "closed")
    .reduce((sum, lead) => sum + (lead.commission_actual ?? 0), 0);

  const statusCounts = {
    all: allLeads.length,
    new: allLeads.filter((lead) => lead.status === "new").length,
    contacted: allLeads.filter((lead) => lead.status === "contacted").length,
    qualified: allLeads.filter((lead) => lead.status === "qualified").length,
    showing: allLeads.filter((lead) => lead.status === "showing").length,
    application: allLeads.filter((lead) => lead.status === "application").length,
    closed: allLeads.filter((lead) => lead.status === "closed").length,
    lost: allLeads.filter((lead) => lead.status === "lost").length,
  };

  const conversionMetrics = [
    {
      label: "New → Contacted",
      value: formatPercent(statusCounts.contacted, statusCounts.new),
    },
    {
      label: "Contacted → Qualified",
      value: formatPercent(statusCounts.qualified, statusCounts.contacted),
    },
    {
      label: "Qualified → Showing",
      value: formatPercent(statusCounts.showing, statusCounts.qualified),
    },
    {
      label: "Showing → Application",
      value: formatPercent(statusCounts.application, statusCounts.showing),
    },
    {
      label: "Application → Closed",
      value: formatPercent(statusCounts.closed, statusCounts.application),
    },
  ];

  const leadsWithNoNextAction = allLeads.filter(
    (lead) => isActiveLead(lead) && !lead.next_action?.trim()
  );

  const qualifiedStaleLeads = allLeads.filter((lead) => {
    if (lead.status !== "qualified") return false;
    const enteredAt = getLatestStageEnteredAt(allEvents, lead.id, "qualified");
    const age = daysSince(enteredAt ?? lead.created_at);
    return age != null && age >= 7;
  });

  const showingStaleLeads = allLeads.filter((lead) => {
    if (lead.status !== "showing") return false;
    const enteredAt = getLatestStageEnteredAt(allEvents, lead.id, "showing");
    const age = daysSince(enteredAt ?? lead.created_at);
    return age != null && age >= 7;
  });

  const applicationStaleLeads = allLeads.filter((lead) => {
    if (lead.status !== "application") return false;
    const enteredAt = getLatestStageEnteredAt(allEvents, lead.id, "application");
    const age = daysSince(enteredAt ?? lead.created_at);
    return age != null && age >= 5;
  });

  function stageEntryBadge(
    lead: LeadRow,
    stage: "qualified" | "showing" | "application",
    label: string,
    className: string
  ) {
    const enteredAt = getLatestStageEnteredAt(allEvents, lead.id, stage);
    const age = daysSince(enteredAt ?? lead.created_at);
    const ageText = age == null ? label : `${label} • ${age}d in stage`;

    return (
      <span
        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium text-white ${className}`}
      >
        {ageText}
      </span>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-neutral-950">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            Operations
          </p>
          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Today
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">
                Action-first view for follow-ups, high-priority pipeline work,
                stage-based revenue visibility, conversion tracking, and stuck
                pipeline detection.
              </p>
            </div>

            <Link
              href="/dashboard/leads"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-medium text-neutral-900 transition hover:border-black/20 hover:bg-white"
            >
              Open full lead queue
            </Link>
          </div>
        </div>

        {error ? (
          <div className="rounded-[1.75rem] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Failed to load today view.
          </div>
        ) : (
          <>
            <div className="mb-8 grid gap-4 md:grid-cols-6">
              <SummaryCard
                label="Overdue Follow Ups"
                value={overdueFollowUps.length}
                href="/dashboard/leads?followup=overdue"
                tone="urgent"
              />
              <SummaryCard
                label="Follow Ups Today"
                value={todayFollowUps.length}
                href="/dashboard/leads?followup=today"
              />
              <SummaryCard
                label="New Leads"
                value={newLeads.length}
                href="/dashboard/leads?status=new"
              />
              <SummaryCard
                label="Priority A Leads"
                value={priorityALeads.length}
                href="/dashboard/leads?quality=priority_a"
                tone="priority"
              />
              <SummaryCard
                label="Open Estimated Pipeline"
                value={formatCurrency(openEstimatedCommission)}
                tone="revenue"
              />
              <SummaryCard
                label="Closed Actual Revenue"
                value={formatCurrency(closedActualCommission)}
                tone="revenue"
              />
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-4">
              <SummaryCard
                label="Qualified Est."
                value={formatCurrency(qualifiedEstimatedCommission)}
                tone="revenue"
              />
              <SummaryCard
                label="Showing Est."
                value={formatCurrency(showingEstimatedCommission)}
                tone="revenue"
              />
              <SummaryCard
                label="Application Est."
                value={formatCurrency(applicationEstimatedCommission)}
                tone="revenue"
              />
              <SummaryCard
                label="Closed Actual"
                value={formatCurrency(closedActualCommission)}
                tone="revenue"
              />
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-5">
              {conversionMetrics.map((metric) => (
                <SummaryCard
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                />
              ))}
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-5">
              <SummaryCard
                label="No Next Action"
                value={leadsWithNoNextAction.length}
                tone="urgent"
              />
              <SummaryCard
                label="Overdue Follow Ups"
                value={overdueFollowUps.length}
                tone="urgent"
              />
              <SummaryCard
                label="Qualified 7+ Days"
                value={qualifiedStaleLeads.length}
              />
              <SummaryCard
                label="Showing 7+ Days"
                value={showingStaleLeads.length}
              />
              <SummaryCard
                label="Application 5+ Days"
                value={applicationStaleLeads.length}
              />
            </div>

            <div className="grid gap-6">
              <Section
                title="Overdue follow ups"
                description="These leads already needed contact before today."
              >
                {overdueFollowUps.length === 0 ? (
                  <p className="text-sm text-neutral-600">No overdue follow-ups.</p>
                ) : (
                  overdueFollowUps.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      badge={
                        <span className="inline-flex rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-medium text-white">
                          Overdue
                        </span>
                      }
                    />
                  ))
                )}
              </Section>

              <Section
                title="Leads with no next action"
                description="Active leads missing a defined next step."
              >
                {leadsWithNoNextAction.length === 0 ? (
                  <p className="text-sm text-neutral-600">
                    No active leads without next action.
                  </p>
                ) : (
                  leadsWithNoNextAction.slice(0, 10).map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      badge={
                        <span className="inline-flex rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-medium text-white">
                          Missing Next Step
                        </span>
                      }
                    />
                  ))
                )}
              </Section>

              <Section
                title="Follow ups due today"
                description="These should be contacted today to keep the pipeline moving."
              >
                {todayFollowUps.length === 0 ? (
                  <p className="text-sm text-neutral-600">No follow-ups due today.</p>
                ) : (
                  todayFollowUps.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      badge={
                        <span className="inline-flex rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-medium text-white">
                          Due Today
                        </span>
                      }
                    />
                  ))
                )}
              </Section>

              <Section
                title="Qualified leads aging 7+ days"
                description="Qualified leads sitting too long without advancing."
              >
                {qualifiedStaleLeads.length === 0 ? (
                  <p className="text-sm text-neutral-600">No stale qualified leads.</p>
                ) : (
                  qualifiedStaleLeads.slice(0, 10).map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      badge={stageEntryBadge(
                        lead,
                        "qualified",
                        "Aging Qualified",
                        "bg-amber-600"
                      )}
                    />
                  ))
                )}
              </Section>

              <Section
                title="Showing leads aging 7+ days"
                description="Showing-stage leads that may be stalled."
              >
                {showingStaleLeads.length === 0 ? (
                  <p className="text-sm text-neutral-600">No stale showing leads.</p>
                ) : (
                  showingStaleLeads.slice(0, 10).map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      badge={stageEntryBadge(
                        lead,
                        "showing",
                        "Aging Showing",
                        "bg-violet-600"
                      )}
                    />
                  ))
                )}
              </Section>

              <Section
                title="Application leads aging 5+ days"
                description="Application-stage leads needing immediate push to resolution."
              >
                {applicationStaleLeads.length === 0 ? (
                  <p className="text-sm text-neutral-600">
                    No stale application leads.
                  </p>
                ) : (
                  applicationStaleLeads.slice(0, 10).map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      badge={stageEntryBadge(
                        lead,
                        "application",
                        "Aging Application",
                        "bg-orange-600"
                      )}
                    />
                  ))
                )}
              </Section>

              <Section
                title="New leads"
                description="Fresh inbound leads that should be triaged quickly."
              >
                {newLeads.length === 0 ? (
                  <p className="text-sm text-neutral-600">No new leads.</p>
                ) : (
                  newLeads.slice(0, 10).map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      badge={
                        <span className="inline-flex rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-medium text-white">
                          New
                        </span>
                      }
                    />
                  ))
                )}
              </Section>

              <Section
                title="Priority A leads"
                description="High-priority opportunities that deserve immediate attention."
              >
                {priorityALeads.length === 0 ? (
                  <p className="text-sm text-neutral-600">No priority A leads.</p>
                ) : (
                  priorityALeads.slice(0, 10).map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      badge={
                        <span className="inline-flex rounded-full bg-neutral-950 px-2 py-0.5 text-[11px] font-medium text-white">
                          Top Priority
                        </span>
                      }
                    />
                  ))
                )}
              </Section>
            </div>
          </>
        )}
      </section>
    </main>
  );
}