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

function lastTouchDays(lead: Lead) {
  return daysSince(lead.last_contacted_at) ?? daysSince(lead.created_at);
}

function isSellerSideLead(lead: Lead) {
  const stage = (lead.stage || "").toLowerCase();
  const source = (lead.source_detail || "").toLowerCase();
  const hasAddress = Boolean(lead.property_address?.trim());

  if (stage === "listing_signed") return true;
  if (hasAddress) return true;
  if (source.includes("expired")) return true;
  if (source.includes("withdrawn")) return true;
  if (source.includes("terminated")) return true;
  if (source.includes("seller")) return true;
  if (source.includes("landlord")) return true;

  return false;
}

function opportunityScore(lead: Lead) {
  const stage = (lead.stage || "").toLowerCase();
  const source = (lead.source_detail || "").toLowerCase();

  let score = 0;

  if (!isSellerSideLead(lead)) return -9999;
  if (stage === "closed" || stage === "lost") return -9999;

  if (lead.property_address) score += 40;
  if (lead.lead_quality === "priority_a") score += 30;
  if (lead.lead_quality === "priority_b") score += 15;
  if (lead.priority === "high") score += 20;
  if (typeof lead.lead_score === "number") score += Math.min(lead.lead_score, 50);

  if (source.includes("expired")) score += 35;
  if (source.includes("withdrawn")) score += 20;
  if (source.includes("terminated")) score += 20;
  if (source.includes("referral")) score += 15;

  if (stage === "new") score += 15;
  if (stage === "contacted") score += 12;
  if (stage === "appointment_set") score += 18;
  if (stage === "listing_signed") score += 25;

  if (isOverdue(lead.next_follow_up_at)) score += 30;

  const age = lastTouchDays(lead);
  if (typeof age === "number") score += Math.min(age * 2, 20);

  return score;
}

function getReason(lead: Lead) {
  const reasons: string[] = [];
  const source = (lead.source_detail || "").toLowerCase();

  if (lead.property_address) reasons.push("property identified");
  if (source.includes("expired")) reasons.push("expired");
  if (source.includes("withdrawn")) reasons.push("withdrawn");
  if (source.includes("terminated")) reasons.push("terminated");
  if (lead.lead_quality === "priority_a") reasons.push("priority A");
  if (lead.priority === "high") reasons.push("high priority");
  if (isOverdue(lead.next_follow_up_at)) reasons.push("overdue");

  return reasons.join(" · ") || "seller-side opportunity";
}

function formatTouch(lead: Lead) {
  const age = lastTouchDays(lead);
  if (age === null) return "No touch yet";
  if (age === 0) return "Touched today";
  if (age === 1) return "Last touch 1 day ago";
  return `Last touch ${age} days ago`;
}

export default function SellerOpportunityPanel({
  leads,
}: {
  leads: Lead[];
}) {
  const sellerLeads = [...leads]
    .filter(isSellerSideLead)
    .sort((a, b) => opportunityScore(b) - opportunityScore(a))
    .slice(0, 8);

  const activeSellerCount = leads.filter(
    (lead) =>
      isSellerSideLead(lead) &&
      lead.stage !== "closed" &&
      lead.stage !== "lost"
  ).length;

  const signedCount = leads.filter((lead) => lead.stage === "listing_signed").length;

  const overdueSellerCount = leads.filter(
    (lead) =>
      isSellerSideLead(lead) &&
      lead.stage !== "closed" &&
      lead.stage !== "lost" &&
      isOverdue(lead.next_follow_up_at)
  ).length;

  return (
    <section className="rounded-2xl border bg-white p-4">
      <div className="mb-4">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-500">
          Seller opportunity
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
          Highest-value listing-side opportunities
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Focus on seller-side leads where commissions and listing leverage are strongest.
        </p>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <MetricCard label="Active seller-side" value={activeSellerCount} />
        <MetricCard label="Overdue seller-side" value={overdueSellerCount} />
        <MetricCard label="Listings signed" value={signedCount} />
      </div>

      {sellerLeads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-sm text-neutral-500">
          No seller-side opportunities identified yet.
        </div>
      ) : (
        <div className="space-y-3">
          {sellerLeads.map((lead, index) => {
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
                      {lead.property_address || "Property address not captured"}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {lead.stage} · {getReason(lead)}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {formatTouch(lead)}
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

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-neutral-950">{value}</p>
    </div>
  );
}