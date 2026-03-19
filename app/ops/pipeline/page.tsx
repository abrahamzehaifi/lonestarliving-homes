import Link from "next/link";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  lead_type: string | null;
  status: string | null;
  lead_quality: string | null;
  area: string | null;
  budget: number | null;
  next_action: string | null;
  follow_up_at: string | null;
  created_at: string;
};

const pipelineStages = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "qualified", label: "Qualified" },
  { key: "showing", label: "Showing" },
  { key: "application", label: "Application" },
  { key: "closed", label: "Closed" },
] as const;

function formatArea(area?: string | null) {
  if (!area) return "Unknown";
  return area
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function formatCurrency(value?: number | null) {
  if (!value) return "-";
  return `$${Number(value).toLocaleString()}`;
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function getQualityLabel(quality?: string | null) {
  if (quality === "priority_a") return "Priority A";
  if (quality === "priority_b") return "Priority B";
  if (quality === "priority_c") return "Priority C";
  return "—";
}

function LeadMiniCard({ lead }: { lead: LeadRow }) {
  return (
    <Link
      href={`/ops/leads/${lead.id}`}
      className="block rounded-2xl border border-black/5 bg-white p-4 transition hover:border-black/10 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold tracking-tight text-neutral-950">
          {lead.name}
        </p>

        <span className="rounded-full bg-neutral-100 px-2 py-1 text-[10px] font-medium text-neutral-700">
          {getQualityLabel(lead.lead_quality)}
        </span>
      </div>

      <p className="mt-2 text-xs text-neutral-600">
        {lead.lead_type || "-"} • {formatArea(lead.area)}
      </p>

      <p className="mt-1 text-xs text-neutral-500">
        Budget: {formatCurrency(lead.budget)}
      </p>

      <p className="mt-3 line-clamp-2 text-xs leading-5 text-neutral-700">
        {lead.next_action || "No next action"}
      </p>

      <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500">
        <span>{lead.follow_up_at ? `FU ${formatDate(lead.follow_up_at)}` : "No follow-up"}</span>
        <span>{formatDate(lead.created_at)}</span>
      </div>
    </Link>
  );
}

export default async function OpsPipelinePage() {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("leads")
    .select(
      "id, name, email, phone, lead_type, status, lead_quality, area, budget, next_action, follow_up_at, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  const leads = ((data ?? []) as LeadRow[]).filter(
    (lead) => lead.status !== "lost"
  );

  const grouped = Object.fromEntries(
    pipelineStages.map((stage) => [
      stage.key,
      leads.filter((lead) => (lead.status || "new") === stage.key),
    ])
  ) as Record<(typeof pipelineStages)[number]["key"], LeadRow[]>;

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-neutral-950">
      <section className="mx-auto max-w-[1600px] px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              Operations
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Pipeline
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">
              Visual pipeline view across active stages so you can see bottlenecks,
              stale deals, and next-step workload at a glance.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/ops/today"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-medium text-neutral-900 transition hover:border-black/20 hover:bg-white"
            >
              Today
            </Link>

            <Link
              href="/ops/leads"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-medium text-neutral-900 transition hover:border-black/20 hover:bg-white"
            >
              Full lead queue
            </Link>
          </div>
        </div>

        {error ? (
          <div className="rounded-[1.75rem] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Failed to load pipeline.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="grid min-w-[1400px] grid-cols-6 gap-5">
              {pipelineStages.map((stage) => {
                const stageLeads = grouped[stage.key] || [];

                return (
                  <div
                    key={stage.key}
                    className="rounded-[1.75rem] border border-black/5 bg-neutral-100/70 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-700">
                          {stage.label}
                        </h2>
                        <p className="mt-1 text-xs text-neutral-500">
                          {stageLeads.length} lead{stageLeads.length === 1 ? "" : "s"}
                        </p>
                      </div>

                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 ring-1 ring-black/5">
                        {stageLeads.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {stageLeads.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-black/10 bg-white/60 px-4 py-6 text-center text-xs text-neutral-500">
                          No leads
                        </div>
                      ) : (
                        stageLeads.map((lead) => (
                          <LeadMiniCard key={lead.id} lead={lead} />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}