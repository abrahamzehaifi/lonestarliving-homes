"use client";

type Props = {
  lang: "en" | "es" | "ar";
};

export default function HoustonRelocationClient({ lang }: Props) {
  return (
    <main className="min-h-screen bg-[#f5f5f3] text-neutral-950">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">
          Houston Relocation
        </h1>
        <p className="mt-4 text-neutral-600">Language: {lang}</p>
      </section>
    </main>
  );
}