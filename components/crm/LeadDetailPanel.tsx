import { addActivity, updateLeadDetails } from "@/app/ops/dashboard/crm/actions";
import OutcomeTrackingPanel from "@/components/crm/OutcomeTrackingPanel";

type Lead = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  property_address: string;
  source: string;
  stage: string;
  motivation: string | null;
  timeline: string | null;

  price_expectation: number | null;
  pain_point: string | null;
  market_low: number | null;
  market_high: number | null;
  recommended_price: number | null;
  cma_notes: string | null;
  next_follow_up_at: string | null;

  priority?: string | null;
  lead_score?: number | null;
  source_detail?: string | null;
  channel?: string | null;

  last_outcome?: string | null;
  last_outcome_at?: string | null;
  outcome_notes?: string | null;
};

type Activity = {
  id: string;
  activity_type: string;
  content: string;
  created_at: string;
};

function PriorityBadge({ priority }: { priority?: string | null }) {
  if (!priority) return null;

  const isHigh = priority === "high";

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${
        isHigh
          ? "bg-black text-white"
          : "border border-neutral-200 bg-white text-neutral-700"
      }`}
    >
      {isHigh ? "High Priority" : priority}
    </span>
  );
}

function formatDate(value: string | null) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function toDateTimeLocal(value: string | null) {
  if (!value) return "";

  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  } catch {
    return "";
  }
}

function FollowUpStatus({ value }: { value: string | null }) {
  if (!value) return null;

  const due = new Date(value);
  if (Number.isNaN(due.getTime())) return null;

  const overdue = due.getTime() < Date.now();

  return (
    <p className={`mt-1 text-xs ${overdue ? "text-red-600" : "text-neutral-500"}`}>
      {overdue ? "Overdue — act now" : "Upcoming"}
    </p>
  );
}

export default function LeadDetailPanel({
  lead,
  activities,
}: {
  lead: Lead | null;
  activities: Activity[];
}) {
  if (!lead) {
    return (
      <aside className="rounded-2xl border p-4">
        <p className="text-sm text-neutral-500">
          Select a lead to view details.
        </p>
      </aside>
    );
  }

  return (
    <aside className="space-y-4">
      <section className="rounded-2xl border p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{lead.full_name}</h2>
          <PriorityBadge priority={lead.priority} />
        </div>

        <p className="text-sm text-neutral-600">
          {lead.property_address || "—"}
        </p>

        <div className="mt-3 space-y-1 text-sm">
          <p>Phone: {lead.phone || "—"}</p>
          <p>Email: {lead.email || "—"}</p>
          <p>Stage: {lead.stage}</p>
        </div>

        <div className="mt-4 rounded-xl bg-neutral-50 p-3 text-sm">
          <p className="font-medium">Lead Source</p>
          <p className="text-neutral-600">
            {lead.source_detail || "—"}
            {lead.channel ? ` · ${lead.channel}` : ""}
          </p>

          {typeof lead.lead_score === "number" ? (
            <p className="mt-1 text-neutral-600">Score: {lead.lead_score}</p>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border p-4">
        <h3 className="mb-2 font-semibold">Next Action</h3>

        <p className="text-sm text-neutral-600">
          Follow-up: {formatDate(lead.next_follow_up_at)}
        </p>

        <FollowUpStatus value={lead.next_follow_up_at} />
      </section>

      <OutcomeTrackingPanel lead={lead} />

      <section className="rounded-2xl border p-4">
        <h3 className="mb-3 font-semibold">Deal Strategy</h3>

        <form action={updateLeadDetails} className="space-y-3">
          <input type="hidden" name="id" value={lead.id} />

          <input
            name="timeline"
            defaultValue={lead.timeline || ""}
            placeholder="Timeline"
            className="w-full rounded-xl border px-3 py-2"
          />

          <input
            name="price_expectation"
            defaultValue={lead.price_expectation ?? ""}
            placeholder="Client expectation"
            type="number"
            className="w-full rounded-xl border px-3 py-2"
          />

          <textarea
            name="pain_point"
            defaultValue={lead.pain_point || ""}
            placeholder="Client pain point"
            className="min-h-[80px] w-full rounded-xl border px-3 py-2"
          />

          <div className="grid grid-cols-3 gap-3">
            <input
              name="market_low"
              defaultValue={lead.market_low ?? ""}
              placeholder="Low"
              type="number"
              className="rounded-xl border px-3 py-2"
            />
            <input
              name="market_high"
              defaultValue={lead.market_high ?? ""}
              placeholder="High"
              type="number"
              className="rounded-xl border px-3 py-2"
            />
            <input
              name="recommended_price"
              defaultValue={lead.recommended_price ?? ""}
              placeholder="Target"
              type="number"
              className="rounded-xl border px-3 py-2"
            />
          </div>

          <textarea
            name="cma_notes"
            defaultValue={lead.cma_notes || ""}
            placeholder="Strategy / CMA notes"
            className="min-h-[80px] w-full rounded-xl border px-3 py-2"
          />

          <input
            name="next_follow_up_at"
            type="datetime-local"
            defaultValue={toDateTimeLocal(lead.next_follow_up_at)}
            className="w-full rounded-xl border px-3 py-2"
          />

          <button className="rounded-xl bg-black px-4 py-2 text-white">
            Save
          </button>
        </form>
      </section>

      <section className="rounded-2xl border p-4">
        <h3 className="mb-3 font-semibold">Log Activity</h3>

        <form action={addActivity} className="space-y-3">
          <input type="hidden" name="lead_id" value={lead.id} />

          <select
            name="activity_type"
            className="w-full rounded-xl border px-3 py-2"
          >
            <option value="note">Note</option>
            <option value="call">Call</option>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
            <option value="appointment">Appointment</option>
          </select>

          <textarea
            name="content"
            placeholder="What happened?"
            className="min-h-[80px] w-full rounded-xl border px-3 py-2"
          />

          <button className="rounded-xl border px-4 py-2">
            Add Activity
          </button>
        </form>
      </section>

      <section className="rounded-2xl border p-4">
        <h3 className="mb-3 font-semibold">Timeline</h3>

        <div className="space-y-3">
          {activities.length === 0 ? (
            <p className="text-sm text-neutral-500">No activity yet.</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="rounded-xl border p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium uppercase">
                    {activity.activity_type}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>

                <p className="mt-2 text-sm text-neutral-700">
                  {activity.content}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </aside>
  );
}