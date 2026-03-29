import Link from "next/link";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import InlineStatusSelect from "./InlineStatusSelect";

function formatText(value?: string | null) {
  return value && String(value).trim() ? value : "-";
}

type CrmLead = {
  id: string;
  full_name: string | null;
  property_address: string | null;
  stage: string | null;
  priority: string | null;
  lead_score: number | null;
  lead_quality: string | null;
  motivation: string | null;
  source_detail: string | null;
  channel: string | null;
  phone: string | null;
  email: string | null;
  timeline: string | null;
  next_follow_up_at: string | null;
  created_at: string | null;
};

function isToday(dateStr?: string | null) {
  if (!dateStr) return false;

  const today = new Date();
  const d = new Date(dateStr);

  if (Number.isNaN(d.getTime())) return false;

  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

function isOverdue(dateStr?: string | null) {
  if (!dateStr) return false;

  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return d.getTime() < today.getTime();
}

function formatStage(value?: string | null) {
  if (!value) return "Unassigned";
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildFilterHref(filters: {
  stage?: string | null;
  priority?: string | null;
  followup?: string | null;
}) {
  const params = new URLSearchParams();

  if (filters.stage) params.set("stage", filters.stage);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.followup) params.set("followup", filters.followup);

  const query = params.toString();
  return query ? `/ops/leads?${query}` : "/ops/leads";
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams?:
    | Promise<{
        stage?: string;
        priority?: string;
        followup?: string;
      }>
    | {
        stage?: string;
        priority?: string;
        followup?: string;
      };
}) {
  const sp =
    searchParams instanceof Promise ? await searchParams : searchParams;

  const selectedStage = sp?.stage?.toLowerCase() || null;
  const selectedPriority = sp?.priority?.toLowerCase() || null;
  const selectedFollowup = sp?.followup?.toLowerCase() || null;

  const supabase = createSupabaseServiceClient();

  let query = supabase
    .from("crm_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (selectedStage) {
    query = query.eq("stage", selectedStage);
  }

  if (selectedPriority) {
    query = query.eq("priority", selectedPriority);
  }

  const { data, error } = await query;

  if (error) {
    console.error("OPS LEADS LOAD ERROR:", error);
  }

  const leads = ((data || []) as CrmLead[]).filter((lead) => {
    if (selectedFollowup === "today") {
      return isToday(lead.next_follow_up_at);
    }

    if (selectedFollowup === "overdue") {
      return (
        isOverdue(lead.next_follow_up_at) &&
        !isToday(lead.next_follow_up_at) &&
        lead.stage !== "closed" &&
        lead.stage !== "lost"
      );
    }

    return true;
  });

  const { data: allLeads } = await supabase
    .from("crm_leads")
    .select("stage, priority");

  const stageCounts: Record<string, number> = {};
  const priorityCounts: Record<string, number> = {};

  allLeads?.forEach((lead) => {
    if (lead.stage) {
      const key = String(lead.stage).toLowerCase();
      stageCounts[key] = (stageCounts[key] || 0) + 1;
    }

    if (lead.priority) {
      const key = String(lead.priority).toLowerCase();
      priorityCounts[key] = (priorityCounts[key] || 0) + 1;
    }
  });

  const stageOrder = [
    "new",
    "contacted",
    "conversation",
    "appointment_set",
    "appointment_done",
    "follow_up",
    "listing_signed",
    "closed",
    "lost",
    "nurture",
  ];

  const sortedStages = stageOrder
    .filter((stage) => stageCounts[stage])
    .map((stage) => [stage, stageCounts[stage]] as const);

  const priorityOrder = ["high", "medium", "low"];

  const sortedPriorities = priorityOrder
    .filter((priority) => priorityCounts[priority])
    .map((priority) => [priority, priorityCounts[priority]] as const);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">CRM Leads</h1>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/ops/today"
            className="rounded-full border px-4 py-2 text-sm"
          >
            Today
          </Link>

          <Link
            href="/ops/pipeline"
            className="rounded-full border px-4 py-2 text-sm"
          >
            Pipeline
          </Link>

          <Link
            href="/ops/dashboard/crm"
            className="rounded-full border px-4 py-2 text-sm"
          >
            CRM
          </Link>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-black/5 bg-white p-5">
        <p className="text-sm font-medium text-neutral-500">Filter by stage</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={buildFilterHref({
              priority: selectedPriority,
              followup: selectedFollowup,
            })}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              !selectedStage
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-black/10 bg-neutral-50 text-neutral-700"
            }`}
          >
            All
          </Link>

          {sortedStages.map(([stage, count]) => (
            <Link
              key={stage}
              href={buildFilterHref({
                stage,
                priority: selectedPriority,
                followup: selectedFollowup,
              })}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                selectedStage === stage
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-black/10 bg-neutral-50 text-neutral-700 hover:bg-white"
              }`}
            >
              {formatStage(stage)} ({count})
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-black/5 bg-white p-5">
        <p className="text-sm font-medium text-neutral-500">
          Filter by priority
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={buildFilterHref({
              stage: selectedStage,
              followup: selectedFollowup,
            })}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              !selectedPriority
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-black/10 bg-neutral-50 text-neutral-700"
            }`}
          >
            All
          </Link>

          {sortedPriorities.map(([priority, count]) => (
            <Link
              key={priority}
              href={buildFilterHref({
                stage: selectedStage,
                priority,
                followup: selectedFollowup,
              })}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                selectedPriority === priority
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-black/10 bg-neutral-50 text-neutral-700 hover:bg-white"
              }`}
            >
              {formatStage(priority)} ({count})
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-black/5 bg-white p-5">
        <p className="text-sm font-medium text-neutral-500">
          Filter by follow-up
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={buildFilterHref({
              stage: selectedStage,
              priority: selectedPriority,
            })}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              !selectedFollowup
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-black/10 bg-neutral-50 text-neutral-700"
            }`}
          >
            All
          </Link>

          <Link
            href={buildFilterHref({
              stage: selectedStage,
              priority: selectedPriority,
              followup: "today",
            })}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              selectedFollowup === "today"
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-black/10 bg-neutral-50 text-neutral-700 hover:bg-white"
            }`}
          >
            Today
          </Link>

          <Link
            href={buildFilterHref({
              stage: selectedStage,
              priority: selectedPriority,
              followup: "overdue",
            })}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              selectedFollowup === "overdue"
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-black/10 bg-neutral-50 text-neutral-700 hover:bg-white"
            }`}
          >
            Overdue
          </Link>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-[0.12em] text-neutral-500">
              <th className="px-4 py-3">Name</th>
              <th>Property</th>
              <th>Stage</th>
              <th>Priority</th>
              <th>Score</th>
              <th>Timeline</th>
              <th>Follow-up</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b text-sm">
                <td className="px-4 py-3 font-medium text-neutral-900">
                  <Link
                    href={`/ops/leads/${lead.id}`}
                    className="hover:underline"
                  >
                    {formatText(lead.full_name)}
                  </Link>
                </td>

                <td>{formatText(lead.property_address)}</td>

                <td>
                  <InlineStatusSelect
                    leadId={lead.id}
                    currentStage={lead.stage}
                  />
                </td>

                <td>{formatText(lead.priority)}</td>

                <td>{lead.lead_score ?? "-"}</td>

                <td>{formatText(lead.timeline)}</td>

                <td>
                  {lead.next_follow_up_at
                    ? new Date(lead.next_follow_up_at).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  {lead.created_at
                    ? new Date(lead.created_at).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}

            {!leads.length && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-6 text-center text-sm text-neutral-500"
                >
                  No leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}