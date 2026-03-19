import Link from "next/link";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

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

export default async function LeadsPage({
  searchParams,
}: {
  searchParams?: Promise<{ area?: string }> | { area?: string };
}) {
  const sp =
    searchParams instanceof Promise ? await searchParams : searchParams;
  const selectedArea = sp?.area?.toLowerCase() || null;

  const supabase = createSupabaseServiceClient();

  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (selectedArea) {
    query = query.eq("area", selectedArea);
  }

  const { data: leads } = await query;
  const { data: allLeads } = await supabase.from("leads").select("area");

  const areaCounts: Record<string, number> = {};

  allLeads?.forEach((lead) => {
    if (!lead.area) return;
    const key = String(lead.area).toLowerCase();
    areaCounts[key] = (areaCounts[key] || 0) + 1;
  });

  const sortedAreas = Object.entries(areaCounts).sort((a, b) => b[1] - a[1]);

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
            href="/ops/leads"
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
              href={`/ops/leads?area=${encodeURIComponent(area)}`}
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

      <div className="mt-8 overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-[0.12em] text-neutral-500">
              <th className="px-4 py-3">Name</th>
              <th>Type</th>
              <th>Area</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Quality</th>
              <th>Timeline</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {leads?.map((lead) => (
              <tr key={lead.id} className="border-b text-sm">
                <td className="px-4 py-3 font-medium text-neutral-900">
                  <Link
                    href={`/ops/leads/${lead.id}`}
                    className="hover:underline"
                  >
                    {lead.name}
                  </Link>
                </td>

                <td>{lead.lead_type || "-"}</td>

                <td>
                  <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-medium">
                    {formatArea(lead.area)}
                  </span>
                </td>

                <td>{formatCurrency(lead.budget)}</td>

                <td>{lead.status || "-"}</td>

                <td>{lead.lead_quality || "-"}</td>

                <td>{lead.timeline || "-"}</td>

                <td>
                  {lead.created_at
                    ? new Date(lead.created_at).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}

            {!leads?.length && (
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