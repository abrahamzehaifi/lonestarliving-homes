import Link from "next/link";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

type LeadQuality = "priority_a" | "priority_b" | "priority_c";

type LeadRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  lead_type: string;
  status: string | null;
  lead_quality: LeadQuality | string | null;
  follow_up_at: string | null;
  next_action: string | null;
  timeline: string | null;
  source: string | null;
  segment: string | null;
  commission_estimate: number | null;
  commission_actual: number | null;
};

type DashboardLeadsPageProps = {
  searchParams?: {
    status?: string;
    quality?: string;
    followup?: string;
  };
};

const STATUS_ORDER = [
  "new",
  "contacted",
  "qualified",
  "showing",
  "application",
  "closed",
  "lost",
] as const;

const QUALITY_ORDER = ["priority_a", "priority_b", "priority_c"] as const;
const FOLLOWUP_ORDER = ["today", "overdue", "scheduled"] as const;

function safeTime(value: string | null | undefined) {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

function formatDate(value: string | null | undefined) {
  const time = safeTime(value);
  if (time == null) return "—";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(time));
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

function formatPercent(numerator: number, denominator: number) {
  if (denominator <= 0) return "—";
  const value = (numerator / denominator) * 100;
  return `${Math.round(value)}%`;
}

function timeAgo(value: string | null | undefined) {
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

function statusPriority(status: string | null) {
  switch (status) {
    case "new":
      return 0;
    case "contacted":
      return 1;
    case "qualified":
      return 2;
    case "showing":
      return 3;
    case "application":
      return 4;
    case "closed":
      return 5;
    case "lost":
      return 6;
    default:
      return 99;
  }
}

function qualityPriority(quality: string | null) {
  switch (quality) {
    case "priority_a":
      return 0;
    case "priority_b":
      return 1;
    case "priority_c":
      return 2;
    default:
      return 99;
  }
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

function FilterChip({
  label,
  href,
  active,
  count,
}: {
  label: string;
  href: string;
  active: boolean;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-neutral-950 text-white"
          : "bg-white text-neutral-700 ring-1 ring-inset ring-black/10 hover:bg-neutral-50"
      }`}
    >
      <span>{label}</span>
      {typeof count === "number" ? (
        <span
          className={`rounded-full px-1.5 py-0.5 text-[11px] ${
            active ? "bg-white/15 text-white" : "bg-neutral-100 text-neutral-600"
          }`}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}

function SummaryCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number | string;
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

  return (
    <div className={`rounded-2xl border p-4 ${toneClasses}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-80">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function QueueCard({
  label,
  value,
  href,
  tone = "default",
}: {
  label: string;
  value: number;
  href: string;
  tone?: "default" | "urgent" | "priority";
}) {
  const toneClasses =
    tone === "urgent"
      ? "border-red-200 bg-red-50 text-red-700"
      : tone === "priority"
      ? "border-neutral-950/10 bg-neutral-950 text-white"
      : "border-black/5 bg-white text-neutral-950";

  return (
    <Link
      href={href}
      className={`rounded-2xl border p-4 transition hover:border-black/10 ${toneClasses}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-80">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </Link>
  );
}

function followUpSortPriority(
  lead: LeadRow,
  isFollowUpOverdue: (lead: LeadRow) => boolean,
  isFollowUpToday: (lead: LeadRow) => boolean,
  isFollowUpScheduled: (lead: LeadRow) => boolean
) {
  if (isFollowUpOverdue(lead)) return 0;
  if (isFollowUpToday(lead)) return 1;
  if (isFollowUpScheduled(lead)) return 2;
  return 3;
}

export default async function DashboardLeadsPage({
  searchParams,
}: DashboardLeadsPageProps) {
  const resolvedSearchParams = searchParams ?? {};
  const activeStatus = resolvedSearchParams.status?.toLowerCase() ?? "all";
  const activeQuality = resolvedSearchParams.quality?.toLowerCase() ?? "all";
  const activeFollowup = resolvedSearchParams.followup?.toLowerCase() ?? "all";

  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("leads")
    .select(
      "id, created_at, name, email, phone, lead_type, status, lead_quality, follow_up_at, next_action, timeline, source, segment, commission_estimate, commission_actual"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowMs = tomorrow.getTime();

  function isClosedOrLost(lead: LeadRow) {
    return lead.status === "closed" || lead.status === "lost";
  }

  function isFollowUpToday(lead: LeadRow) {
    if (!lead.follow_up_at || isClosedOrLost(lead)) return false;
    const time = safeTime(lead.follow_up_at);
    if (time == null) return false;
    return time >= todayMs && time < tomorrowMs;
  }

  function isFollowUpOverdue(lead: LeadRow) {
    if (!lead.follow_up_at || isClosedOrLost(lead)) return false;
    const time = safeTime(lead.follow_up_at);
    if (time == null) return false;
    return time < todayMs;
  }

  function isFollowUpScheduled(lead: LeadRow) {
    if (!lead.follow_up_at || isClosedOrLost(lead)) return false;
    const time = safeTime(lead.follow_up_at);
    if (time == null) return false;
    return time >= tomorrowMs;
  }

  const allLeads = ((data ?? []) as LeadRow[]).sort((a, b) => {
    const followUpDiff =
      followUpSortPriority(
        a,
        isFollowUpOverdue,
        isFollowUpToday,
        isFollowUpScheduled
      ) -
      followUpSortPriority(
        b,
        isFollowUpOverdue,
        isFollowUpToday,
        isFollowUpScheduled
      );

    if (followUpDiff !== 0) return followUpDiff;

    const aFollowUpTime = safeTime(a.follow_up_at);
    const bFollowUpTime = safeTime(b.follow_up_at);

    if (aFollowUpTime != null && bFollowUpTime != null) {
      const followUpTimeDiff = aFollowUpTime - bFollowUpTime;
      if (followUpTimeDiff !== 0) return followUpTimeDiff;
    } else if (aFollowUpTime != null && bFollowUpTime == null) {
      return -1;
    } else if (aFollowUpTime == null && bFollowUpTime != null) {
      return 1;
    }

    const statusDiff = statusPriority(a.status) - statusPriority(b.status);
    if (statusDiff !== 0) return statusDiff;

    const qualityDiff =
      qualityPriority(a.lead_quality) - qualityPriority(b.lead_quality);
    if (qualityDiff !== 0) return qualityDiff;

    return (safeTime(b.created_at) ?? 0) - (safeTime(a.created_at) ?? 0);
  });

  const counts = {
    all: allLeads.length,
    new: allLeads.filter((lead) => lead.status === "new").length,
    contacted: allLeads.filter((lead) => lead.status === "contacted").length,
    qualified: allLeads.filter((lead) => lead.status === "qualified").length,
    showing: allLeads.filter((lead) => lead.status === "showing").length,
    application: allLeads.filter((lead) => lead.status === "application").length,
    closed: allLeads.filter((lead) => lead.status === "closed").length,
    lost: allLeads.filter((lead) => lead.status === "lost").length,
    priority_a: allLeads.filter((lead) => lead.lead_quality === "priority_a")
      .length,
    priority_b: allLeads.filter((lead) => lead.lead_quality === "priority_b")
      .length,
    priority_c: allLeads.filter((lead) => lead.lead_quality === "priority_c")
      .length,
    followup_today: allLeads.filter(isFollowUpToday).length,
    followup_overdue: allLeads.filter(isFollowUpOverdue).length,
    followup_scheduled: allLeads.filter(isFollowUpScheduled).length,
  };

  const revenue = {
    openEstimated: allLeads
      .filter((lead) => !isClosedOrLost(lead))
      .reduce((sum, lead) => sum + (lead.commission_estimate ?? 0), 0),
    qualifiedEstimated: allLeads
      .filter((lead) => lead.status === "qualified")
      .reduce((sum, lead) => sum + (lead.commission_estimate ?? 0), 0),
    showingEstimated: allLeads
      .filter((lead) => lead.status === "showing")
      .reduce((sum, lead) => sum + (lead.commission_estimate ?? 0), 0),
    applicationEstimated: allLeads
      .filter((lead) => lead.status === "application")
      .reduce((sum, lead) => sum + (lead.commission_estimate ?? 0), 0),
    closedActual: allLeads
      .filter((lead) => lead.status === "closed")
      .reduce((sum, lead) => sum + (lead.commission_actual ?? 0), 0),
  };

  const conversion = {
    newToContacted: formatPercent(counts.contacted, counts.new),
    contactedToQualified: formatPercent(counts.qualified, counts.contacted),
    qualifiedToShowing: formatPercent(counts.showing, counts.qualified),
    showingToApplication: formatPercent(counts.application, counts.showing),
    applicationToClosed: formatPercent(counts.closed, counts.application),
  };

  const leads = allLeads.filter((lead) => {
    const matchesStatus =
      activeStatus === "all"
        ? true
        : (lead.status ?? "").toLowerCase() === activeStatus;

    const matchesQuality =
      activeQuality === "all"
        ? true
        : (lead.lead_quality ?? "").toLowerCase() === activeQuality;

    let matchesFollowup = true;

    if (activeFollowup === "today") {
      matchesFollowup = isFollowUpToday(lead);
    } else if (activeFollowup === "overdue") {
      matchesFollowup = isFollowUpOverdue(lead);
    } else if (activeFollowup === "scheduled") {
      matchesFollowup = isFollowUpScheduled(lead);
    }

    return matchesStatus && matchesQuality && matchesFollowup;
  });

  function buildFilterHref(next: {
    status?: string;
    quality?: string;
    followup?: string;
  }) {
    const status = next.status ?? activeStatus;
    const quality = next.quality ?? activeQuality;
    const followup = next.followup ?? activeFollowup;

    const params = new URLSearchParams();

    if (status !== "all") params.set("status", status);
    if (quality !== "all") params.set("quality", quality);
    if (followup !== "all") params.set("followup", followup);

    const query = params.toString();
    return query ? `/dashboard/leads?${query}` : "/dashboard/leads";
  }

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-neutral-950">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            Dashboard
          </p>

          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Leads
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">
                Internal lead pipeline for LonestarLiving. Prioritize high-fit,
                time-sensitive, and follow-up-critical opportunities first.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-neutral-600">
                Last 200 submissions
              </div>

              <Link
                href="/dashboard/leads/new"
                className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Add Lead
              </Link>
            </div>
          </div>
        </div>

        {!error ? (
          <>
            <div className="mb-6">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Action queue
              </p>
              <div className="grid gap-4 md:grid-cols-4">
                <QueueCard
                  label="Overdue Follow Ups"
                  value={counts.followup_overdue}
                  href="/dashboard/leads?followup=overdue"
                  tone="urgent"
                />
                <QueueCard
                  label="Follow Ups Today"
                  value={counts.followup_today}
                  href="/dashboard/leads?followup=today"
                />
                <QueueCard
                  label="Priority A Leads"
                  value={counts.priority_a}
                  href="/dashboard/leads?quality=priority_a"
                  tone="priority"
                />
                <QueueCard
                  label="New Leads"
                  value={counts.new}
                  href="/dashboard/leads?status=new"
                />
              </div>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-5">
              <SummaryCard
                label="Open Estimated Pipeline"
                value={formatCurrency(revenue.openEstimated)}
                tone="revenue"
              />
              <SummaryCard
                label="Qualified Est."
                value={formatCurrency(revenue.qualifiedEstimated)}
                tone="revenue"
              />
              <SummaryCard
                label="Showing Est."
                value={formatCurrency(revenue.showingEstimated)}
                tone="revenue"
              />
              <SummaryCard
                label="Application Est."
                value={formatCurrency(revenue.applicationEstimated)}
                tone="revenue"
              />
              <SummaryCard
                label="Closed Actual Revenue"
                value={formatCurrency(revenue.closedActual)}
                tone="revenue"
              />
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-6">
              <SummaryCard label="All Leads" value={counts.all} />
              <SummaryCard label="New" value={counts.new} />
              <SummaryCard label="Qualified" value={counts.qualified} />
              <SummaryCard label="Priority A" value={counts.priority_a} />
              <SummaryCard label="Closed" value={counts.closed} />
              <SummaryCard label="Lost" value={counts.lost} />
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-5">
              <SummaryCard
                label="New → Contacted"
                value={conversion.newToContacted}
              />
              <SummaryCard
                label="Contacted → Qualified"
                value={conversion.contactedToQualified}
              />
              <SummaryCard
                label="Qualified → Showing"
                value={conversion.qualifiedToShowing}
              />
              <SummaryCard
                label="Showing → Application"
                value={conversion.showingToApplication}
              />
              <SummaryCard
                label="Application → Closed"
                value={conversion.applicationToClosed}
              />
            </div>

            <div className="mb-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Filter by status
              </p>
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  label="All"
                  href={buildFilterHref({ status: "all" })}
                  active={activeStatus === "all"}
                  count={counts.all}
                />
                {STATUS_ORDER.map((status) => (
                  <FilterChip
                    key={status}
                    label={labelize(status)}
                    href={buildFilterHref({ status })}
                    active={activeStatus === status}
                    count={counts[status]}
                  />
                ))}
              </div>
            </div>

            <div className="mb-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Filter by quality
              </p>
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  label="All"
                  href={buildFilterHref({ quality: "all" })}
                  active={activeQuality === "all"}
                  count={counts.all}
                />
                {QUALITY_ORDER.map((quality) => (
                  <FilterChip
                    key={quality}
                    label={labelize(quality)}
                    href={buildFilterHref({ quality })}
                    active={activeQuality === quality}
                    count={counts[quality]}
                  />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Filter by follow up
              </p>
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  label="All"
                  href={buildFilterHref({ followup: "all" })}
                  active={activeFollowup === "all"}
                  count={counts.all}
                />
                {FOLLOWUP_ORDER.map((followup) => (
                  <FilterChip
                    key={followup}
                    label={labelize(followup)}
                    href={buildFilterHref({ followup })}
                    active={activeFollowup === followup}
                    count={
                      followup === "today"
                        ? counts.followup_today
                        : followup === "overdue"
                        ? counts.followup_overdue
                        : counts.followup_scheduled
                    }
                  />
                ))}
              </div>
            </div>
          </>
        ) : null}

        <div className="overflow-hidden rounded-[1.75rem] border border-black/5 bg-white">
          {error ? (
            <div className="p-6 text-sm text-red-600">Failed to load leads.</div>
          ) : leads.length === 0 ? (
            <div className="p-6 text-sm text-neutral-600">
              No leads found for the current filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-neutral-50 text-left">
                    <th className="border-b border-black/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      Created
                    </th>
                    <th className="border-b border-black/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      Lead
                    </th>
                    <th className="border-b border-black/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      Type
                    </th>
                    <th className="border-b border-black/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      Quality
                    </th>
                    <th className="border-b border-black/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      Status
                    </th>
                    <th className="border-b border-black/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      Next Action
                    </th>
                    <th className="border-b border-black/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      Follow Up
                    </th>
                    <th className="border-b border-black/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      Timeline
                    </th>
                    <th className="border-b border-black/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      Source
                    </th>
                    <th className="border-b border-black/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      Segment
                    </th>
                    <th className="border-b border-black/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      Est.
                    </th>
                    <th className="border-b border-black/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      Actual
                    </th>
                    <th className="border-b border-black/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      Contact
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {leads.map((lead) => {
                    const isNew = lead.status === "new";
                    const isPriorityA = lead.lead_quality === "priority_a";
                    const overdue = isFollowUpOverdue(lead);
                    const dueToday = isFollowUpToday(lead);

                    return (
                      <tr
                        key={lead.id}
                        className={`align-top transition hover:bg-neutral-50 ${
                          overdue
                            ? "bg-red-50/70"
                            : isNew
                            ? "bg-blue-50/60"
                            : ""
                        } ${
                          isPriorityA
                            ? "ring-1 ring-inset ring-neutral-950/5"
                            : ""
                        }`}
                      >
                        <td className="border-b border-black/5 px-4 py-4 text-sm text-neutral-600">
                          <div>{formatDate(lead.created_at)}</div>
                          <div className="mt-1 text-xs text-neutral-400">
                            {timeAgo(lead.created_at)}
                          </div>
                        </td>

                        <td className="border-b border-black/5 px-4 py-4">
                          <div className="min-w-0">
                            <Link
                              href={`/dashboard/leads/${lead.id}`}
                              className="font-medium text-neutral-950 underline-offset-4 hover:underline"
                            >
                              {lead.name}
                            </Link>

                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {isNew ? (
                                <span className="inline-flex rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-medium text-white">
                                  New
                                </span>
                              ) : null}

                              {isPriorityA ? (
                                <span className="inline-flex rounded-full bg-neutral-950 px-2 py-0.5 text-[11px] font-medium text-white">
                                  Top Priority
                                </span>
                              ) : null}

                              {overdue ? (
                                <span className="inline-flex rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-medium text-white">
                                  Overdue
                                </span>
                              ) : dueToday ? (
                                <span className="inline-flex rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-medium text-white">
                                  Due Today
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </td>

                        <td className="border-b border-black/5 px-4 py-4 text-sm text-neutral-700">
                          {labelize(lead.lead_type)}
                        </td>

                        <td className="border-b border-black/5 px-4 py-4 text-sm text-neutral-700">
                          <QualityPill quality={lead.lead_quality} />
                        </td>

                        <td className="border-b border-black/5 px-4 py-4 text-sm text-neutral-700">
                          <StatusPill status={lead.status} />
                        </td>

                        <td className="border-b border-black/5 px-4 py-4 text-sm text-neutral-700">
                          {lead.next_action ? (
                            <div className="max-w-[280px] whitespace-pre-wrap leading-6 text-neutral-800">
                              {lead.next_action}
                            </div>
                          ) : (
                            <span className="text-neutral-400">—</span>
                          )}
                        </td>

                        <td className="border-b border-black/5 px-4 py-4 text-sm">
                          {lead.follow_up_at ? (
                            <div
                              className={
                                overdue ? "text-red-700" : "text-neutral-700"
                              }
                            >
                              <div>{formatDate(lead.follow_up_at)}</div>
                              <div className="mt-1 text-xs text-neutral-400">
                                {timeAgo(lead.follow_up_at)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-neutral-400">—</span>
                          )}
                        </td>

                        <td className="border-b border-black/5 px-4 py-4 text-sm text-neutral-700">
                          {labelize(lead.timeline)}
                        </td>

                        <td className="border-b border-black/5 px-4 py-4 text-sm text-neutral-700">
                          {labelize(lead.source)}
                        </td>

                        <td className="border-b border-black/5 px-4 py-4 text-sm text-neutral-700">
                          {labelize(lead.segment)}
                        </td>

                        <td className="border-b border-black/5 px-4 py-4 text-sm text-neutral-700">
                          {formatCurrency(lead.commission_estimate)}
                        </td>

                        <td className="border-b border-black/5 px-4 py-4 text-sm text-neutral-700">
                          {formatCurrency(lead.commission_actual)}
                        </td>

                        <td className="border-b border-black/5 px-4 py-4 text-sm text-neutral-600">
                          <div className="space-y-1">
                            <div className="break-all text-neutral-800">
                              {lead.email || "—"}
                            </div>
                            <div>{lead.phone || "—"}</div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}