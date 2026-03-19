import LeadActions from "./LeadActions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

function formatArea(area?: string | null) {
  if (!area) return "-";
  return area
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function formatCurrency(value?: number | null) {
  if (!value) return "-";
  return `$${Number(value).toLocaleString()}`;
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams =
    params instanceof Promise ? await params : params;

  const supabase = createSupabaseServiceClient();

  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (!lead) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/ops/leads"
        className="text-sm text-neutral-500 transition hover:text-neutral-900"
      >
        ← Back to leads
      </Link>

      <div className="mt-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          {lead.name}
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          {lead.email || "-"} • {lead.phone || "-"}
        </p>
      </div>

      <LeadActions lead={lead} />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-black/5 bg-white p-5">
          <h2 className="text-sm font-semibold text-neutral-500">
            Lead Overview
          </h2>

          <div className="mt-3 space-y-2 text-sm">
            <p>
              <strong>Type:</strong> {lead.lead_type || "-"}
            </p>
            <p>
              <strong>Segment:</strong> {lead.segment || "-"}
            </p>
            <p>
              <strong>Status:</strong> {lead.status || "-"}
            </p>
            <p>
              <strong>Quality:</strong> {lead.lead_quality || "-"}
            </p>
            <p>
              <strong>Timeline:</strong> {lead.timeline || "-"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-5">
          <h2 className="text-sm font-semibold text-neutral-500">
            Location Context
          </h2>

          <div className="mt-3 space-y-2 text-sm">
            <p>
              <strong>Area:</strong> {formatArea(lead.area)}
            </p>
            <p>
              <strong>Budget:</strong> {formatCurrency(lead.budget)}
            </p>
            <p>
              <strong>Move-in:</strong> {lead.move_in_date || "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5">
        <h2 className="text-sm font-semibold text-neutral-500">
          Client Message
        </h2>

        <p className="mt-3 whitespace-pre-wrap text-sm text-neutral-700">
          {lead.message || "No message provided"}
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5">
        <h2 className="text-sm font-semibold text-neutral-500">
          Source Intelligence
        </h2>

        <div className="mt-3 space-y-2 text-sm">
          <p>
            <strong>Source:</strong> {lead.source || "-"}
          </p>
          <p>
            <strong>Page:</strong> {lead.source_page || "-"}
          </p>
          <p>
            <strong>Path:</strong> {lead.source_path || "-"}
          </p>
          <p>
            <strong>Language:</strong> {lead.lang || "-"}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-black/5 bg-neutral-50 p-5">
        <h2 className="text-sm font-semibold text-neutral-500">
          Raw Intake Data
        </h2>

        <pre className="mt-3 overflow-x-auto text-xs text-neutral-600">
          {JSON.stringify(lead, null, 2)}
        </pre>
      </div>
    </main>
  );
}