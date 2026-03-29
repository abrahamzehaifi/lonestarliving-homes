type Lead = {
  id: string;
  stage: string;
  last_contacted_at: string | null;
};

type Activity = {
  id: string;
  activity_type: string;
  created_at: string;
};

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function daysAgoDate(daysAgo: number) {
  const d = startOfToday();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function labelForDate(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

function countActivitiesForDay(
  activities: Activity[],
  day: Date,
  types?: string[]
) {
  return activities.filter((activity) => {
    const created = new Date(activity.created_at);
    if (Number.isNaN(created.getTime())) return false;
    if (!isSameDay(created, day)) return false;
    if (!types) return true;
    return types.includes(activity.activity_type);
  }).length;
}

function countLeadTouchesForDay(leads: Lead[], day: Date) {
  return leads.filter((lead) => {
    if (!lead.last_contacted_at) return false;
    const touched = new Date(lead.last_contacted_at);
    if (Number.isNaN(touched.getTime())) return false;
    return isSameDay(touched, day);
  }).length;
}

function countLeadsByStage(leads: Lead[], stage: string) {
  return leads.filter(
    (lead) => String(lead.stage || "").trim().toLowerCase() === stage
  ).length;
}

function sum(values: number[]) {
  return values.reduce((acc, value) => acc + value, 0);
}

function pctChange(current: number, previous: number) {
  if (previous === 0 && current === 0) return "0%";
  if (previous === 0) return "+100%";

  const pct = Math.round(((current - previous) / previous) * 100);
  return `${pct > 0 ? "+" : ""}${pct}%`;
}

export default function WeeklyScoreboardPanel({
  leads,
  activities,
}: {
  leads: Lead[];
  activities: Activity[];
}) {
  const days = Array.from({ length: 7 }, (_, index) => daysAgoDate(6 - index));

  const callSeries = days.map((day) =>
    countActivitiesForDay(activities, day, ["call"])
  );

  const followUpSeries = days.map((day) =>
    countActivitiesForDay(activities, day, [
      "sms",
      "email",
      "follow_up_scheduled",
      "followup_due",
      "contacted",
    ])
  );

  const appointmentSeries = days.map((day) =>
    countActivitiesForDay(activities, day, ["appointment", "appointment_set"])
  );

  const touchSeries = days.map((day) => countLeadTouchesForDay(leads, day));

  const callsThisWeek = sum(callSeries);
  const followUpsThisWeek = sum(followUpSeries);
  const appointmentsThisWeek = sum(appointmentSeries);
  const touchesThisWeek = sum(touchSeries);

  // Compare first 3 days vs last 3 days, intentionally skipping the middle day
  const firstHalfCalls = sum(callSeries.slice(0, 3));
  const secondHalfCalls = sum(callSeries.slice(4, 7));

  const firstHalfFollowUps = sum(followUpSeries.slice(0, 3));
  const secondHalfFollowUps = sum(followUpSeries.slice(4, 7));

  const firstHalfAppointments = sum(appointmentSeries.slice(0, 3));
  const secondHalfAppointments = sum(appointmentSeries.slice(4, 7));

  const closedCount = countLeadsByStage(leads, "closed");
  const lostCount = countLeadsByStage(leads, "lost");
  const appointmentCount = countLeadsByStage(leads, "appointment_set");

  return (
    <section className="rounded-2xl border bg-white p-4">
      <div className="mb-4">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-500">
          Weekly scoreboard
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
          Weekly trend and output
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          See whether activity is building momentum or fading across the week.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Calls this week"
          value={String(callsThisWeek)}
          subtext={pctChange(secondHalfCalls, firstHalfCalls)}
        />
        <MetricCard
          label="Follow-ups this week"
          value={String(followUpsThisWeek)}
          subtext={pctChange(secondHalfFollowUps, firstHalfFollowUps)}
        />
        <MetricCard
          label="Appointments this week"
          value={String(appointmentsThisWeek)}
          subtext={pctChange(secondHalfAppointments, firstHalfAppointments)}
        />
        <MetricCard
          label="Leads touched"
          value={String(touchesThisWeek)}
          subtext="Last 7 days"
        />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Appointments in pipeline"
          value={String(appointmentCount)}
          subtext="Current stage count"
        />
        <MetricCard
          label="Closed"
          value={String(closedCount)}
          subtext="Current closed leads"
        />
        <MetricCard
          label="Lost"
          value={String(lostCount)}
          subtext="Current lost leads"
        />
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.12em] text-neutral-500">
              <th className="px-3 py-2">Day</th>
              <th className="px-3 py-2">Calls</th>
              <th className="px-3 py-2">Follow-ups</th>
              <th className="px-3 py-2">Appointments</th>
              <th className="px-3 py-2">Touches</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day, index) => (
              <tr
                key={day.toISOString()}
                className="rounded-2xl bg-neutral-50 text-sm text-neutral-800"
              >
                <td className="rounded-l-xl px-3 py-3 font-medium">
                  {labelForDate(day)}
                </td>
                <td className="px-3 py-3">{callSeries[index]}</td>
                <td className="px-3 py-3">{followUpSeries[index]}</td>
                <td className="px-3 py-3">{appointmentSeries[index]}</td>
                <td className="rounded-r-xl px-3 py-3">{touchSeries[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-neutral-950">{value}</p>
      <p className="mt-1 text-xs text-neutral-500">{subtext}</p>
    </div>
  );
}