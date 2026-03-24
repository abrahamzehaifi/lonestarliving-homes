type Lead = {
  id: string;
  stage: string;
  next_follow_up_at: string | null;
  last_contacted_at: string | null;
};

type Activity = {
  id: string;
  activity_type: string;
  created_at: string;
};

function isToday(value: string | null | undefined) {
  if (!value) return false;

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;

  const now = new Date();

  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function countActivities(
  activities: Activity[],
  types: string[]
) {
  return activities.filter(
    (activity) =>
      isToday(activity.created_at) &&
      types.includes(activity.activity_type)
  ).length;
}

function countStageMovesToday(leads: Lead[]) {
  return leads.filter(
    (lead) =>
      isToday(lead.last_contacted_at) &&
      (lead.stage === "contacted" ||
        lead.stage === "appointment_set" ||
        lead.stage === "listing_signed")
  ).length;
}

function countFollowUpsDueToday(leads: Lead[]) {
  return leads.filter((lead) => isToday(lead.next_follow_up_at)).length;
}

function pct(done: number, target: number) {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((done / target) * 100));
}

function ProgressBar({
  done,
  target,
}: {
  done: number;
  target: number;
}) {
  return (
    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
      <div
        className="h-full rounded-full bg-black transition-all"
        style={{ width: `${pct(done, target)}%` }}
      />
    </div>
  );
}

function MetricCard({
  label,
  done,
  target,
  helper,
}: {
  label: string;
  done: number;
  target: number;
  helper?: string;
}) {
  const complete = done >= target;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-neutral-800">{label}</p>
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            complete
              ? "bg-emerald-100 text-emerald-700"
              : "bg-white text-neutral-600 border border-neutral-200"
          }`}
        >
          {done}/{target}
        </span>
      </div>

      <ProgressBar done={done} target={target} />

      {helper ? (
        <p className="mt-2 text-xs text-neutral-500">{helper}</p>
      ) : null}
    </div>
  );
}

export default function DailyCadencePanel({
  leads,
  activities,
}: {
  leads: Lead[];
  activities: Activity[];
}) {
  const callsDone = countActivities(activities, ["call"]);
  const followUpsDone = countActivities(activities, [
    "sms",
    "email",
    "follow_up_scheduled",
    "followup_due",
    "contacted",
  ]);
  const appointmentsAttempted = countActivities(activities, [
    "appointment",
    "appointment_set",
  ]);
  const movedForward = countStageMovesToday(leads);
  const dueToday = countFollowUpsDueToday(leads);

  return (
    <section className="rounded-2xl border bg-white p-4">
      <div className="mb-4">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-500">
          Daily cadence
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
          Today’s operating targets
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Keep the day focused on activity that moves revenue forward.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Calls"
          done={callsDone}
          target={10}
          helper="Direct outreach logged today"
        />
        <MetricCard
          label="Follow-ups"
          done={followUpsDone}
          target={5}
          helper={`Follow-ups due today: ${dueToday}`}
        />
        <MetricCard
          label="Appointments attempted"
          done={appointmentsAttempted}
          target={2}
          helper="Appointment activity logged today"
        />
        <MetricCard
          label="Leads moved forward"
          done={movedForward}
          target={1}
          helper="Contacted, appointment set, or listing signed today"
        />
      </div>
    </section>
  );
}