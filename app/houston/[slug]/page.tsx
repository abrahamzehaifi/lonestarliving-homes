import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getHoustonAreaBySlug,
  houstonAreaPages,
} from "@/lib/houston-neighborhoods";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return houstonAreaPages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getHoustonAreaBySlug(slug);

  if (!page) {
    return {
      title: "Houston Neighborhood Guidance",
      description: "Houston neighborhood guidance.",
    };
  }

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `/houston/${page.slug}`,
    },
  };
}

export default async function HoustonAreaPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getHoustonAreaBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-neutral-950">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:border-black/20"
          >
            Home
          </Link>

          <Link
            href="/houston"
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:border-black/20"
          >
            Houston Areas
          </Link>
        </div>

        <p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          Houston neighborhood guidance
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
          {page.h1}
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-600">
          {page.intro}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/intake?type=tenant&segment=general"
            className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Begin intake
          </Link>

          <Link
            href="/rent"
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:border-black/20"
          >
            Rental guidance
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 md:grid-cols-2">
        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6">
          <h2 className="text-xl font-semibold tracking-tight">Area overview</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-neutral-600">
            {page.overview.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6">
          <h2 className="text-xl font-semibold tracking-tight">Best fit for</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-600">
            {page.bestFor.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6">
          <h2 className="text-xl font-semibold tracking-tight">Housing profile</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-600">
            {page.housing.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6">
          <h2 className="text-xl font-semibold tracking-tight">
            Lifestyle and positioning
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-600">
            {page.lifestyle.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 md:col-span-2">
          <h2 className="text-xl font-semibold tracking-tight">
            Pricing and decision considerations
          </h2>
          <p className="mt-4 text-sm leading-7 text-neutral-600">
            {page.pricingNote}
          </p>

          <h3 className="mt-6 text-lg font-semibold tracking-tight">
            Commute considerations
          </h3>
          <ul className="mt-3 space-y-3 text-sm leading-7 text-neutral-600">
            {page.commute.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>

          {page.zipCodes.length > 0 && (
            <>
              <h3 className="mt-6 text-lg font-semibold tracking-tight">
                Relevant ZIP codes
              </h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {page.zipCodes.map((zip) => (
                  <span
                    key={zip}
                    className="rounded-full border border-black/10 bg-neutral-50 px-3 py-1 text-xs font-medium tracking-[0.12em] text-neutral-700"
                  >
                    {zip}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[1.75rem] border border-black/5 bg-white p-8 md:p-10">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            Next step
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Narrow Houston with more clarity.
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-600">
            The right Houston neighborhood depends on commute pattern, budget,
            property type, school priorities, and lifestyle fit. Structured
            intake helps narrow the search more efficiently.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/intake?type=tenant&segment=general"
              className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Begin intake
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:border-black/20"
            >
              Return home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}