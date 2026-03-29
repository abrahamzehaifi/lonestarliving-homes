import Link from "next/link";

type Lead = {
  id: string;
  full_name: string;
  stage: string;
  priority: string | null;
  lead_quality: "priority_a" | "priority_b" | "priority_c" | null;
  lead_score: number | null;
  next_follow_up_at: string | null;
  last_contacted_at: string | null;
  created_at: string | null;
  phone: string | null;
  email: string | null;
  source_detail: string | null;
  channel: string | null;
};

function isOverdue(value: string | null) {
  if (!value) return false;

  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return false;

  return time <= Date.now();
}

function daysSince(value: string | null) {
  if (!value) return null;

  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return null;

  return Math.floor((Date.now() - time) / (1000 * 60 * 60 * 24));
}

function getLastTouchDays(lead: Lead) {
  return daysSince(lead.last_contacted_at) ?? daysSince(lead.created_at);
}

function queueScore(lead: Lead) {
  let score = 0;

  if (lead.stage === "closed" || lead.stage === "lost") return -9999;

  if (isOverdue(lead.next_follow_up_at)) score += 100;

  if (lead.lead_quality === "priority_a") score += 40;
  if (lead.lead_quality === "priority_b") score += 20;

  if (lead.priority === "high") score += 25;
  if (lead.priority === "medium") score += 10;

  if (lead.stage === "new") score += 20;
  if (lead.stage === "contacted") score += 15;
  if (lead.stage === "appointment_set") score += 18;
  if (lead.stage === "conversation") score += 12;
  if (lead.stage === "follow_up") score += 10;

  if (typeof lead.lead_score === "number") {
    score += Math.min(lead.lead_score, 50);
  }

  const age = getLastTouchDays(lead);
  if (typeof age === "number") {
    score += Math.min(age * 3, 30);
  }

  return score;
}

function getTaskLabel(lead: Lead) {
  if (isOverdue(lead.next_follow_up_at)) return "Overdue follow-up";
  if (lead.stage === "new") return "Make first contact";
  if (lead.stage === "contacted") return "Follow up";
  if (lead.stage === "conversation") return "Advance conversation";
  if (lead.stage === "appointment_set") return "Confirm / advance appointment";
  if (lead.stage === "follow_up") return "Resume follow-up";
  return "Review and move forward";
}

function getTaskReason(lead: Lead) {
  const reasons: string[] = [];

  if (isOverdue(lead.next_follow_up_at)) reasons.push("overdue");
  if (lead.lead_quality === "priority_a") reasons.push("priority A");
  if (lead.priority === "high") reasons.push("high priority");
  if (typeof lead.lead_score === "number") reasons.push(`score ${lead.lead_score}`);
  if (lead.source_detail) reasons.push(lead.source_detail);
  if (lead.channel) reasons.push(lead.channel);

  return reasons.join(" · ") || "active lead";
}

function formatLastTouch(lead: Lead) {
  const age = getLastTouchDays(lead);
  if (age === null) return "No touch yet";
  if (age === 0) return "Touched today";
  if (age === 1) return "Last touch 1 day ago";
  return `Last touch ${age} days ago`;
}

export default function TaskQueuePanel({
  leads,
}: {
  leads: Lead[];
}) {
  const queue = [...leads]
    .filter((lead) => lead.stage !== "closed" && lead.stage !== "lost")
    .sort((a, b) => queueScore(b) - queueScore(a))
    .slice(0, 10);

  return (
    <section className="rounded-2xl border bg-white p-4">
      <div className="mb-4">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-500">
          Task queue
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
          Today’s highest-value calls and follow-ups
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          The queue is sorted by urgency, lead quality, priority, and aging.
        </p>
      </div>

      {queue.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-sm text-neutral-500">
          No active tasks right now.
        </div>
      ) : (
        <div className="space-y-3">
          {queue.map((lead, index) => {
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
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-black px-2 py-1 text-xs font-medium text-white">
                        #{index + 1}
                      </span>

                      {lead.lead_quality === "priority_a" ? (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                          Priority A
                        </span>
                      ) : null}

                      {lead.priority === "high" ? (
                        <span className="rounded-full bg-neutral-900 px-2 py-1 text-xs font-medium text-white">
                          High
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-2 font-medium text-neutral-950">
                      {lead.full_name}
                    </p>

                    <p className="mt-1 text-sm text-neutral-700">
                      {getTaskLabel(lead)}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {getTaskReason(lead)}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {formatLastTouch(lead)}
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

                    {lead.email ? (
                      <a
                        href={`mailto:${lead.email}`}
                        className="inline-flex items-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
                      >
                        Email
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