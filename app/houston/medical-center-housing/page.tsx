import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Houston Medical Center Housing | Rentals, Apartments, Townhomes & Condos",
  description:
    "Find housing near the Houston Medical Center including apartments, townhomes, condos, and rental homes. Get matched based on budget, timeline, and requirements.",
};

const intakeHref = "/intake?type=rent&ref=medical_center";

export default function MedicalCenterHousingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
          Houston · Medical Center
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Housing near the Houston Medical Center
        </h1>

        <p className="mt-4 text-lg leading-8 text-neutral-600">
          Apartments, townhomes, condos, and rental homes matched to your
          budget, move-in timeline, and specific requirements.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={intakeHref}
            className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Start housing search
          </Link>

          <Link
            href="/contact"
            className="rounded-lg border px-5 py-3 text-sm font-medium transition hover:bg-neutral-50"
          >
            Ask a question
          </Link>
        </div>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight">
          What’s available in the Medical Center area
        </h2>

        <p className="mt-4 leading-7 text-neutral-600">
          Housing near the Medical Center ranges from high-rise apartments to
          townhomes and privately owned rental homes. The right option depends
          on your budget, parking needs, and how close you want to be to the
          hospitals.
        </p>

        <ul className="mt-6 space-y-3 text-neutral-700">
          <li>• Apartments (studios, 1–3 bedrooms, high-rise and mid-rise)</li>
          <li>• Condos (often larger layouts, sometimes privately managed)</li>
          <li>• Townhomes (attached garage options, more space)</li>
          <li>• Rental houses (limited supply, usually higher pricing)</li>
        </ul>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight">
          Pricing and expectations
        </h2>

        <p className="mt-4 leading-7 text-neutral-600">
          Pricing varies significantly depending on proximity, building quality,
          parking, and availability. The Medical Center remains one of the more
          competitive rental markets in Houston.
        </p>

        <ul className="mt-6 space-y-3 text-neutral-700">
          <li>• Studios and 1-bedrooms: broad pricing range depending on building quality</li>
          <li>• 2-bedrooms: stronger demand, especially for roommates or families</li>
          <li>• Townhomes with garage: premium pricing</li>
          <li>• Houses: limited inventory and often higher rent</li>
        </ul>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight">
          Who this is for
        </h2>

        <p className="mt-4 leading-7 text-neutral-600">
          Most clients searching in this area are working, studying, or rotating
          within the Texas Medical Center.
        </p>

        <ul className="mt-6 space-y-3 text-neutral-700">
          <li>• Medical professionals and hospital staff</li>
          <li>• Residents and fellows</li>
          <li>• Students (Rice, Baylor, UTHealth)</li>
          <li>• Relocation clients moving to Houston</li>
          <li>• International tenants without U.S. credit</li>
        </ul>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight">
          What actually matters when choosing
        </h2>

        <p className="mt-4 leading-7 text-neutral-600">
          The biggest issues are usually not the listing itself. They are the
          details that affect daily living, approval, and whether the move
          actually works in practice.
        </p>

        <ul className="mt-6 space-y-3 text-neutral-700">
          <li>• Parking (garage, covered, open, or street)</li>
          <li>• Commute time to the specific hospital or campus building</li>
          <li>• Budget versus building quality trade-offs</li>
          <li>• Approval requirements (income, credit, documentation)</li>
          <li>• Move-in timing and real unit availability</li>
        </ul>
      </section>

      <section className="mt-16 rounded-2xl border bg-neutral-50 p-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          Get matched with available housing
        </h2>

        <p className="mt-3 max-w-xl leading-7 text-neutral-600">
          Submit your criteria and receive options that match your budget,
          timeline, and requirements. This saves time and helps avoid options
          that do not match your budget, timing, or requirements.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={intakeHref}
            className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Start now
          </Link>

          <Link
            href="/rentals"
            className="rounded-lg border px-6 py-3 text-sm font-medium transition hover:bg-white"
          >
            View rentals page
          </Link>
        </div>
      </section>

      <section className="mt-12 text-sm text-neutral-500">
        Looking specifically for apartments?{" "}
        <Link
          href="/houston/medical-center-apartments"
          className="underline underline-offset-4"
        >
          View Medical Center apartments
        </Link>
      </section>
    </main>
  );
}