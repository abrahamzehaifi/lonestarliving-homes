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
  property_address: string | null;
  source_detail: string | null;
  phone: string | null;
  email: string | null;
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

function isSellerSide(lead: Lead) {
  const source = (lead.source_detail || "").toLowerCase();
  return Boolean(lead.property_address) ||
    source.includes("expired") ||
    source.includes("withdrawn") ||
    source.includes("terminated") ||
    source.includes("seller") ||
    source.includes("landlord");
}

function hotLeadScore(lead: Lead) {
  let score = 0;

  if (lead.stage === "closed" || lead.stage === "lost") return -9999;

  if (isOverdue(lead.next_follow_up_at)) score += 60;
  if (lead.lead_quality === "priority_a") score += 40;
  if (lead.priority === "high") score += 30;
  if (lead.stage === "appointment_set") score += 25;
  if (isSellerSide(lead)) score += 20;
  if (typeof lead.lead_score === "number") score += Math.min(lead.lead_score, 50);

  const touchAge = daysSince(lead.last_contacted_at);
  if (typeof touchAge === "number") score += Math.min(touchAge * 2, 20);

  return score;
}

function isHotLead(lead: Lead) {
  if (lead.stage === "closed" || lead.stage === "lost") return false;

  return (
    isOverdue(lead.next_follow_up_at) ||
    lead.lead_quality === "priority_a" ||
    lead.priority === "high" ||
    lead.stage === "appointment_set" ||
    isSellerSide(lead)
  );
}

function reasonText(lead: Lead) {
  const reasons: string[] = [];

  if (isOverdue(lead.next_follow_up_at)) reasons.push("overdue");
  if (lead.lead_quality === "priority_a") reasons.push("priority A");
  if (lead.priority === "high") reasons.push("high priority");
  if (lead.stage === "appointment_set") reasons.push("appointment set");
  if (isSellerSide(lead)) reasons.push("seller-side");
  if (lead.source_detail) reasons.push(lead.source_detail);

  return reasons.join(" · ");
}

function touchText(lead: Lead) {
  const d = daysSince(lead.last_contacted_at);
  if (d === null) return "No recent touch";
  if (d === 0) return "Touched today";
  if (d === 1) return "Touched 1 day ago";
  return `Touched ${d} days ago`;
}

export default function HotLeadsPanel({
  leads,
}: {
  leads: Lead[];
}) {
  const hotLeads = [...leads]
    .filter(isHotLead)
    .sort((a, b) => hotLeadScore(b) - hotLeadScore(a))
    .slice(0, 8);

  return (
    <section className="rounded-2xl border bg-white p-4">
      <div className="mb-4">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-500">
          Hot leads only
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
          Immediate revenue opportunities
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          A compressed view of leads that deserve attention first.
        </p>
      </div>

      {hotLeads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-sm text-neutral-500">
          No hot leads right now.
        </div>
      ) : (
        <div className="space-y-3">
          {hotLeads.map((lead, index) => (
            <div
              key={lead.id}
              className={`rounded-2xl border p-4 ${
                isOverdue(lead.next_follow_up_at)
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
                    {lead.stage}
                    {lead.property_address ? ` · ${lead.property_address}` : ""}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    {reasonText(lead)}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    {touchText(lead)}
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
          ))}
        </div>
      )}
    </section>
  );
}