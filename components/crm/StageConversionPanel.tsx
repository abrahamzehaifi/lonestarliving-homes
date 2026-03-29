type Lead = {
  id: string;
  stage: string;
  lead_quality: "priority_a" | "priority_b" | "priority_c" | null;
  priority: string | null;
};

type StageStats = {
  key: string;
  label: string;
  count: number;
};

const STAGE_ORDER = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "conversation", label: "Conversation" },
  { key: "appointment_set", label: "Appointment Set" },
  { key: "appointment_done", label: "Appointment Done" },
  { key: "follow_up", label: "Follow-Up" },
  { key: "listing_signed", label: "Listing Signed" },
  { key: "closed", label: "Closed" },
  { key: "lost", label: "Lost" },
  { key: "nurture", label: "Nurture" },
] as const;

function buildStageStats(leads: Lead[]): StageStats[] {
  return STAGE_ORDER.map((stage) => ({
    key: stage.key,
    label: stage.label,
    count: leads.filter((lead) => lead.stage === stage.key).length,
  }));
}

function pct(part: number, whole: number) {
  if (!whole) return "0%";
  return `${Math.round((part / whole) * 100)}%`;
}

export default function StageConversionPanel({
  leads,
}: {
  leads: Lead[];
}) {
  const stats = buildStageStats(leads);

  const newCount = stats.find((s) => s.key === "new")?.count ?? 0;
  const contactedCount = stats.find((s) => s.key === "contacted")?.count ?? 0;
  const appointmentCount =
    stats.find((s) => s.key === "appointment_set")?.count ?? 0;
  const signedCount = stats.find((s) => s.key === "listing_signed")?.count ?? 0;
  const closedCount = stats.find((s) => s.key === "closed")?.count ?? 0;
  const lostCount = stats.find((s) => s.key === "lost")?.count ?? 0;

  const highQualityActiveCount = leads.filter(
    (lead) =>
      lead.stage !== "closed" &&
      lead.stage !== "lost" &&
      (lead.lead_quality === "priority_a" || lead.priority === "high")
  ).length;

  return (
    <section className="rounded-2xl border bg-white p-4">
      <div className="mb-4">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-500">
          Stage conversion
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
          Where leads are getting stuck
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Track flow from first contact to appointment, signed business, and
          closed outcomes.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stage) => (
          <div
            key={stage.key}
            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
          >
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
              {stage.label}
            </p>
            <p className="mt-1 text-2xl font-semibold text-neutral-950">
              {stage.count}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="New → Contacted"
          value={pct(contactedCount, newCount)}
        />
        <MetricCard
          label="Contacted → Appointment"
          value={pct(appointmentCount, contactedCount)}
        />
        <MetricCard
          label="Appointment → Signed"
          value={pct(signedCount, appointmentCount)}
        />
        <MetricCard
          label="Signed → Closed"
          value={pct(closedCount, signedCount)}
        />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <MetricCard label="Closed" value={String(closedCount)} />
        <MetricCard label="Lost" value={String(lostCount)} />
        <MetricCard
          label="High quality active"
          value={String(highQualityActiveCount)}
        />
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold text-neutral-950">{value}</p>
    </div>
  );
}