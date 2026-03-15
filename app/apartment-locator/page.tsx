import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import ServiceCard from "@/components/ServiceCard";

function ProcessStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
        Step {number}
      </p>
      <h3 className="mt-3 text-lg font-semibold tracking-tight text-neutral-950">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-neutral-600">{description}</p>
    </div>
  );
}

export default function ApartmentLocatorPage() {
  return (
    <main className="pb-20">
      <HeroSection
        eyebrow="Apartment Locator"
        title="Houston apartment guidance for qualified renters."
        description="If you are moving to Houston or relocating within the city, submit your criteria and receive more focused apartment guidance based on budget, location, move-in timing, and day-to-day practicality."
      />

      <section className="mx-auto max-w-5xl px-6">
        <div className="rounded-[2rem] border border-black/5 bg-white p-8 md:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              Start here
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
              Start your Houston apartment search with structured criteria.
            </h2>
            <p className="mt-4 text-base leading-8 text-neutral-600">
              The fastest way to receive useful guidance is to submit your
              housing criteria directly. That allows the search to start with
              your actual budget, timeline, target area, and screening profile
              instead of vague back-and-forth.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-black/5 bg-neutral-50 p-5">
              <p className="text-sm font-medium text-neutral-900">
                Monthly budget
              </p>
              <p className="mt-2 text-sm leading-7 text-neutral-600">
                Set a realistic monthly target before touring.
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-neutral-50 p-5">
              <p className="text-sm font-medium text-neutral-900">
                Move-in date
              </p>
              <p className="mt-2 text-sm leading-7 text-neutral-600">
                Timing affects pricing, availability, and next steps.
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-neutral-50 p-5">
              <p className="text-sm font-medium text-neutral-900">Bedrooms</p>
              <p className="mt-2 text-sm leading-7 text-neutral-600">
                Clarify space requirements from the beginning.
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-neutral-50 p-5">
              <p className="text-sm font-medium text-neutral-900">
                Preferred areas
              </p>
              <p className="mt-2 text-sm leading-7 text-neutral-600">
                Focus the search around commute, school, or lifestyle needs.
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-neutral-50 p-5">
              <p className="text-sm font-medium text-neutral-900">
                Credit and screening
              </p>
              <p className="mt-2 text-sm leading-7 text-neutral-600">
                Helps identify communities that are more realistic fits.
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-neutral-50 p-5">
              <p className="text-sm font-medium text-neutral-900">Pets</p>
              <p className="mt-2 text-sm leading-7 text-neutral-600">
                Important for narrowing eligible properties quickly.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/intake?type=tenant&lang=en"
              className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Start Apartment Search
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-5xl px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            Focus areas
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
            Houston rental guidance built around real relocation needs.
          </h2>
          <p className="mt-4 text-base leading-8 text-neutral-600">
            Apartment searches are more efficient when they are organized around
            where you need to be, how you need to commute, and what type of
            daily routine the property needs to support.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <ServiceCard
            title="Texas Medical Center"
            description="Housing guidance for medical professionals, staff, researchers, and clients seeking practical access to the Texas Medical Center."
            href="/medical-center-housing"
            cta="Explore Medical Center housing"
          />

          <ServiceCard
            title="Rice University Area"
            description="Guidance for students, researchers, and visiting academics seeking housing near Rice University and surrounding neighborhoods."
            href="/rice-student-housing"
            cta="Explore Rice area housing"
          />

          <ServiceCard
            title="Houston Relocation"
            description="Structured rental guidance for clients moving from another city, another state, or from outside the United States."
            href="/houston-relocation"
            cta="Explore relocation guidance"
          />

          <ServiceCard
            title="General Houston Rentals"
            description="Support for qualified renters seeking a more organized apartment search across Houston based on budget, area, and timing."
            href="/rent"
            cta="View rental guidance"
          />
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-5xl px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            Process
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
            A cleaner apartment search process.
          </h2>
          <p className="mt-4 text-base leading-8 text-neutral-600">
            The goal is to move from broad interest to structured next steps as
            quickly as possible.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <ProcessStep
            number="01"
            title="Submit your criteria"
            description="Provide your budget, move-in date, target areas, and basic screening details."
          />
          <ProcessStep
            number="02"
            title="Review fit"
            description="Your request is reviewed against location, timing, and practical search criteria."
          />
          <ProcessStep
            number="03"
            title="Receive next-step guidance"
            description="You receive a more focused direction for apartment options and search priorities."
          />
          <ProcessStep
            number="04"
            title="Move toward application"
            description="Once a workable fit is identified, the process can move toward tours and application."
          />
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-5xl px-6">
        <div className="rounded-[2rem] border border-black/5 bg-[#efefec] p-8 md:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              Next step
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
              Start your Houston apartment request.
            </h2>
            <p className="mt-4 text-base leading-8 text-neutral-600">
              Submit your criteria through the intake form so the search starts
              with the facts that actually matter.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/intake?type=tenant&lang=en"
              className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Apply Now
            </Link>

            <Link
              href="/rent"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-6 text-sm font-medium text-neutral-900 transition hover:border-black/20 hover:bg-white"
            >
              Review Rental Guidance
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}