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

function getCompareLinks(currentSlug: string) {
  const priorityOrder = [
    "katy",
    "cypress",
    "the-heights",
    "memorial-energy-corridor",
    "spring-branch",
    "river-oaks-upper-kirby",
    "west-university-rice-museum-district",
    "downtown-midtown-montrose-river-oaks-adjacent",
    "baytown-east-houston-corridor",
  ];

  return priorityOrder
    .filter((slug) => slug !== currentSlug)
    .map((slug) => getHoustonAreaBySlug(slug))
    .filter(Boolean)
    .slice(0, 5);
}

export default async function HoustonAreaPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getHoustonAreaBySlug(slug);

  if (!page) {
    return (
      <main className="min-h-screen p-10">
        <pre className="whitespace-pre-wrap text-sm">
          {JSON.stringify(
            {
              slug,
              availableSlugs: houstonAreaPages.map((p) => p.slug),
              matched: getHoustonAreaBySlug(slug) ?? null,
            },
            null,
            2
          )}
        </pre>
      </main>
    );
  }

  const compareLinks = getCompareLinks(page.slug);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.seoFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

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
            href={`/intake?type=tenant&segment=general&area=${page.slug}`}
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

          <Link
            href="/buy"
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:border-black/20"
          >
            Buyer guidance
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6">
          <h2 className="text-lg font-semibold tracking-tight">
            Compare Houston areas
          </h2>

          <p className="mt-2 text-sm leading-7 text-neutral-600">
            Clients rarely compare just one location. Use these area pages to
            compare commute, housing style, pricing profile, and neighborhood
            fit more efficiently.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {compareLinks.map((item) => (
              <Link
                key={item!.slug}
                href={`/houston/${item!.slug}`}
                className="rounded-full border border-black/10 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-800 transition hover:border-black/20 hover:bg-white"
              >
                {item!.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 md:grid-cols-2">
        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6">
          <h2 className="text-xl font-semibold tracking-tight">Area overview</h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-neutral-600">
            {page.overview.map((item) => (
              <p key={item}>
                {item}{" "}
                <Link
                  href="/rent"
                  className="underline underline-offset-4 transition hover:text-neutral-900"
                >
                  Explore rental strategy
                </Link>
                .
              </p>
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

          <div className="mt-5">
            <Link
              href={`/intake?type=tenant&segment=general&area=${page.slug}`}
              className="text-sm font-medium underline underline-offset-4 transition hover:text-neutral-900"
            >
              Start a guided search
            </Link>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6">
          <h2 className="text-xl font-semibold tracking-tight">Housing profile</h2>

          <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-600">
            {page.housing.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>

          <div className="mt-5">
            <Link
              href="/buy"
              className="text-sm font-medium underline underline-offset-4 transition hover:text-neutral-900"
            >
              Explore buyer guidance
            </Link>
          </div>
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

          <div className="mt-5">
            <Link
              href="/houston"
              className="text-sm font-medium underline underline-offset-4 transition hover:text-neutral-900"
            >
              Compare more Houston neighborhoods
            </Link>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 md:col-span-2">
          <h2 className="text-xl font-semibold tracking-tight">
            Pricing and decision considerations
          </h2>

          <p className="mt-4 text-sm leading-7 text-neutral-600">
            {page.pricingNote}{" "}
            <Link
              href={`/intake?type=tenant&segment=general&area=${page.slug}`}
              className="underline underline-offset-4 transition hover:text-neutral-900"
            >
              Start a guided search
            </Link>
            .
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

      {page.seoFaqs.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="rounded-[1.75rem] border border-black/5 bg-white p-8 md:p-10">
            <h2 className="text-2xl font-semibold tracking-tight">
              Frequently asked questions
            </h2>

            <div className="mt-6 space-y-6">
              {page.seoFaqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="text-base font-semibold tracking-tight text-neutral-900">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-neutral-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[1.75rem] border border-black/5 bg-white p-8 md:p-10">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            Next step
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Stop guessing. Choose the right Houston area with structure.
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-600">
            Most clients waste time looking across too many areas without a
            clear framework. Structured intake aligns budget, commute,
            lifestyle, and property type so the search becomes more efficient.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/intake?type=tenant&segment=general&area=${page.slug}`}
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  );
}