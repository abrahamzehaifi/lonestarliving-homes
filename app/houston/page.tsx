import Link from "next/link";
import { houstonAreaPages } from "@/lib/houston-neighborhoods";

export const metadata = {
  title: "Houston Neighborhood Guidance",
  description:
    "Explore Houston neighborhood guidance for renters, buyers, relocations, and area comparisons.",
};

export default function HoustonIndexPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f3] text-neutral-950">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          Houston neighborhood guidance
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
          Area guidance for Houston renters, buyers, and relocations.
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-600">
          Explore Houston area pages built to help clients compare neighborhoods
          more intelligently before touring, applying, or purchasing.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {houstonAreaPages.map((page) => (
            <Link
              key={page.slug}
              href={`/houston/${page.slug}`}
              className="rounded-[1.75rem] border border-black/5 bg-white p-6 transition hover:border-black/10"
            >
              <h2 className="text-xl font-semibold tracking-tight">
                {page.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-neutral-600">
                {page.intro}
              </p>

              {page.zipCodes.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {page.zipCodes.slice(0, 4).map((zip) => (
                    <span
                      key={zip}
                      className="rounded-full border border-black/10 bg-neutral-50 px-3 py-1 text-xs font-medium tracking-[0.12em] text-neutral-700"
                    >
                      {zip}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}