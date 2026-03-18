import Link from "next/link";

export default function HoustonAreaNotFound() {
  return (
    <main className="min-h-screen bg-[#f5f5f3] text-neutral-950">
      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          Houston neighborhood guidance
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Area page not found.
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-neutral-600">
          The page you requested is not currently available. Explore Houston
          housing guidance or begin a structured intake based on your criteria.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/houston"
            className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Explore Houston area pages
          </Link>

          <Link
            href="/intake?type=tenant&segment=general"
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:border-black/20"
          >
            Begin intake
          </Link>
        </div>
      </section>
    </main>
  );
}