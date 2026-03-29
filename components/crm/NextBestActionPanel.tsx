import Link from "next/link";
import {
  markLeadContacted,
  setQuickFollowUp,
} from "@/app/ops/dashboard/crm/next-actions";

type Lead = {
  id: string;
  full_name: string;
  stage: string;
  next_follow_up_at: string | null;
  priority: string | null;
  lead_score: number | null;
  lead_quality: "priority_a" | "priority_b" | "priority_c" | null;
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

function formatDateTime(value: string | null) {
  if (!value) return "Not set";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatStage(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getActionLabel(lead: Lead) {
  if (isOverdue(lead.next_follow_up_at)) return "Call now";
  if (lead.stage === "new") return "First contact";
  if (lead.stage === "contacted") return "Follow up";
  if (lead.stage === "conversation") return "Continue conversation";
  if (lead.stage === "appointment_set") return "Confirm appointment";
  if (lead.stage === "appointment_done") return "Review next steps";
  if (lead.stage === "listing_signed") return "Advance listing";
  if (lead.stage === "follow_up") return "Re-engage lead";
  return "Review lead";
}

function getReason(lead: Lead) {
  const reasons: string[] = [];

  if (isOverdue(lead.next_follow_up_at)) reasons.push("overdue");
  if (lead.lead_quality === "priority_a") reasons.push("priority A");
  if (lead.priority === "high") reasons.push("high priority");
  if (typeof lead.lead_score === "number") reasons.push(`score ${lead.lead_score}`);
  if (lead.source_detail) reasons.push(lead.source_detail);
  if (lead.channel) reasons.push(lead.channel);

  return reasons.join(" · ") || "active lead";
}

export default function NextBestActionPanel({
  leads,
}: {
  leads: Lead[];
}) {
  const overdue = leads.filter((lead) => isOverdue(lead.next_follow_up_at));
  const topLead = overdue[0] ?? leads[0] ?? null;
  const highPriorityCount = leads.filter(
    (lead) => lead.priority === "high" || lead.lead_quality === "priority_a"
  ).length;

  return (
    <section className="rounded-2xl border bg-white p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-500">
            Next best action
          </p>

          {topLead ? (
            <>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                {getActionLabel(topLead)} — {topLead.full_name}
              </h2>

              <p className="mt-2 text-sm text-neutral-600">
                {getReason(topLead)}
              </p>

              <div className="mt-4 space-y-1 text-sm text-neutral-700">
                <p>
                  <span className="font-medium">Stage:</span> {formatStage(topLead.stage)}
                </p>
                <p>
                  <span className="font-medium">Follow-up:</span>{" "}
                  {formatDateTime(topLead.next_follow_up_at)}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {topLead.phone ? (
                  <a
                    href={`tel:${topLead.phone}`}
                    className="inline-flex items-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                  >
                    Call lead
                  </a>
                ) : null}

                {topLead.email ? (
                  <a
                    href={`mailto:${topLead.email}`}
                    className="inline-flex items-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
                  >
                    Email lead
                  </a>
                ) : null}

                <Link
                  href={`/ops/dashboard/crm?lead=${topLead.id}`}
                  className="inline-flex items-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
                >
                  Open record
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <form action={markLeadContacted}>
                  <input type="hidden" name="leadId" value={topLead.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
                  >
                    Mark contacted
                  </button>
                </form>

                <form action={setQuickFollowUp} className="flex items-center gap-2">
                  <input type="hidden" name="leadId" value={topLead.id} />
                  <select
                    name="followUpType"
                    defaultValue="tomorrow"
                    className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700"
                  >
                    <option value="today_pm">Today PM</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="two_days">2 days</option>
                    <option value="next_week">Next week</option>
                  </select>

                  <button
                    type="submit"
                    className="inline-flex items-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
                  >
                    Set follow-up
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                No leads need action yet
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                Add a lead or wait for the next follow-up cycle.
              </p>
            </>
          )}
        </div>

        <div className="grid min-w-[260px] gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <MetricCard label="Overdue" value={overdue.length} />
          <MetricCard label="High priority" value={highPriorityCount} />
          <MetricCard label="Total active" value={leads.length} />
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-neutral-50 p-3">
      <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-neutral-950">{value}</p>
    </div>
  );
}