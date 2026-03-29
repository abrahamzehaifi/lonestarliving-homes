import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

function formatText(value?: string | null) {
  return value && String(value).trim() ? value : "-";
}

function formatCurrency(value?: number | null) {
  if (value === null || value === undefined) return "-";
  return `$${Number(value).toLocaleString()}`;
}

function formatDateTime(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

function formatStage(value?: string | null) {
  if (!value) return "-";
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams =
    params instanceof Promise ? await params : params;

  const supabase = createSupabaseServiceClient();

  const { data: lead, error } = await supabase
    .from("crm_leads")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !lead) {
    notFound();
  }

  const { data: activities } = await supabase
    .from("crm_activities")
    .select("*")
    .eq("lead_id", resolvedParams.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/ops/dashboard/crm"
        className="text-sm text-neutral-500 transition hover:text-neutral-900"
      >
        ← Back to CRM
      </Link>

      <div className="mt-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          {lead.full_name || "Unnamed lead"}
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          {formatText(lead.email)} • {formatText(lead.phone)}
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-black/5 bg-white p-5">
          <h2 className="text-sm font-semibold text-neutral-500">
            CRM Overview
          </h2>

          <div className="mt-3 space-y-2 text-sm">
            <p>
              <strong>Stage:</strong> {formatStage(lead.stage)}
            </p>
            <p>
              <strong>Priority:</strong> {formatText(lead.priority)}
            </p>
            <p>
              <strong>Lead score:</strong> {lead.lead_score ?? "-"}
            </p>
            <p>
              <strong>Lead quality:</strong> {formatText(lead.lead_quality)}
            </p>
            <p>
              <strong>Motivation:</strong> {formatText(lead.motivation)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-5">
          <h2 className="text-sm font-semibold text-neutral-500">
            Follow-Up
          </h2>

          <div className="mt-3 space-y-2 text-sm">
            <p>
              <strong>Next follow-up:</strong> {formatDateTime(lead.next_follow_up_at)}
            </p>
            <p>
              <strong>Last contacted:</strong> {formatDateTime(lead.last_contacted_at)}
            </p>
            <p>
              <strong>Created:</strong> {formatDateTime(lead.created_at)}
            </p>
            <p>
              <strong>Property address:</strong> {formatText(lead.property_address)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-black/5 bg-white p-5">
          <h2 className="text-sm font-semibold text-neutral-500">
            Qualification Notes
          </h2>

          <div className="mt-3 space-y-2 text-sm">
            <p>
              <strong>Timeline:</strong> {formatText(lead.timeline)}
            </p>
            <p>
              <strong>Pain point:</strong> {formatText(lead.pain_point)}
            </p>
            <p>
              <strong>Price expectation:</strong> {formatCurrency(lead.price_expectation)}
            </p>
            <p>
              <strong>Market low:</strong> {formatCurrency(lead.market_low)}
            </p>
            <p>
              <strong>Market high:</strong> {formatCurrency(lead.market_high)}
            </p>
            <p>
              <strong>Recommended price:</strong> {formatCurrency(lead.recommended_price)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-5">
          <h2 className="text-sm font-semibold text-neutral-500">
            Intake / Source
          </h2>

          <div className="mt-3 space-y-2 text-sm">
            <p>
              <strong>Source detail:</strong> {formatText(lead.source_detail)}
            </p>
            <p>
              <strong>Channel:</strong> {formatText(lead.channel)}
            </p>
            <p>
              <strong>CMA notes:</strong> {formatText(lead.cma_notes)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5">
        <h2 className="text-sm font-semibold text-neutral-500">
          Activity Log
        </h2>

        <div className="mt-4 space-y-3">
          {(activities || []).length ? (
            (activities || []).map((activity: any) => (
              <div
                key={activity.id}
                className="rounded-xl border border-black/5 bg-neutral-50 px-4 py-3"
              >
                <p className="text-sm font-medium text-neutral-900">
                  {formatText(activity.activity_type)}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {formatText(activity.content)}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {formatDateTime(activity.created_at)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-neutral-500">No activity yet.</p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-black/5 bg-neutral-50 p-5">
        <h2 className="text-sm font-semibold text-neutral-500">
          Raw CRM Record
        </h2>

        <pre className="mt-3 overflow-x-auto text-xs text-neutral-600">
          {JSON.stringify(lead, null, 2)}
        </pre>
      </div>
    </main>
  );
}