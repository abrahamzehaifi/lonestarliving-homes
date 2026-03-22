import { addActivity, updateLeadDetails } from "@/app/ops/dashboard/crm/actions";

type Lead = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  property_address: string;
  source: string;
  stage: string;
  motivation: string;
  timeline: string | null;
  price_expectation: number | null;
  pain_point: string | null;
  market_low: number | null;
  market_high: number | null;
  recommended_price: number | null;
  cma_notes: string | null;
  next_follow_up_at: string | null;
};

type Activity = {
  id: string;
  activity_type: string;
  content: string;
  created_at: string;
};

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
        <p className="text-sm text-neutral-500">Select a lead to view details.</p>
      </aside>
    );
  }

  return (
    <aside className="space-y-4">
      <section className="rounded-2xl border p-4">
        <h2 className="text-lg font-semibold">{lead.full_name}</h2>
        <p className="text-sm text-neutral-600">{lead.property_address}</p>
        <p className="mt-2 text-sm">Phone: {lead.phone || "—"}</p>
        <p className="text-sm">Email: {lead.email || "—"}</p>
        <p className="text-sm">Source: {lead.source}</p>
        <p className="text-sm">Stage: {lead.stage}</p>
      </section>

      <section className="rounded-2xl border p-4">
        <h3 className="mb-3 font-semibold">Deal Details</h3>

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
            placeholder="Price expectation"
            type="number"
            className="w-full rounded-xl border px-3 py-2"
          />

          <textarea
            name="pain_point"
            defaultValue={lead.pain_point || ""}
            placeholder="Pain point"
            className="min-h-[90px] w-full rounded-xl border px-3 py-2"
          />

          <div className="grid gap-3 grid-cols-3">
            <input
              name="market_low"
              defaultValue={lead.market_low ?? ""}
              placeholder="Market low"
              type="number"
              className="rounded-xl border px-3 py-2"
            />
            <input
              name="market_high"
              defaultValue={lead.market_high ?? ""}
              placeholder="Market high"
              type="number"
              className="rounded-xl border px-3 py-2"
            />
            <input
              name="recommended_price"
              defaultValue={lead.recommended_price ?? ""}
              placeholder="Recommended"
              type="number"
              className="rounded-xl border px-3 py-2"
            />
          </div>

          <textarea
            name="cma_notes"
            defaultValue={lead.cma_notes || ""}
            placeholder="CMA notes"
            className="min-h-[90px] w-full rounded-xl border px-3 py-2"
          />

          <input
            name="next_follow_up_at"
            type="datetime-local"
            defaultValue={
              lead.next_follow_up_at
                ? new Date(lead.next_follow_up_at).toISOString().slice(0, 16)
                : ""
            }
            className="w-full rounded-xl border px-3 py-2"
          />

          <button type="submit" className="rounded-xl bg-black px-4 py-2 text-white">
            Save Details
          </button>
        </form>
      </section>

      <section className="rounded-2xl border p-4">
        <h3 className="mb-3 font-semibold">Add Activity</h3>
        <form action={addActivity} className="space-y-3">
          <input type="hidden" name="lead_id" value={lead.id} />
          <select name="activity_type" className="w-full rounded-xl border px-3 py-2">
            <option value="note">Note</option>
            <option value="call">Call</option>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
            <option value="appointment">Appointment</option>
          </select>
          <textarea
            name="content"
            placeholder="What happened?"
            className="min-h-[90px] w-full rounded-xl border px-3 py-2"
          />
          <button type="submit" className="rounded-xl border px-4 py-2">
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
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium uppercase tracking-wide">
                    {activity.activity_type}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
                <p className="mt-2 text-sm text-neutral-700">{activity.content}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </aside>
  );
}