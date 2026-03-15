import Link from "next/link";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "showing"
  | "application"
  | "closed"
  | "lost";

type LeadCountRow = {
  status: string | null;
  lead_quality: string | null;
  source: string | null;
  segment: string | null;
};

type FollowUpRow = {
  id: string;
};

function StatCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: number;
  hint: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 transition hover:border-black/10 hover:bg-neutral-50">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
        {value}
      </p>
      <p className="mt-2 text-sm leading-7 text-neutral-600">{hint}</p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

function ActionCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[1.5rem] border border-black/5 bg-white p-6 transition hover:border-black/10 hover:bg-neutral-50"
    >
      <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-7 text-neutral-600">{description}</p>
    </Link>
  );
}

function countByStatus(rows: LeadCountRow[], status: LeadStatus) {
  return rows.filter((row) => row.status === status).length;
}

function countByQuality(rows: LeadCountRow[], quality: string) {
  return rows.filter((row) => row.lead_quality === quality).length;
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

function groupCounts(rows: LeadCountRow[], key: "source" | "segment") {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const value = row[key] ?? "unknown";
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

export default async function DashboardPage() {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("leads")
    .select("status, lead_quality, source, segment")
    .limit(500);

  const rows = (data ?? []) as LeadCountRow[];

  const totalLeads = rows.length;
  const newLeads = countByStatus(rows, "new");
  const contactedLeads = countByStatus(rows, "contacted");
  const qualifiedLeads = countByStatus(rows, "qualified");
  const showingLeads = countByStatus(rows, "showing");
  const applicationLeads = countByStatus(rows, "application");
  const closedLeads = countByStatus(rows, "closed");
  const lostLeads = countByStatus(rows, "lost");

  const priorityALeads = countByQuality(rows, "priority_a");
  const priorityBLeads = countByQuality(rows, "priority_b");

  const activePipeline =
    newLeads +
    contactedLeads +
    qualifiedLeads +
    showingLeads +
    applicationLeads;

  const topSources = groupCounts(rows, "source");
  const topSegments = groupCounts(rows, "segment");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const { data: followUpsTodayData, error: followUpsTodayError } = await supabase
    .from("leads")
    .select("id")
    .gte("follow_up_at", today.toISOString())
    .lt("follow_up_at", tomorrow.toISOString())
    .neq("status", "closed")
    .neq("status", "lost");

  const { data: overdueFollowUpsData, error: overdueFollowUpsError } =
    await supabase
      .from("leads")
      .select("id")
      .lt("follow_up_at", today.toISOString())
      .not("follow_up_at", "is", null)
      .neq("status", "closed")
      .neq("status", "lost");

  const followUpsToday = ((followUpsTodayData ?? []) as FollowUpRow[]).length;
  const overdueFollowUps = ((overdueFollowUpsData ?? []) as FollowUpRow[]).length;
  const followUpQueue = overdueFollowUps + followUpsToday;

  const metricsError = error || followUpsTodayError || overdueFollowUpsError;

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-neutral-950">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          Dashboard
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Private operations
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600">
          Internal command center for lead management, follow-up, pipeline
          visibility, lead prioritization, and source performance.
        </p>

        {metricsError ? (
          <div className="mt-8 rounded-[1.5rem] border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Failed to load dashboard metrics.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-9">
            <StatCard
              label="Total Leads"
              value={totalLeads}
              hint="All captured opportunities in the system."
              href="/dashboard/leads"
            />
            <StatCard
              label="New Leads"
              value={newLeads}
              hint="Fresh submissions needing first response."
              href="/dashboard/leads?status=new"
            />
            <StatCard
              label="Priority A"
              value={priorityALeads}
              hint="Highest-value leads needing close attention."
              href="/dashboard/leads?quality=priority_a"
            />
            <StatCard
              label="Priority B"
              value={priorityBLeads}
              hint="Workable leads with good potential."
              href="/dashboard/leads?quality=priority_b"
            />
            <StatCard
              label="Qualified"
              value={qualifiedLeads}
              hint="Leads worth advancing toward a decision."
              href="/dashboard/leads?status=qualified"
            />
            <StatCard
              label="Active Pipeline"
              value={activePipeline}
              hint="Open opportunities not yet closed or lost."
              href="/dashboard/leads"
            />
            <StatCard
              label="Follow Ups Today"
              value={followUpsToday}
              hint="Contacts that should be handled today."
              href="/dashboard/leads?followup=today"
            />
            <StatCard
              label="Overdue Follow Ups"
              value={overdueFollowUps}
              hint="Past-due follow-ups needing immediate attention."
              href="/dashboard/leads?followup=overdue"
            />
            <StatCard
              label="Follow-Up Queue"
              value={followUpQueue}
              hint="Leads needing contact today."
              href="/dashboard/followups"
            />
          </div>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <ActionCard
            href="/dashboard/leads"
            title="Leads"
            description="View incoming submissions, quality, status, source, segmentation, notes, and follow-up dates."
          />

          <ActionCard
            href="/dashboard/followups"
            title="Follow-Up Queue"
            description="Work overdue and due-today leads from a dedicated daily execution screen."
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <div className="rounded-[1.5rem] border border-black/5 bg-white p-6">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
              Daily focus
            </h2>

            <div className="mt-4 space-y-3 text-sm text-neutral-700">
              <p>
                <span className="font-medium text-neutral-950">
                  Overdue follow ups:
                </span>{" "}
                {overdueFollowUps}
              </p>
              <p>
                <span className="font-medium text-neutral-950">
                  Follow ups today:
                </span>{" "}
                {followUpsToday}
              </p>
              <p>
                <span className="font-medium text-neutral-950">
                  Follow-up queue:
                </span>{" "}
                {followUpQueue}
              </p>
              <p>
                <span className="font-medium text-neutral-950">New leads:</span>{" "}
                {newLeads}
              </p>
              <p>
                <span className="font-medium text-neutral-950">
                  Priority A leads:
                </span>{" "}
                {priorityALeads}
              </p>
              <p>
                <span className="font-medium text-neutral-950">
                  Priority B leads:
                </span>{" "}
                {priorityBLeads}
              </p>
              <p>
                <span className="font-medium text-neutral-950">
                  Qualified leads:
                </span>{" "}
                {qualifiedLeads}
              </p>
              <p>
                <span className="font-medium text-neutral-950">
                  Closed leads:
                </span>{" "}
                {closedLeads}
              </p>
            </div>

            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Prioritize overdue follow-ups first, then today’s scheduled
              follow-ups, then new high-fit leads, and then qualified
              opportunities that need movement toward tours, applications, and
              closed transactions.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-black/5 bg-white p-6">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
              Pipeline snapshot
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Priority A
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                  {priorityALeads}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Priority B
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                  {priorityBLeads}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Contacted
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                  {contactedLeads}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Showing
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                  {showingLeads}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Application
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                  {applicationLeads}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Closed
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                  {closedLeads}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Lost
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                  {lostLeads}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Total
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                  {totalLeads}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.5rem] border border-black/5 bg-white p-6">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
              Top lead sources
            </h2>
            <p className="mt-2 text-sm leading-7 text-neutral-600">
              Shows which channels are actually producing inquiries.
            </p>

            <div className="mt-4 space-y-3">
              {topSources.length === 0 ? (
                <p className="text-sm text-neutral-600">No source data yet.</p>
              ) : (
                topSources.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-xl border border-black/5 bg-neutral-50 px-4 py-3"
                  >
                    <span className="text-sm font-medium text-neutral-900">
                      {labelize(item.name)}
                    </span>
                    <span className="text-sm text-neutral-600">{item.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-black/5 bg-white p-6">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
              Top segments
            </h2>
            <p className="mt-2 text-sm leading-7 text-neutral-600">
              Shows which operational segments are filling your pipeline.
            </p>

            <div className="mt-4 space-y-3">
              {topSegments.length === 0 ? (
                <p className="text-sm text-neutral-600">No segment data yet.</p>
              ) : (
                topSegments.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-xl border border-black/5 bg-neutral-50 px-4 py-3"
                  >
                    <span className="text-sm font-medium text-neutral-900">
                      {labelize(item.name)}
                    </span>
                    <span className="text-sm text-neutral-600">{item.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}