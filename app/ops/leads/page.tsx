import { createSupabaseServiceClient } from "@/lib/supabase/service";

export default async function LeadsPage() {
  const supabase = createSupabaseServiceClient();

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Leads</h1>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left text-sm text-neutral-500">
              <th className="py-3">Name</th>
              <th>Type</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Quality</th>
              <th>Timeline</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {leads?.map((lead) => (
              <tr key={lead.id} className="border-b text-sm">
                <td className="py-3">{lead.name}</td>
                <td>{lead.lead_type}</td>
                <td>{lead.budget ? `$${lead.budget}` : "-"}</td>
                <td>{lead.status}</td>
                <td>{lead.lead_quality}</td>
                <td>{lead.timeline}</td>
                <td>
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}