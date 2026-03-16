"use client";

import Link from "next/link";

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
          Application
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          Rental request
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-600">
          This page is being updated. Please use the intake form below to begin
          your request.
        </p>

        <div className="mt-8">
          <Link
            href="/intake?type=tenant&lang=en"
            className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Go to intake
          </Link>
        </div>
      </section>
    </main>
  );
}