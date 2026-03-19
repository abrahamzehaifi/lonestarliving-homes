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

function labelize(value: string | null | undefined) {
  if (!value) return "—";
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function StatusPill({ status }: { status: string | null }) {
  return (
    <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium">
      {labelize(status)}
    </span>
  );
}

function LeadCard({ lead }: { lead: LeadRow }) {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-5">
      <div className="flex justify-between gap-3">
        <Link
          href={`/ops/leads/${lead.id}`}
          className="font-semibold hover:underline"
        >
          {lead.name}
        </Link>

        <span className="text-xs text-neutral-500">
          {formatDate(lead.created_at)}
        </span>
      </div>

      <div className="mt-2 flex gap-2">
        <StatusPill status={lead.status} />
      </div>

      <p className="mt-3 text-sm text-neutral-600">
        {lead.next_action || "No next action"}
      </p>

      <p className="mt-1 text-xs text-neutral-500">
        {lead.follow_up_at ? formatDate(lead.follow_up_at) : "No follow-up"}
      </p>

      <div className="mt-4">
        <LeadQuickActions leadId={lead.id} currentStatus={lead.status} />
      </div>

      <div className="mt-4 flex gap-3">
        <Link
          href={`/ops/leads/${lead.id}`}
          className="rounded-full bg-neutral-900 px-3 py-1 text-sm text-white"
        >
          Open
        </Link>

        <Link
          href="/ops/leads"
          className="rounded-full border px-3 py-1 text-sm"
        >
          All Leads
        </Link>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] border border-black/5 bg-white p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

export default async function OpsTodayPage() {
  const supabase = createSupabaseServiceClient();

  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const leads = (data || []) as LeadRow[];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdue = leads.filter(
    (l) =>
      l.follow_up_at &&
      new Date(l.follow_up_at) < today &&
      l.status !== "closed" &&
      l.status !== "lost"
  );

  const dueToday = leads.filter((l) => {
    if (!l.follow_up_at) return false;
    const d = new Date(l.follow_up_at);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Today</h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/ops/leads"
          className="rounded-full border px-4 py-2 text-sm"
        >
          Full Leads
        </Link>

        <Link
          href="/ops/pipeline"
          className="rounded-full border px-4 py-2 text-sm"
        >
          Pipeline
        </Link>
      </div>

      <div className="mt-8 grid gap-6">
        <Section title="Overdue Follow-ups">
          {overdue.length === 0 ? (
            <p className="text-sm text-neutral-500">None</p>
          ) : (
            overdue.map((lead) => <LeadCard key={lead.id} lead={lead} />)
          )}
        </Section>

        <Section title="Due Today">
          {dueToday.length === 0 ? (
            <p className="text-sm text-neutral-500">None</p>
          ) : (
            dueToday.map((lead) => <LeadCard key={lead.id} lead={lead} />)
          )}
        </Section>
      </div>
    </main>
  );
}