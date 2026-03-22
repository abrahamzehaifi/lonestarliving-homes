import { updateLeadStage } from "@/app/ops/dashboard/crm/actions";
import { CRM_STAGES } from "@/lib/crm/stages";

export default function StageSelectForm({
  id,
  currentStage,
}: {
  id: string;
  currentStage: string;
}) {
  return (
    <form action={updateLeadStage} className="flex gap-2">
      <input type="hidden" name="id" value={id} />
      <select
        name="stage"
        defaultValue={currentStage}
        className="w-full rounded-xl border px-3 py-2 text-sm"
      >
        {CRM_STAGES.map((stage) => (
          <option key={stage.key} value={stage.key}>
            {stage.label}
          </option>
        ))}
      </select>
      <button type="submit" className="rounded-xl border px-3 py-2 text-sm">
        Move
      </button>
    </form>
  );
}