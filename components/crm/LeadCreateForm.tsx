import { createLead } from "@/app/ops/dashboard/crm/actions";

export default function LeadCreateForm() {
  return (
    <form action={createLead} className="rounded-2xl border bg-white p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Add Lead</h2>
        <p className="text-sm text-neutral-500">
          Capture outbound, referral, and manual opportunities in one place.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-6">
        <input
          name="full_name"
          placeholder="Seller name"
          className="rounded-xl border px-3 py-2 md:col-span-1"
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          className="rounded-xl border px-3 py-2 md:col-span-1"
        />

        <input
          name="email"
          placeholder="Email"
          className="rounded-xl border px-3 py-2 md:col-span-1"
        />

        <input
          name="property_address"
          placeholder="Property address"
          className="rounded-xl border px-3 py-2 md:col-span-2"
          required
        />

        <select name="source" className="rounded-xl border px-3 py-2">
          <option value="expired">Expired</option>
          <option value="withdrawn">Withdrawn</option>
          <option value="terminated">Terminated</option>
          <option value="referral">Referral</option>
          <option value="sphere">Sphere</option>
          <option value="website">Website</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-4">
        <select
          name="motivation"
          defaultValue="medium"
          className="rounded-xl border px-3 py-2"
        >
          <option value="high">High motivation</option>
          <option value="medium">Medium motivation</option>
          <option value="low">Low motivation</option>
        </select>

        <select
          name="priority"
          defaultValue="normal"
          className="rounded-xl border px-3 py-2"
        >
          <option value="high">High priority</option>
          <option value="normal">Normal priority</option>
        </select>

        <input
          name="lead_score"
          type="number"
          min="0"
          max="100"
          placeholder="Lead score"
          className="rounded-xl border px-3 py-2"
        />

        <input
          name="source_detail"
          placeholder="Source detail (e.g. expired_batch_1)"
          className="rounded-xl border px-3 py-2"
        />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <input
          name="channel"
          placeholder="Channel (e.g. outbound, referral, organic)"
          className="rounded-xl border px-3 py-2"
        />

        <div className="md:col-span-2 flex items-center justify-end">
          <button
            type="submit"
            className="rounded-xl bg-black px-4 py-2 text-white transition hover:bg-neutral-800"
          >
            Add Lead
          </button>
        </div>
      </div>
    </form>
  );
}