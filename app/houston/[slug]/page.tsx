import { notFound } from "next/navigation";

const VALID_SLUGS = [
  "cypress",
  "katy",
  "heights",
  "memorial",
  "river-oaks",
  "downtown",
  "midtown",
  "montrose",
  "spring-branch",
  "baytown",
];

export default function HoustonAreaPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  if (!VALID_SLUGS.includes(slug)) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-neutral-950">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-4xl font-semibold tracking-tight capitalize">
          {slug.replace("-", " ")} Houston
        </h1>

        <p className="mt-4 text-neutral-600">
          Area guide and housing insights for {slug.replace("-", " ")}.
        </p>
      </section>
    </main>
  );
}