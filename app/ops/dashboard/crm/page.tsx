import { createSupabaseServiceClient } from "@/lib/supabase/service";

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
  return createSupabaseServiceClient();
}

function isOverdue(value?: string | null) {
  if (!value) return false;

  const time = new Date(value).getTime();
  return !Number.isNaN(time) && time <= Date.now();
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

function normalizeLead(row: any): CrmLead {
  return {
    id: String(row?.id ?? "").trim(),
    stage: String(row?.stage ?? "new").trim().toLowerCase(),
    created_at: row?.created_at ?? null,
    next_follow_up_at: row?.next_follow_up_at ?? null,
    last_contacted_at: row?.last_contacted_at ?? null,
    priority:
      typeof row?.priority === "string"
        ? row.priority.trim().toLowerCase()
        : null,
    lead_score:
      typeof row?.lead_score === "number"
        ? row.lead_score
        : Number.isFinite(Number(row?.lead_score))
        ? Number(row.lead_score)
        : null,
    lead_quality: row?.lead_quality ?? null,

    full_name: String(row?.full_name ?? ""),
    property_address: String(row?.property_address ?? ""),
    motivation: row?.motivation ?? null,
    source_detail: row?.source_detail ?? null,
    channel: row?.channel ?? null,
    phone: row?.phone ?? null,
    email: row?.email ?? null,
  };
}

function normalizeActivity(row: any): CrmActivity | null {
  const id = String(row?.id ?? "").trim();
  const lead_id = String(row?.lead_id ?? "").trim();
  const activity_type = String(row?.activity_type ?? "note").trim();
  const content = String(row?.content ?? "").trim();
  const created_at = String(row?.created_at ?? "").trim();

  if (!id || !lead_id || !content || !created_at) return null;

  return {
    id,
    lead_id,
    activity_type,
    content,
    created_at,
  };
}

export default async function CrmPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await getSupabase();
  const { lead: selectedLeadId } = await searchParams;

  const [leadsResult, activitiesResult] = await Promise.all([
    supabase
      .from("crm_leads")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("crm_activities")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  if (leadsResult.error) {
    console.error("CRM PAGE LEADS ERROR:", leadsResult.error);
  }

  if (activitiesResult.error) {
    console.error("CRM PAGE ACTIVITIES ERROR:", activitiesResult.error);
  }

  const normalizedLeads: CrmLead[] = Array.isArray(leadsResult.data)
    ? leadsResult.data.map(normalizeLead).filter((l) => l.id)
    : [];

  const normalizedActivities: CrmActivity[] = Array.isArray(activitiesResult.data)
    ? activitiesResult.data
        .map(normalizeActivity)
        .filter((a): a is CrmActivity => Boolean(a))
    : [];

  const sortedLeads = sortLeadsForExecution(normalizedLeads);

  const selectedLead =
    sortedLeads.find((l) => l.id === selectedLeadId) ?? sortedLeads[0] ?? null;

  const selectedActivities = selectedLead
    ? normalizedActivities
        .filter((a) => a.lead_id === selectedLead.id)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
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
          lead={selectedLead}
          activities={selectedActivities}
        />
      </section>
    </main>
  );
}