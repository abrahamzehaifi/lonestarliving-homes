import Link from "next/link";

export default async function OpsLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-neutral-950">
      <section className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          Ops
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Lead Detail
        </h1>

        <p className="mt-3 text-sm text-neutral-600">Lead ID: {id}</p>

        <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6">
          <p className="text-sm text-neutral-700">
            Temporary placeholder page so production can build cleanly.
          </p>

          <Link
            href="/ops/leads"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Back to leads
          </Link>
        </div>
      </section>
    </main>
  );
}