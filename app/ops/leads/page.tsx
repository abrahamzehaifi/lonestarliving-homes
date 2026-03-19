import Link from "next/link";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import LeadStatusInline from "@/components/dashboard/LeadStatusInline";

function formatArea(area?: string | null) {
  if (!area) return "Unknown";
  return area
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function formatCurrency(value?: number | null) {
  if (!value) return "-";
  return `$${value.toLocaleString()}`;
}

function formatLabel(value?: string | null) {
  if (!value) return "-";
  return value.replace(/_/g, " ");
}

function isToday(dateStr?: string | null) {
  if (!dateStr) return false;

  const today = new Date();
  const d = new Date(dateStr);

  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

function isOverdue(dateStr?: string | null) {
  if (!dateStr) return false;

  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return d.getTime() < today.getTime();
}

function buildFilterHref(filters: {
  area?: string | null;
  status?: string | null;
  quality?: string | null;
  followup?: string | null;
}) {
  const params = new URLSearchParams();

  if (filters.area) params.set("area", filters.area);
  if (filters.status) params.set("status", filters.status);
  if (filters.quality) params.set("quality", filters.quality);
  if (filters.followup) params.set("followup", filters.followup);

  const query = params.toString();
  return query ? `/ops/leads?${query}` : "/ops/leads";
}

type LeadRow = {
  id: string;
  created_at: string | null;
  name: string | null;
  lead_type: string | null;
  area: string | null;
  budget: number | null;
  status: string | null;
  lead_quality: string | null;
  timeline: string | null;
  follow_up_at: string | null;
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams?:
    | Promise<{
        area?: string;
        status?: string;
        quality?: string;
        followup?: string;
      }>
    | {
        area?: string;
        status?: string;
        quality?: string;
        followup?: string;
      };
}) {
  const sp =
    searchParams instanceof Promise ? await searchParams : searchParams;

  const selectedArea = sp?.area?.toLowerCase() || null;
  const selectedStatus = sp?.status?.toLowerCase() || null;
  const selectedQuality = sp?.quality?.toLowerCase() || null;
  const selectedFollowup = sp?.followup?.toLowerCase() || null;

  const supabase = createSupabaseServiceClient();

  let query = supabase
    .from("leads")
    .select(
      "id, created_at, name, lead_type, area, budget, status, lead_quality, timeline, follow_up_at"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (selectedArea) {
    query = query.eq("area", selectedArea);
  }

  if (selectedStatus) {
    query = query.eq("status", selectedStatus);
  }

  if (selectedQuality) {
    query = query.eq("lead_quality", selectedQuality);
  }

  const { data } = await query;

  const leads: LeadRow[] = ((data || []) as LeadRow[]).filter((lead) => {
    if (selectedFollowup === "today") {
      return isToday(lead.follow_up_at);
    }

    if (selectedFollowup === "overdue") {
      return (
        isOverdue(lead.follow_up_at) &&
        !isToday(lead.follow_up_at) &&
        lead.status !== "closed" &&
        lead.status !== "lost"
      );
    }

    return true;
  });

  const { data: allLeads } = await supabase
    .from("leads")
    .select("area, status, lead_quality");

  const areaCounts: Record<string, number> = {};
  const statusCounts: Record<string, number> = {};
  const qualityCounts: Record<string, number> = {};

  allLeads?.forEach((lead) => {
    if (lead.area) {
      const key = String(lead.area).toLowerCase();
      areaCounts[key] = (areaCounts[key] || 0) + 1;
    }

    if (lead.status) {
      const key = String(lead.status).toLowerCase();
      statusCounts[key] = (statusCounts[key] || 0) + 1;
    }

    if (lead.lead_quality) {
      const key = String(lead.lead_quality).toLowerCase();
      qualityCounts[key] = (qualityCounts[key] || 0) + 1;
    }
  });

  const sortedAreas = Object.entries(areaCounts).sort((a, b) => b[1] - a[1]);

  const statusOrder = [
    "new",
    "contacted",
    "qualified",
    "showing",
    "application",
    "closed",
    "lost",
  ];

  const sortedStatuses = statusOrder
    .filter((status) => statusCounts[status])
    .map((status) => [status, statusCounts[status]] as const);

  const qualityOrder = ["priority_a", "priority_b", "priority_c"];

  const sortedQualities = qualityOrder
    .filter((quality) => qualityCounts[quality])
    .map((quality) => [quality, qualityCounts[quality]] as const);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Leads</h1>

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
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5">
        <p className="text-sm font-medium text-neutral-500">Filter by area</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={buildFilterHref({
              status: selectedStatus,
              quality: selectedQuality,
              followup: selectedFollowup,
            })}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              !selectedArea
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-black/10 bg-neutral-50 text-neutral-700"
            }`}
          >
            All
          </Link>

          {sortedAreas.map(([area, count]) => (
            <Link
              key={area}
              href={buildFilterHref({
                area,
                status: selectedStatus,
                quality: selectedQuality,
                followup: selectedFollowup,
              })}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                selectedArea === area
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-black/10 bg-neutral-50 text-neutral-700 hover:bg-white"
              }`}
            >
              {formatArea(area)} ({count})
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-black/5 bg-white p-5">
        <p className="text-sm font-medium text-neutral-500">Filter by status</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={buildFilterHref({
              area: selectedArea,
              quality: selectedQuality,
              followup: selectedFollowup,
            })}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              !selectedStatus
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-black/10 bg-neutral-50 text-neutral-700"
            }`}
          >
            All
          </Link>

          {sortedStatuses.map(([status, count]) => (
            <Link
              key={status}
              href={buildFilterHref({
                area: selectedArea,
                status,
                quality: selectedQuality,
                followup: selectedFollowup,
              })}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                selectedStatus === status
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-black/10 bg-neutral-50 text-neutral-700 hover:bg-white"
              }`}
            >
              {formatLabel(status)} ({count})
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-black/5 bg-white p-5">
        <p className="text-sm font-medium text-neutral-500">Filter by quality</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={buildFilterHref({
              area: selectedArea,
              status: selectedStatus,
              followup: selectedFollowup,
            })}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              !selectedQuality
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-black/10 bg-neutral-50 text-neutral-700"
            }`}
          >
            All
          </Link>

          {sortedQualities.map(([quality, count]) => (
            <Link
              key={quality}
              href={buildFilterHref({
                area: selectedArea,
                status: selectedStatus,
                quality,
                followup: selectedFollowup,
              })}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                selectedQuality === quality
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-black/10 bg-neutral-50 text-neutral-700 hover:bg-white"
              }`}
            >
              {formatLabel(quality)} ({count})
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
              area: selectedArea,
              status: selectedStatus,
              quality: selectedQuality,
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
              area: selectedArea,
              status: selectedStatus,
              quality: selectedQuality,
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
              area: selectedArea,
              status: selectedStatus,
              quality: selectedQuality,
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
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Quality</th>
              <th className="px-4 py-3">Timeline</th>
              <th className="px-4 py-3">Created</th>
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
                    {lead.name || "Unnamed lead"}
                  </Link>
                </td>

                <td className="px-4 py-3">{lead.lead_type || "-"}</td>

                <td className="px-4 py-3">
                  <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-medium">
                    {formatArea(lead.area)}
                  </span>
                </td>

                <td className="px-4 py-3">{formatCurrency(lead.budget)}</td>

                <td className="px-4 py-3">
                  <LeadStatusInline
                    leadId={lead.id}
                    initialStatus={lead.status}
                  />
                </td>

                <td className="px-4 py-3">{formatLabel(lead.lead_quality)}</td>

                <td className="px-4 py-3">{lead.timeline || "-"}</td>

                <td className="px-4 py-3">
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