import type { ReactNode } from "react";
import Link from "next/link";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import LeadQuickActions from "@/components/dashboard/LeadQuickActions";

export const dynamic = "force-dynamic";

type CrmLeadRow = {
  id: string;
  created_at: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  property_address: string | null;
  stage: string | null;
  lead_quality: string | null;
  next_follow_up_at: string | null;
  timeline: string | null;
  source_detail: string | null;
  priority: string | null;
  lead_score: number | null;
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

function formatText(value: string | null | undefined) {
  return value && value.trim() ? value : "—";
}

function StatusPill({ status }: { status: string | null }) {
  return (
    <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium">
      {labelize(status)}
    </span>
  );
}

function LeadCard({ lead }: { lead: CrmLeadRow }) {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-5">
      <div className="flex justify-between gap-3">
        <Link
          href={`/ops/leads/${lead.id}`}
          className="font-semibold hover:underline"
        >
          {formatText(lead.full_name)}
        </Link>

        <span className="text-xs text-neutral-500">
          {formatDate(lead.created_at)}
        </span>
      </div>

      <div className="mt-2 flex gap-2">
        <StatusPill status={lead.stage} />
      </div>

      <p className="mt-3 text-sm text-neutral-600">
        {formatText(lead.property_address)}
      </p>

      <p className="mt-1 text-xs text-neutral-500">
        {lead.next_follow_up_at
          ? formatDate(lead.next_follow_up_at)
          : "No follow-up"}
      </p>

      <div className="mt-4">
        <LeadQuickActions leadId={lead.id} currentStage={lead.stage} />
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

  const { data, error } = await supabase
    .from("crm_leads")
    .select(
      "id, created_at, full_name, email, phone, property_address, stage, lead_quality, next_follow_up_at, timeline, source_detail, priority, lead_score"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("OPS TODAY LOAD ERROR:", error);
  }

  const leads = (data || []) as CrmLeadRow[];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdue = leads.filter(
    (l) =>
      l.next_follow_up_at &&
      new Date(l.next_follow_up_at) < today &&
      l.stage !== "closed" &&
      l.stage !== "lost"
  );

  const dueToday = leads.filter((l) => {
    if (!l.next_follow_up_at) return false;
    const d = new Date(l.next_follow_up_at);
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

        <Link
          href="/ops/dashboard/crm"
          className="rounded-full border px-4 py-2 text-sm"
        >
          CRM
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