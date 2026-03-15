import Link from "next/link";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  lead_type: string;
  status: string | null;
  lead_quality: string | null;
  follow_up_at: string | null;
  timeline: string | null;
  source: string | null;
  segment: string | null;
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function timeAgo(value: string) {
  try {
    const diffMs = Date.now() - new Date(value).getTime();

    if (Number.isNaN(diffMs)) return "";

    const future = diffMs < 0;
    const seconds = Math.floor(Math.abs(diffMs) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count > 0) {
        return future
          ? `in ${count} ${interval.label}${count > 1 ? "s" : ""}`
          : `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return future ? "in a moment" : "just now";
  } catch {
    return "";
  }
}

function labelize(value: string | null | undefined) {
  if (!value) return "—";

  return value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusClasses(status: string | null) {
  switch (status) {
    case "new":
      return "bg-blue-50 text-blue-700 ring-blue-100";
    case "contacted":
      return "bg-amber-50 text-amber-700 ring-amber-100";
    case "qualified":
      return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    case "showing":
      return "bg-violet-50 text-violet-700 ring-violet-100";
    case "application":
      return "bg-orange-50 text-orange-700 ring-orange-100";
    case "closed":
      return "bg-green-50 text-green-700 ring-green-100";
    case "lost":
      return "bg-neutral-100 text-neutral-600 ring-neutral-200";
    default:
      return "bg-neutral-100 text-neutral-700 ring-neutral-200";
  }
}

function getQualityClasses(quality: string | null) {
  switch (quality) {
    case "priority_a":
      return "bg-neutral-950 text-white ring-neutral-950/10";
    case "priority_b":
      return "bg-sky-50 text-sky-700 ring-sky-100";
    case "priority_c":
      return "bg-neutral-100 text-neutral-600 ring-neutral-200";
    default:
      return "bg-neutral-100 text-neutral-700 ring-neutral-200";
  }
}

function StatusPill({ status }: { status: string | null }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
        status
      )}`}
    >
      {labelize(status)}
    </span>
  );
}

function QualityPill({ quality }: { quality: string | null }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getQualityClasses(
        quality
      )}`}
    >
      {quality === "priority_a"
        ? "Priority A"
        : quality === "priority_b"
        ? "Priority B"
        : quality === "priority_c"
        ? "Priority C"
        : "—"}
    </span>
  );
}

function QueueSection({
  title,
  description,
  leads,
  tone = "default",
}: {
  title: string;
  description: string;
  leads: LeadRow[];
  tone?: "default" | "urgent";
}) {
  const toneClasses =
    tone === "urgent"
      ? "border-red-200 bg-red-50"
      : "border-black/5 bg-white";

  return (
    <section className={`rounded-[1.5rem] border p-6 ${toneClasses}`}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-7 text-neutral-600">
            {description}
          </p>
        </div>

        <div className="rounded-full bg-white px-3 py-1 text-sm font-medium text-neutral-900 ring-1 ring-inset ring-black/5">
          {leads.length}
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 bg-white/70 p-5 text-sm text-neutral-600">
          No leads in this section.
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-2xl border border-black/5 bg-white p-4"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="text-base font-semibold tracking-tight text-neutral-950 underline-offset-4 hover:underline"
                    >
                      {lead.name}
                    </Link>
                    <StatusPill status={lead.status} />
                    <QualityPill quality={lead.lead_quality} />
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-600">
                    <span>{labelize(lead.lead_type)}</span>
                    <span>{labelize(lead.segment)}</span>
                    <span>{labelize(lead.source)}</span>
                    <span>{labelize(lead.timeline)}</span>
                  </div>

                  <div className="mt-3 space-y-1 text-sm text-neutral-700">
                    <div className="break-all">{lead.email}</div>
                    <div>{lead.phone || "—"}</div>
                  </div>
                </div>

                <div className="shrink-0 text-sm">
                  <div className="font-medium text-neutral-950">
                    {lead.follow_up_at ? formatDate(lead.follow_up_at) : "—"}
                  </div>
                  <div className="mt-1 text-neutral-500">
                    {lead.follow_up_at ? timeAgo(lead.follow_up_at) : ""}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default async function DashboardFollowUpsPage() {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("leads")
    .select(
      "id, name, email, phone, lead_type, status, lead_quality, follow_up_at, timeline, source, segment"
    )
    .not("follow_up_at", "is", null)
    .neq("status", "closed")
    .neq("status", "lost")
    .order("follow_up_at", { ascending: true })
    .limit(200);

  const leads = (data ?? []) as LeadRow[];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const overdue = leads.filter((lead) => {
    if (!lead.follow_up_at) return false;
    return new Date(lead.follow_up_at) < today;
  });

  const dueToday = leads.filter((lead) => {
    if (!lead.follow_up_at) return false;
    const date = new Date(lead.follow_up_at);
    return date >= today && date < tomorrow;
  });

  const upcoming = leads.filter((lead) => {
    if (!lead.follow_up_at) return false;
    return new Date(lead.follow_up_at) >= tomorrow;
  });

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-neutral-950">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Follow-up queue
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">
              Daily execution screen for overdue, due today, and upcoming
              follow-ups.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-medium text-neutral-900 transition hover:border-black/20 hover:bg-white"
          >
            Back to dashboard
          </Link>
        </div>

        {error ? (
          <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Failed to load follow-up queue.
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-700">
                  Overdue
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-red-800">
                  {overdue.length}
                </p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Due Today
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                  {dueToday.length}
                </p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Upcoming
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                  {upcoming.length}
                </p>
              </div>
            </div>

            <QueueSection
              title="Overdue follow-ups"
              description="These leads should be handled first."
              leads={overdue}
              tone="urgent"
            />

            <QueueSection
              title="Due today"
              description="These leads are scheduled for contact today."
              leads={dueToday}
            />

            <QueueSection
              title="Upcoming"
              description="These are future scheduled follow-ups."
              leads={upcoming}
            />
          </div>
        )}
      </section>
    </main>
  );
}