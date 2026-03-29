import Link from "next/link";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

type CrmLeadRow = {
  id: string;
  full_name: string | null;
  stage: string | null;
  next_follow_up_at: string | null;
  created_at: string | null;
};

type NormalizedLead = {
  id: string;
  name: string | null;
  status: string | null;
  follow_up_at: string | null;
  created_at: string | null;
};

function parseDate(value?: string | null) {
  if (!value) return null;

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;

  return d;
}

function isToday(value?: string | null) {
  const d = parseDate(value);
  if (!d) return false;

  const today = new Date();

  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

function isOverdue(value?: string | null) {
  const d = parseDate(value);
  if (!d) return false;

  const now = new Date();
  return d.getTime() < now.getTime() && !isToday(value);
}

function formatStatus(value?: string | null) {
  if (!value) return "Unassigned";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value?: string | null) {
  const d = parseDate(value);
  if (!d) return "-";

  return d.toLocaleDateString();
}

function normalizeLead(lead: CrmLeadRow): NormalizedLead {
  return {
    id: lead.id,
    name: lead.full_name ?? null,
    status: lead.stage?.trim().toLowerCase() || null,
    follow_up_at: lead.next_follow_up_at ?? null,
    created_at: lead.created_at ?? null,
  };
}

function LeadMiniCard({ lead }: { lead: NormalizedLead }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white px-4 py-3">
      <Link
        href={`/ops/leads/${lead.id}`}
        className="text-sm font-medium text-neutral-900 hover:underline"
      >
        {lead.name || "Unnamed lead"}
      </Link>

      <p className="mt-1 text-xs text-neutral-500">
        Status: {formatStatus(lead.status)} · Follow-up:{" "}
        {formatDate(lead.follow_up_at)}
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-black/5 bg-white p-6">
      <p className="text-sm font-medium text-neutral-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>
    </div>
  );
}

export default async function OpsDashboardPage() {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("crm_leads")
    .select("id, full_name, stage, next_follow_up_at, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("OPS DASHBOARD LOAD ERROR:", error);

    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Failed to load dashboard.
        </div>
      </main>
    );
  }

  const leads: NormalizedLead[] = ((data || []) as CrmLeadRow[]).map(
    normalizeLead
  );

  const activeLeads = leads.filter(
    (lead) => lead.status !== "closed" && lead.status !== "lost"
  );

  const overdueLeads = activeLeads.filter((lead) =>
    isOverdue(lead.follow_up_at)
  );

  const dueTodayLeads = activeLeads.filter((lead) =>
    isToday(lead.follow_up_at)
  );

  const newLeads = leads.filter((lead) => lead.status === "new");
  const qualifiedLeads = leads.filter(
    (lead) =>
      lead.status === "qualified" ||
      lead.status === "showing" ||
      lead.status === "contacted" ||
      lead.status === "conversation"
  );
  const applications = leads.filter(
    (lead) =>
      lead.status === "application" ||
      lead.status === "appointment_set" ||
      lead.status === "appointment_done"
  );
  const closedLeads = leads.filter((lead) => lead.status === "closed");

  const pipelineCounts = [
    { label: "New", value: newLeads.length },
    { label: "Qualified / Conversation", value: qualifiedLeads.length },
    { label: "Appointments", value: applications.length },
    { label: "Closed", value: closedLeads.length },
  ];

  const recentLeads = leads.slice(0, 8);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            Operations
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600">
            Command center for lead volume, follow-up pressure, and pipeline
            visibility across the operation.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/ops/leads"
            className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:border-black/20"
          >
            Full lead queue
          </Link>

          <Link
            href="/ops/today"
            className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:border-black/20"
          >
            Today
          </Link>

          <Link
            href="/ops/pipeline"
            className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Pipeline
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active leads"
          value={activeLeads.length}
          description="Open opportunities excluding closed and lost records."
        />

        <StatCard
          label="Overdue follow-up"
          value={overdueLeads.length}
          description="Leads needing immediate follow-up attention."
        />

        <StatCard
          label="Due today"
          value={dueTodayLeads.length}
          description="Follow-ups scheduled for today."
        />

        <StatCard
          label="Closed leads"
          value={closedLeads.length}
          description="Completed records already moved across the line."
        />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Follow-up pressure
              </h2>
              <p className="mt-2 text-sm leading-7 text-neutral-600">
                Fast access to the leads most likely to stall without immediate
                action.
              </p>
            </div>

            <Link
              href="/ops/today"
              className="text-sm font-medium underline underline-offset-4 transition hover:text-neutral-900"
            >
              Open today view
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-black/5 bg-neutral-50 p-5">
              <p className="text-sm font-medium text-neutral-500">Overdue</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {overdueLeads.length}
              </p>

              <div className="mt-4 space-y-3">
                {overdueLeads.slice(0, 4).map((lead) => (
                  <LeadMiniCard key={lead.id} lead={lead} />
                ))}

                {!overdueLeads.length && (
                  <p className="text-sm text-neutral-500">No overdue leads.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-black/5 bg-neutral-50 p-5">
              <p className="text-sm font-medium text-neutral-500">Due today</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {dueTodayLeads.length}
              </p>

              <div className="mt-4 space-y-3">
                {dueTodayLeads.slice(0, 4).map((lead) => (
                  <LeadMiniCard key={lead.id} lead={lead} />
                ))}

                {!dueTodayLeads.length && (
                  <p className="text-sm text-neutral-500">Nothing due today.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Pipeline snapshot
              </h2>
              <p className="mt-2 text-sm leading-7 text-neutral-600">
                Quick stage counts for operational triage.
              </p>
            </div>

            <Link
              href="/ops/pipeline"
              className="text-sm font-medium underline underline-offset-4 transition hover:text-neutral-900"
            >
              Open pipeline
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {pipelineCounts.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl border border-black/5 bg-neutral-50 px-4 py-4"
              >
                <span className="text-sm font-medium text-neutral-700">
                  {item.label}
                </span>
                <span className="text-lg font-semibold tracking-tight text-neutral-950">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[1.75rem] border border-black/5 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Recent lead activity
            </h2>
            <p className="mt-2 text-sm leading-7 text-neutral-600">
              Most recent records added to the system.
            </p>
          </div>

          <Link
            href="/ops/leads"
            className="text-sm font-medium underline underline-offset-4 transition hover:text-neutral-900"
          >
            View all leads
          </Link>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-[0.12em] text-neutral-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Follow-up</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="border-b text-sm">
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    <Link
                      href={`/ops/leads/${lead.id}`}
                      className="hover:underline"
                    >
                      {lead.name || "Unnamed lead"}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{formatStatus(lead.status)}</td>
                  <td className="px-4 py-3">{formatDate(lead.follow_up_at)}</td>
                  <td className="px-4 py-3">{formatDate(lead.created_at)}</td>
                </tr>
              ))}

              {!recentLeads.length && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-sm text-neutral-500"
                  >
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}