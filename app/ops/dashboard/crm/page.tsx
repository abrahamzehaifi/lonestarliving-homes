import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { CRM_STAGES } from "@/lib/crm/stages";
import LeadCreateForm from "@/components/crm/LeadCreateForm";
import PipelineColumn from "@/components/crm/PipelineColumn";
import LeadDetailPanel from "@/components/crm/LeadDetailPanel";

type SearchParams = Promise<{ lead?: string }>;

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

  const selectedLead =
    leads?.find((lead) => lead.id === selectedLeadId) ?? leads?.[0] ?? null;

  const selectedActivities = selectedLead
    ? (activities ?? []).filter((a) => a.lead_id === selectedLead.id)
    : [];

  const today = new Date().toISOString();

  const kpis = {
    newLeads: (leads ?? []).filter((l) => l.stage === "new_lead").length,
    followUpsDue: (leads ?? []).filter(
      (l) => l.next_follow_up_at && l.next_follow_up_at <= today
    ).length,
    appointments: (leads ?? []).filter((l) => l.stage === "appointment_set")
      .length,
    signed: (leads ?? []).filter((l) => l.stage === "listing_signed").length,
    closed: (leads ?? []).filter((l) => l.stage === "closed").length,
  };

  return (
    <main className="space-y-6 p-6">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border p-4">
          <p className="text-sm text-neutral-500">New Leads</p>
          <p className="text-2xl font-semibold">{kpis.newLeads}</p>
        </div>
        <div className="rounded-2xl border p-4">
          <p className="text-sm text-neutral-500">Follow-Ups Due</p>
          <p className="text-2xl font-semibold">{kpis.followUpsDue}</p>
        </div>
        <div className="rounded-2xl border p-4">
          <p className="text-sm text-neutral-500">Appointments</p>
          <p className="text-2xl font-semibold">{kpis.appointments}</p>
        </div>
        <div className="rounded-2xl border p-4">
          <p className="text-sm text-neutral-500">Listings Signed</p>
          <p className="text-2xl font-semibold">{kpis.signed}</p>
        </div>
        <div className="rounded-2xl border p-4">
          <p className="text-sm text-neutral-500">Closed</p>
          <p className="text-2xl font-semibold">{kpis.closed}</p>
        </div>
      </section>

      <LeadCreateForm />

      <section className="grid gap-6 xl:grid-cols-[1.6fr_.9fr]">
        <div className="overflow-x-auto">
          <div className="flex min-w-max gap-4 pb-2">
            {CRM_STAGES.map((stage) => (
              <PipelineColumn
                key={stage.key}
                stage={stage}
                leads={(leads ?? []).filter((lead) => lead.stage === stage.key)}
                selectedLeadId={selectedLead?.id ?? null}
              />
            ))}
          </div>
        </div>

        <LeadDetailPanel lead={selectedLead} activities={selectedActivities} />
      </section>
    </main>
  );
}