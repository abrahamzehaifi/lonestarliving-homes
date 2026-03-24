import Link from "next/link";

type Lead = {
  id: string;
  full_name: string;
  stage: string;
  priority: string | null;
  lead_quality: "priority_a" | "priority_b" | "priority_c" | null;
  last_contacted_at: string | null;
  created_at: string | null;
  next_follow_up_at: string | null;
  phone: string | null;
  source_detail: string | null;
};

function daysSince(value: string | null) {
  if (!value) return null;

  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return null;

  return Math.floor((Date.now() - time) / (1000 * 60 * 60 * 24));
}

function isOverdue(value: string | null) {
  if (!value) return false;

  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return false;

  return time <= Date.now();
}

function getLastTouchDays(lead: Lead) {
  return daysSince(lead.last_contacted_at) ?? daysSince(lead.created_at);
}

function isStale(lead: Lead) {
  const age = getLastTouchDays(lead);
  if (age === null) return false;

  if (lead.stage === "closed" || lead.stage === "lost") return false;

  if (lead.lead_quality === "priority_a" || lead.priority === "high") {
    return age >= 2;
  }

  if (lead.stage === "appointment_set") {
    return age >= 2;
  }

  if (lead.stage === "contacted") {
    return age >= 3;
  }

  return age >= 5;
}

function getStaleReason(lead: Lead) {
  const age = getLastTouchDays(lead);

  if (isOverdue(lead.next_follow_up_at)) return "Overdue follow-up";
  if (lead.lead_quality === "priority_a") return "Priority A aging";
  if (lead.priority === "high") return "High-priority lead aging";
  if (lead.stage === "appointment_set") return "Appointment stage stalled";
  if (lead.stage === "contacted") return "Contacted but not advanced";
  if (typeof age === "number") return `No touch in ${age}d`;
  return "Needs review";
}

function formatDays(value: number | null) {
  if (value === null) return "—";
  if (value === 0) return "Today";
  if (value === 1) return "1 day";
  return `${value} days`;
}

function staleScore(lead: Lead) {
  let score = 0;

  if (isOverdue(lead.next_follow_up_at)) score += 50;
  if (lead.lead_quality === "priority_a") score += 25;
  if (lead.priority === "high") score += 20;
  if (lead.stage === "appointment_set") score += 15;
  if (lead.stage === "contacted") score += 10;

  const age = getLastTouchDays(lead);
  if (typeof age === "number") score += Math.min(age, 14);

  return score;
}

export default function StaleLeadsPanel({
  leads,
}: {
  leads: Lead[];
}) {
  const staleLeads = [...leads]
    .filter(isStale)
    .sort((a, b) => staleScore(b) - staleScore(a))
    .slice(0, 8);

  return (
    <section className="rounded-2xl border bg-white p-4">
      <div className="mb-4">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-500">
          Stale leads
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
          Deals that may be slipping
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Surface leads that need immediate re-engagement before they die quietly.
        </p>
      </div>

      {staleLeads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-sm text-neutral-500">
          No stale leads right now.
        </div>
      ) : (
        <div className="space-y-3">
          {staleLeads.map((lead) => {
            const age = getLastTouchDays(lead);
            const overdue = isOverdue(lead.next_follow_up_at);

            return (
              <div
                key={lead.id}
                className={`rounded-2xl border p-4 ${
                  overdue
                    ? "border-red-300 bg-red-50"
                    : "border-neutral-200 bg-neutral-50"
                }`}
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-medium text-neutral-950">{lead.full_name}</p>
                    <p className="mt-1 text-sm text-neutral-600">
                      {lead.stage} · {getStaleReason(lead)}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      Last touch: {formatDays(age)} ago
                      {lead.source_detail ? ` · ${lead.source_detail}` : ""}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {lead.phone ? (
                      <a
                        href={`tel:${lead.phone}`}
                        className="inline-flex items-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                      >
                        Call
                      </a>
                    ) : null}

                    <Link
                      href={`/ops/dashboard/crm?lead=${lead.id}`}
                      className="inline-flex items-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}