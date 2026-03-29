import { updateLeadStage } from "@/app/ops/dashboard/crm/actions";
import { CRM_STAGES } from "@/lib/crm/stages";

type StageSelectFormProps = {
  id: string;
  currentStage: string | null;
};

export default function StageSelectForm({
  id,
  currentStage,
}: StageSelectFormProps) {
  const safeCurrentStage = currentStage || "new";

  return (
    <form action={updateLeadStage} className="flex gap-2">
      <input type="hidden" name="id" value={id} />

      <select
        name="stage"
        defaultValue={safeCurrentStage}
        className="w-full rounded-xl border px-3 py-2 text-sm"
      >
        {CRM_STAGES.map((stage) => (
          <option key={stage.key} value={stage.key}>
            {stage.label}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="rounded-xl border px-3 py-2 text-sm transition hover:bg-neutral-50"
      >
        Move
      </button>
    </form>
  );
}