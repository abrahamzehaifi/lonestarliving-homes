import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

import NextBestActionPanel from "@/components/crm/NextBestActionPanel";
import { CRM_STAGES } from "@/lib/crm/stages";
import LeadCreateForm from "@/components/crm/LeadCreateForm";
import PipelineColumn from "@/components/crm/PipelineColumn";
import LeadDetailPanel from "@/components/crm/LeadDetailPanel";
import RunFollowUpsButton from "@/components/crm/RunFollowUpsButton";

type SearchParams = Promise<{ lead?: string }>;

type CrmLead = {
  id: string;
  stage: string;
  created_at: string | null;
  next_follow_up_at: string | null;
  last_contacted_at: string | null;
  priority: string | null;
  lead_score: number | null;
  lead_quality: "priority_a" | "priority_b" | "priority_c" | null;

  full_name: string;
  property_address: string;
  motivation: string | null;
  source_detail: string | null;
  channel: string | null;
  phone: string | null;
  email: string | null;
};

async function getSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );
}

function priorityWeight(priority?: string | null) {
  if (priority === "high") return 3;
  if (priority === "normal") return 2;
  return 1;
}

function leadQualityWeight(lead: CrmLead) {
  if (lead.lead_quality === "priority_a") return 3;
  if (lead.lead_quality === "priority_b") return 2;
  if (lead.lead_quality === "priority_c") return 1;
  return 0;
}

function isOverdue(value?: string | null) {
  if (!value) return false;

  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return false;

  return time <= Date.now();
}

function sortLeadsForExecution(leads: CrmLead[]) {
  return [...leads].sort((a, b) => {
    const aOverdue = isOverdue(a.next_follow_up_at);
    const bOverdue = isOverdue(b.next_follow_up_at);

    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    const qualityDiff = leadQualityWeight(b) - leadQualityWeight(a);
    if (qualityDiff !== 0) return qualityDiff;

    const priorityDiff =
      priorityWeight(b.priority) - priorityWeight(a.priority);
    if (priorityDiff !== 0) return priorityDiff;

    const scoreA = typeof a.lead_score === "number" ? a.lead_score : -1;
    const scoreB = typeof b.lead_score === "number" ? b.lead_score : -1;
    if (scoreB !== scoreA) return scoreB - scoreA;

    const followUpA = a.next_follow_up_at
      ? new Date(a.next_follow_up_at).getTime()
      : Number.MAX_SAFE_INTEGER;

    const followUpB = b.next_follow_up_at
      ? new Date(b.next_follow_up_at).getTime()
      : Number.MAX_SAFE_INTEGER;

    if (followUpA !== followUpB) return followUpA - followUpB;

    const createdA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const createdB = b.created_at ? new Date(b.created_at).getTime() : 0;

    return createdB - createdA;
  });
}

export default async function CrmPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await getSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { lead: selectedLeadId } = await searchParams;

  const [
    { data: leads, error: leadsError },
    { data: activities, error: activitiesError },
  ] = await Promise.all([
    supabase
      .from("crm_leads")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("crm_activities")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  if (leadsError) throw new Error(leadsError.message);
  if (activitiesError) throw new Error(activitiesError.message);

  const normalizedLeads: CrmLead[] = (leads ?? []).map((lead: any) => ({
    id: lead.id,
    stage: lead.stage,
    created_at: lead.created_at ?? null,
    next_follow_up_at: lead.next_follow_up_at ?? null,
    last_contacted_at: lead.last_contacted_at ?? null,
    priority: lead.priority ?? null,
    lead_score: lead.lead_score ?? null,
    lead_quality: lead.lead_quality ?? null,

    full_name: lead.full_name ?? "",
    property_address: lead.property_address ?? "",
    motivation: lead.motivation ?? null,
    source_detail: lead.source_detail ?? null,
    channel: lead.channel ?? null,
    phone: lead.phone ?? null,
    email: lead.email ?? null,
  }));

  const sortedLeads = sortLeadsForExecution(normalizedLeads);

  const selectedLead =
    sortedLeads.find((lead) => lead.id === selectedLeadId) ??
    sortedLeads[0] ??
    null;

  const selectedActivities = selectedLead
    ? (activities ?? []).filter((a) => a.lead_id === selectedLead.id)
    : [];

  const today = new Date().toISOString();

  const kpis = {
    newLeads: sortedLeads.filter((l) => l.stage === "new_lead").length,
    followUpsDue: sortedLeads.filter(
      (l) => l.next_follow_up_at && l.next_follow_up_at <= today
    ).length,
    appointments: sortedLeads.filter((l) => l.stage === "appointment_set")
      .length,
    signed: sortedLeads.filter((l) => l.stage === "listing_signed").length,
    closed: sortedLeads.filter((l) => l.stage === "closed").length,
    highPriority: sortedLeads.filter((l) => l.priority === "high").length,
  };

  return (
    <main className="space-y-6 p-6">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <KpiCard label="New Leads" value={kpis.newLeads} />
        <KpiCard label="Follow-Ups Due" value={kpis.followUpsDue} />
        <KpiCard label="Appointments" value={kpis.appointments} />
        <KpiCard label="Listings Signed" value={kpis.signed} />
        <KpiCard label="Closed" value={kpis.closed} />
        <KpiCard label="High Priority" value={kpis.highPriority} />
      </section>

      <NextBestActionPanel leads={sortedLeads} />

      <section className="flex flex-wrap items-center gap-3">
        <RunFollowUpsButton />
      </section>

      <LeadCreateForm />

      <section className="grid gap-6 xl:grid-cols-[1.6fr_.9fr]">
        <div className="overflow-x-auto">
          <div className="flex min-w-max gap-4 pb-2">
            {CRM_STAGES.map((stage) => (
              <PipelineColumn
                key={stage.key}
                stage={stage}
                leads={sortedLeads.filter((lead) => lead.stage === stage.key)}
                selectedLeadId={selectedLead?.id ?? null}
              />
            ))}
          </div>
        </div>

        <LeadDetailPanel
          lead={selectedLead as any}
          activities={selectedActivities}
        />
      </section>
    </main>
  );
}

function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border p-4">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}