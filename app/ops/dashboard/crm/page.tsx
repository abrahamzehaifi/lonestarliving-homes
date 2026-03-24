import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

import SellerOpportunityPanel from "@/components/crm/SellerOpportunityPanel";
import DailyCadencePanel from "@/components/crm/DailyCadencePanel";
import WeeklyScoreboardPanel from "@/components/crm/WeeklyScoreboardPanel";
import TaskQueuePanel from "@/components/crm/TaskQueuePanel";
import HotLeadsPanel from "@/components/crm/HotLeadsPanel";
import NextBestActionPanel from "@/components/crm/NextBestActionPanel";
import SourcePerformancePanel from "@/components/crm/SourcePerformancePanel";
import StageConversionPanel from "@/components/crm/StageConversionPanel";
import StaleLeadsPanel from "@/components/crm/StaleLeadsPanel";

import { CRM_STAGES } from "@/lib/crm/stages";
import LeadCreateForm from "@/components/crm/LeadCreateForm";
import PipelineColumn from "@/components/crm/PipelineColumn";
import LeadDetailPanel from "@/components/crm/LeadDetailPanel";
import RunFollowUpsButton from "@/components/crm/RunFollowUpsButton";

type SearchParams = Promise<{ lead?: string }>;

type CrmActivity = {
  id: string;
  lead_id: string;
  activity_type: string;
  content: string;
  created_at: string;
};

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

    return (b.lead_score ?? 0) - (a.lead_score ?? 0);
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

  const [{ data: leads }, { data: activities }] = await Promise.all([
    supabase.from("crm_leads").select("*").eq("user_id", user.id),
    supabase.from("crm_activities").select("*").eq("user_id", user.id),
  ]);

  const normalizedLeads: CrmLead[] = (leads ?? []).map((l: any) => ({
    id: l.id,
    stage: l.stage,
    created_at: l.created_at ?? null,
    next_follow_up_at: l.next_follow_up_at ?? null,
    last_contacted_at: l.last_contacted_at ?? null,
    priority: l.priority ?? null,
    lead_score: l.lead_score ?? null,
    lead_quality: l.lead_quality ?? null,

    full_name: l.full_name ?? "",
    property_address: l.property_address ?? "",
    motivation: l.motivation ?? null,
    source_detail: l.source_detail ?? null,
    channel: l.channel ?? null,
    phone: l.phone ?? null,
    email: l.email ?? null,
  }));

  const normalizedActivities: CrmActivity[] = (activities ?? []).map(
    (a: any) => ({
      id: a.id,
      lead_id: a.lead_id,
      activity_type: a.activity_type,
      content: a.content,
      created_at: a.created_at,
    })
  );

  const sortedLeads = sortLeadsForExecution(normalizedLeads);

  const selectedLead =
    sortedLeads.find((l) => l.id === selectedLeadId) ??
    sortedLeads[0] ??
    null;

  const selectedActivities = selectedLead
    ? normalizedActivities.filter((a) => a.lead_id === selectedLead.id)
    : [];

  return (
    <main className="space-y-6 p-6">
      <DailyCadencePanel
        leads={sortedLeads}
        activities={normalizedActivities}
      />

      <WeeklyScoreboardPanel
        leads={sortedLeads}
        activities={normalizedActivities}
      />

      <HotLeadsPanel leads={sortedLeads} />

      <TaskQueuePanel leads={sortedLeads} />

      <SellerOpportunityPanel leads={sortedLeads} />

      <NextBestActionPanel leads={sortedLeads} />

      <SourcePerformancePanel leads={sortedLeads} />

      <StageConversionPanel leads={sortedLeads} />

      <StaleLeadsPanel leads={sortedLeads} />

      <section className="flex flex-wrap gap-3">
        <RunFollowUpsButton />
      </section>

      <LeadCreateForm />

      <section className="grid gap-6 xl:grid-cols-[1.6fr_.9fr]">
        <div className="flex gap-4 overflow-x-auto">
          {CRM_STAGES.map((stage) => (
            <PipelineColumn
              key={stage.key}
              stage={stage}
              leads={sortedLeads.filter((l) => l.stage === stage.key)}
              selectedLeadId={selectedLead?.id ?? null}
            />
          ))}
        </div>

        <LeadDetailPanel
          lead={selectedLead as any}
          activities={selectedActivities}
        />
      </section>
    </main>
  );
}