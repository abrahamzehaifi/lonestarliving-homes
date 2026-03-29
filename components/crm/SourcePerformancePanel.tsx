type Lead = {
  id: string;
  stage: string;
  priority: string | null;
  lead_quality: "priority_a" | "priority_b" | "priority_c" | null;
  source_detail: string | null;
  channel: string | null;
};

type SourceBucket = {
  key: string;
  label: string;
  total: number;
  priorityA: number;
  highPriority: number;
  appointments: number;
  closed: number;
  lost: number;
};

function normalizeSource(lead: Lead) {
  const sourceDetail = (lead.source_detail || "").trim().toLowerCase();
  const channel = (lead.channel || "").trim().toLowerCase();

  if (sourceDetail.includes("expired")) return "expired";
  if (sourceDetail.includes("withdrawn")) return "withdrawn";
  if (sourceDetail.includes("terminated")) return "terminated";
  if (sourceDetail.includes("referral")) return "referral";
  if (sourceDetail.includes("medical")) return "medical_center";
  if (sourceDetail.includes("seo")) return "seo";

  if (channel === "organic") return "organic";
  if (channel === "direct") return "direct";
  if (channel === "referral") return "referral";
  if (channel === "outbound") return "outbound";

  // Avoid overly fragmented buckets from random source_detail strings
  if (sourceDetail) return "other_tagged";
  if (channel) return channel;

  return "other";
}

function formatLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildBuckets(leads: Lead[]): SourceBucket[] {
  const map = new Map<string, SourceBucket>();

  for (const lead of leads) {
    const key = normalizeSource(lead);
    const stage = (lead.stage || "").trim().toLowerCase();
    const priority = (lead.priority || "").trim().toLowerCase();

    if (!map.has(key)) {
      map.set(key, {
        key,
        label: formatLabel(key),
        total: 0,
        priorityA: 0,
        highPriority: 0,
        appointments: 0,
        closed: 0,
        lost: 0,
      });
    }

    const bucket = map.get(key)!;

    bucket.total += 1;

    if (lead.lead_quality === "priority_a") {
      bucket.priorityA += 1;
    }

    if (priority === "high") {
      bucket.highPriority += 1;
    }

    if (stage === "appointment_set" || stage === "appointment_done") {
      bucket.appointments += 1;
    }

    if (stage === "closed") {
      bucket.closed += 1;
    }

    if (stage === "lost") {
      bucket.lost += 1;
    }
  }

  return [...map.values()].sort((a, b) => {
    if (b.priorityA !== a.priorityA) return b.priorityA - a.priorityA;
    if (b.highPriority !== a.highPriority) return b.highPriority - a.highPriority;
    if (b.appointments !== a.appointments) return b.appointments - a.appointments;
    if (b.closed !== a.closed) return b.closed - a.closed;
    return b.total - a.total;
  });
}

export default function SourcePerformancePanel({
  leads,
}: {
  leads: Lead[];
}) {
  const buckets = buildBuckets(leads);
  const topBuckets = buckets.slice(0, 6);

  return (
    <section className="rounded-2xl border bg-white p-4">
      <div className="mb-4">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-500">
          Source performance
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
          Which sources are producing better leads
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Prioritizes sources generating Priority A leads, high-priority leads,
          and appointments.
        </p>
      </div>

      {topBuckets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-sm text-neutral-500">
          No source data yet.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {topBuckets.map((bucket) => (
            <div
              key={bucket.key}
              className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-neutral-950">{bucket.label}</h3>
                <span className="rounded-full border bg-white px-2 py-1 text-xs text-neutral-600">
                  {bucket.total} total
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Metric label="Priority A" value={bucket.priorityA} />
                <Metric label="High Priority" value={bucket.highPriority} />
                <Metric label="Appointments" value={bucket.appointments} />
                <Metric label="Closed" value={bucket.closed} />
              </div>

              {bucket.lost > 0 ? (
                <p className="mt-3 text-xs text-neutral-500">
                  Lost: {bucket.lost}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
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