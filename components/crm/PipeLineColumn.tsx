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
};

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
        <span className="rounded-full bg-white px-2 py-1 text-xs border">
          {leads.length}
        </span>
      </div>

      <div className="space-y-3">
        {leads.map((lead) => {
          const selected = selectedLeadId === lead.id;
          return (
            <div
              key={lead.id}
              className={`rounded-2xl border bg-white p-3 ${selected ? "ring-2 ring-black" : ""}`}
            >
              <Link href={`/ops/dashboard/crm?lead=${lead.id}`} className="block space-y-1">
                <p className="font-medium">{lead.full_name}</p>
                <p className="text-sm text-neutral-600">{lead.property_address}</p>
                <p className="text-xs text-neutral-500">Motivation: {lead.motivation}</p>
                <p className="text-xs text-neutral-500">
                  Follow-up: {lead.next_follow_up_at ? new Date(lead.next_follow_up_at).toLocaleString() : "Not set"}
                </p>
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