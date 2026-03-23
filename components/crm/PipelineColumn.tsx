import Link from "next/link";
import StageSelectForm from "@/components/crm/StageSelectForm";

type Lead = {
  id: string;
  full_name: string;
  property_address: string;
  motivation: string | null;
  next_follow_up_at: string | null;
  last_contacted_at: string | null;
  stage: string;
  priority?: string | null;
  lead_score?: number | null;
  lead_quality?: "priority_a" | "priority_b" | "priority_c" | null;
  source_detail?: string | null;
  channel?: string | null;
  phone?: string | null;
  email?: string | null;
};

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

function isOverdue(value: string | null) {
  if (!value) return false;

  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return false;

  return time <= Date.now();
}

function cardClasses(lead: Lead, selected: boolean) {
  const overdue = isOverdue(lead.next_follow_up_at);

  const base =
    "rounded-2xl border p-3 transition shadow-sm hover:shadow-md";

  if (overdue) {
    return `${base} border-red-300 bg-red-50 ${
      selected ? "ring-2 ring-red-600" : ""
    }`;
  }

  if (lead.lead_quality === "priority_a") {
    return `${base} border-red-200 bg-red-50/70 ${
      selected ? "ring-2 ring-red-500" : ""
    }`;
  }

  if (lead.lead_quality === "priority_b") {
    return `${base} border-amber-200 bg-amber-50/80 ${
      selected ? "ring-2 ring-amber-500" : ""
    }`;
  }

  return `${base} border-neutral-200 bg-white ${
    selected ? "ring-2 ring-black" : ""
  }`;
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${className}`}>
      {children}
    </span>
  );
}

function PriorityBadge({
  priority,
  leadQuality,
  overdue,
}: {
  priority?: string | null;
  leadQuality?: Lead["lead_quality"];
  overdue: boolean;
}) {
  if (overdue) {
    return <Badge className="bg-red-600 text-white">Overdue</Badge>;
  }

  if (leadQuality === "priority_a") {
    return <Badge className="bg-red-100 text-red-700">Priority A</Badge>;
  }

  if (leadQuality === "priority_b") {
    return <Badge className="bg-amber-100 text-amber-700">Priority B</Badge>;
  }

  if (leadQuality === "priority_c") {
    return <Badge className="bg-neutral-100 text-neutral-700">Priority C</Badge>;
  }

  if (priority === "high") {
    return <Badge className="bg-black text-white">High</Badge>;
  }

  return (
    <Badge className="border border-neutral-200 bg-white text-neutral-600">
      Standard
    </Badge>
  );
}

function ScoreBadge({ score }: { score?: number | null }) {
  if (typeof score !== "number") return null;

  return (
    <Badge className="border border-neutral-200 bg-white text-neutral-700">
      Score {score}
    </Badge>
  );
}

function SourceBadge({
  sourceDetail,
  channel,
}: {
  sourceDetail?: string | null;
  channel?: string | null;
}) {
  const value = [sourceDetail, channel].filter(Boolean).join(" · ");
  if (!value) return null;

  return (
    <p className="text-xs text-neutral-500">
      Source: {value}
    </p>
  );
}

function QuickActions({
  phone,
  email,
}: {
  phone?: string | null;
  email?: string | null;
}) {
  if (!phone && !email) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {phone ? (
        <a
          href={`tel:${phone}`}
          className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
        >
          Call
        </a>
      ) : null}

      {email ? (
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
        >
          Email
        </a>
      ) : null}
    </div>
  );
}

export default function PipelineColumn({
  stage,
  leads,
  selectedLeadId,
}: {
  stage: { key: string; label: string };
  leads: Lead[];
  selectedLeadId: string | null;
}) {
  return (
    <div className="w-[340px] rounded-2xl border bg-neutral-50 p-3">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">{stage.label}</h2>
        <span className="rounded-full border bg-white px-2 py-1 text-xs">
          {leads.length}
        </span>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white px-4 py-6 text-center text-sm text-neutral-500">
          No leads in this stage.
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => {
            const selected = selectedLeadId === lead.id;
            const overdue = isOverdue(lead.next_follow_up_at);

            return (
              <div key={lead.id} className={cardClasses(lead, selected)}>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <PriorityBadge
                    priority={lead.priority}
                    leadQuality={lead.lead_quality}
                    overdue={overdue}
                  />
                  <ScoreBadge score={lead.lead_score} />
                </div>

                <Link
                  href={`/ops/dashboard/crm?lead=${lead.id}`}
                  className="block space-y-1"
                >
                  <p className="font-medium text-neutral-950">{lead.full_name}</p>

                  {lead.property_address ? (
                    <p className="text-sm text-neutral-600">
                      {lead.property_address}
                    </p>
                  ) : null}

                  {lead.motivation ? (
                    <p className="text-xs text-neutral-500">
                      Motivation: {lead.motivation}
                    </p>
                  ) : null}

                  <p
                    className={`text-xs ${
                      overdue ? "font-medium text-red-700" : "text-neutral-500"
                    }`}
                  >
                    Follow-up: {formatDateTime(lead.next_follow_up_at)}
                  </p>

                  {lead.last_contacted_at ? (
                    <p className="text-xs text-neutral-500">
                      Last contacted: {formatDateTime(lead.last_contacted_at)}
                    </p>
                  ) : null}

                  <SourceBadge
                    sourceDetail={lead.source_detail}
                    channel={lead.channel}
                  />
                </Link>

                <QuickActions phone={lead.phone} email={lead.email} />

                <div className="mt-3">
                  <StageSelectForm id={lead.id} currentStage={lead.stage} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}