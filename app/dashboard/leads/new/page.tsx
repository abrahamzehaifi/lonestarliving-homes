import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

async function createLead(formData: FormData) {
  "use server";

  const supabase = createSupabaseServiceClient();

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  const lead_type = String(formData.get("lead_type") || "rent").trim();
  const source = String(formData.get("source") || "manual").trim();
  const segment = String(formData.get("segment") || "general").trim();
  const timeline = String(formData.get("timeline") || "").trim();
  const areas = String(formData.get("areas") || "").trim();
  const next_action = String(formData.get("next_action") || "").trim();
  const message = String(formData.get("message") || "").trim();

  const budgetRaw = String(formData.get("budget") || "").trim();
  const budget = budgetRaw ? Number(budgetRaw) : null;

  const moveInDateRaw = String(formData.get("move_in_date") || "").trim();
  const move_in_date = moveInDateRaw || null;

  if (!name) {
    throw new Error("Name is required.");
  }

  const insertPayload = {
    name,
    email: email || null,
    phone: phone || null,
    lead_type,
    source: source || "manual",
    segment: segment || "general",
    timeline: timeline || null,
    areas: areas || null,
    budget: Number.isFinite(budget as number) ? budget : null,
    move_in_date,
    next_action: next_action || null,
    message: message || null,
    status: "new",
  };

  const { data, error } = await supabase
    .from("leads")
    .insert(insertPayload)
    .select("id")
    .single();

  if (error || !data?.id) {
    console.error("Lead create error:", error);
    throw new Error("Failed to create lead.");
  }

  redirect(`/dashboard/leads/${data.id}`);
}

export default function NewLeadPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f3] text-neutral-950">
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              Dashboard
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Add Lead
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600">
              Manually add a lead from calls, referrals, networking, HAR conversations,
              open houses, or direct outreach.
            </p>
          </div>

          <Link
            href="/dashboard/leads"
            className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-medium text-neutral-900 transition hover:border-black/20 hover:bg-white"
          >
            Back to leads
          </Link>
        </div>

        <form action={createLead} className="rounded-[1.5rem] border border-black/5 bg-white p-6 md:p-8">
          <div className="grid gap-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
                Core details
              </h2>
              <p className="mt-2 text-sm leading-7 text-neutral-600">
                Capture enough information to move the lead immediately into the pipeline.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="name"
                placeholder="Full name"
                required
                className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />

              <input
                name="phone"
                placeholder="Phone"
                className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />

              <select
                name="lead_type"
                defaultValue="rent"
                className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              >
                <option value="rent">Rental</option>
                <option value="buy">Buyer</option>
                <option value="sell">Seller</option>
                <option value="landlord">Landlord</option>
                <option value="other">Other</option>
              </select>

              <select
                name="source"
                defaultValue="manual"
                className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              >
                <option value="manual">Manual Entry</option>
                <option value="referral">Referral</option>
                <option value="call">Phone Call</option>
                <option value="text">Text</option>
                <option value="networking">Networking</option>
                <option value="website">Website</option>
                <option value="open_house">Open House</option>
                <option value="prospecting">Prospecting</option>
              </select>

              <select
                name="segment"
                defaultValue="general"
                className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              >
                <option value="general">General</option>
                <option value="medical_center">Medical Center</option>
                <option value="rice_student">Rice Student</option>
                <option value="relocation">Relocation</option>
                <option value="apartment_locator">Apartment Locator</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
                Qualification
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="budget"
                placeholder="Budget"
                type="number"
                min="0"
                className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />

              <input
                name="areas"
                placeholder="Preferred areas"
                className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />

              <input
                name="timeline"
                placeholder="Timeline (ex: within 2 weeks)"
                className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />

              <input
                name="move_in_date"
                type="date"
                className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
                Operations
              </h2>
            </div>

            <div className="grid gap-4">
              <textarea
                name="next_action"
                placeholder="Next action..."
                rows={3}
                className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />

              <textarea
                name="message"
                placeholder="Conversation notes or summary..."
                rows={5}
                className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Create Lead
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}