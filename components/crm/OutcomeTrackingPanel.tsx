import { saveLeadOutcome } from "@/app/ops/dashboard/crm/outcome-actions";

type Lead = {
  id: string;
  stage?: string | null;
  last_outcome?: string | null;
  last_outcome_at?: string | null;
  outcome_notes?: string | null;
};

function formatDateTime(value: string | null | undefined) {
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

function OutcomeButton({
  leadId,
  outcome,
  label,
  className,
}: {
  leadId: string;
  outcome: "no_answer" | "spoke" | "interested" | "appointment_set" | "lost";
  label: string;
  className: string;
}) {
  return (
    <form action={saveLeadOutcome}>
      <input type="hidden" name="leadId" value={leadId} />
      <input type="hidden" name="outcome" value={outcome} />
      <button
        type="submit"
        className={`rounded-xl px-3 py-2 text-sm font-medium transition ${className}`}
      >
        {label}
      </button>
    </form>
  );
}

export default function OutcomeTrackingPanel({
  lead,
}: {
  lead: Lead | null;
}) {
  if (!lead) return null;

  return (
    <section className="rounded-2xl border bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-neutral-950">
            Outcome tracking
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            Record the last real result so follow-up timing and stage stay clean.
          </p>
        </div>

        <div className="text-right text-xs text-neutral-500">
          <p>Last outcome: {lead.last_outcome || "None"}</p>
          <p className="mt-1">
            Updated: {formatDateTime(lead.last_outcome_at)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <OutcomeButton
          leadId={lead.id}
          outcome="no_answer"
          label="No answer"
          className="border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
        />
        <OutcomeButton
          leadId={lead.id}
          outcome="spoke"
          label="Spoke"
          className="border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
        />
        <OutcomeButton
          leadId={lead.id}
          outcome="interested"
          label="Interested"
          className="border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
        />
        <OutcomeButton
          leadId={lead.id}
          outcome="appointment_set"
          label="Appointment set"
          className="border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        />
        <OutcomeButton
          leadId={lead.id}
          outcome="lost"
          label="Lost"
          className="border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
        />
      </div>

      <div className="mt-4">
        <form action={saveLeadOutcome} className="space-y-3">
          <input type="hidden" name="leadId" value={lead.id} />
          <div className="flex flex-wrap gap-2">
            <select
              name="outcome"
              defaultValue="spoke"
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700"
            >
              <option value="no_answer">No answer</option>
              <option value="spoke">Spoke</option>
              <option value="interested">Interested</option>
              <option value="appointment_set">Appointment set</option>
              <option value="lost">Lost</option>
            </select>

            <button
              type="submit"
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Save with notes
            </button>
          </div>

          <textarea
            name="notes"
            placeholder="Add context from the conversation, objection, timeline, motivation, or next step."
            defaultValue={lead.outcome_notes || ""}
            className="min-h-[110px] w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-neutral-900"
          />
        </form>
      </div>
    </section>
  );
}