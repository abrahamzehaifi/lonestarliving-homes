import Link from "next/link";
import StageSelectForm from "@/components/crm/StageSelectForm";

type Lead = {
  id: string;
  full_name: string;
  property_address: string;
  motivation: string;
  next_follow_up_at: string | null;
  last_contacted_at: string | null;
  stage: string;
  priority?: string | null;
  lead_score?: number | null;
  source_detail?: string | null;
  channel?: string | null;
};

function PriorityBadge({
  priority,
}: {
  priority?: string | null;
}) {
  if (!priority) return null;

  const isHigh = priority === "high";

  return (
    <span
      className={`rounded-full px-2 py-1 text-[11px] font-medium ${
        isHigh
          ? "bg-black text-white"
          : "border border-neutral-200 bg-white text-neutral-700"
      }`}
    >
      {isHigh ? "High Priority" : priority}
    </span>
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
    <div className="w-[320px] rounded-2xl border bg-neutral-50 p-3">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">{stage.label}</h2>
        <span className="rounded-full border bg-white px-2 py-1 text-xs">
          {leads.length}
        </span>
      </div>

      <div className="space-y-3">
        {leads.map((lead) => {
          const selected = selectedLeadId === lead.id;

          return (
            <div
              key={lead.id}
              className={`rounded-2xl border bg-white p-3 ${
                selected ? "ring-2 ring-black" : ""
              }`}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <PriorityBadge priority={lead.priority} />
                {typeof lead.lead_score === "number" ? (
                  <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] text-neutral-700">
                    Score {lead.lead_score}
                  </span>
                ) : null}
              </div>

              <Link
                href={`/ops/dashboard/crm?lead=${lead.id}`}
                className="block space-y-1"
              >
                <p className="font-medium">{lead.full_name}</p>

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

                <p className="text-xs text-neutral-500">
                  Follow-up:{" "}
                  {lead.next_follow_up_at
                    ? new Date(lead.next_follow_up_at).toLocaleString()
                    : "Not set"}
                </p>

                {lead.source_detail || lead.channel ? (
                  <p className="text-xs text-neutral-500">
                    Source:{" "}
                    {[lead.source_detail, lead.channel]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                ) : null}
              </Link>

              <div className="mt-3">
                <StageSelectForm id={lead.id} currentStage={lead.stage} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}