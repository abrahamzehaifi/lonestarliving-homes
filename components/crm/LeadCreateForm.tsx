import { createLead } from "@/app/ops/dashboard/crm/actions";

export default function LeadCreateForm() {
  return (
    <form action={createLead} className="rounded-2xl border p-4">
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
        </select>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <select name="motivation" className="rounded-xl border px-3 py-2">
          <option value="high">High motivation</option>
          <option value="medium" selected>Medium motivation</option>
          <option value="low">Low motivation</option>
        </select>

        <button
          type="submit"
          className="rounded-xl bg-black px-4 py-2 text-white"
        >
          Add Lead
        </button>
      </div>
    </form>
  );
}