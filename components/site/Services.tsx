import Link from "next/link";

const services = [
  {
    title: "Buyer Representation",
    desc: "Search strategy, showings, negotiation, and closing coordination through formal buyer representation.",
    cta: "Buyer Consultation",
    href: "/intake?type=buyer",
  },
  {
    title: "Seller Representation",
    desc: "Pricing strategy, marketing guidance, offer evaluation, and transaction execution.",
    cta: "Seller Consultation",
    href: "/intake?type=seller",
  },
  {
    title: "Tenant Representation",
    desc: "Structured rental search support and lease coordination for qualified applicants.",
    cta: "Rental Consultation",
    href: "/intake?type=tenant",
  },
  {
    title: "Landlord Representation",
    desc: "Leasing-focused support, including marketing coordination, tenant placement process, and lease execution.",
    cta: "Leasing Consultation",
    href: "/intake?type=landlord",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Services
          </div>

          <h2 className="mt-6 text-3xl font-semibold leading-tight text-slate-950 md:text-4xl">
            Full-service representation with structured execution.
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            Clear intake. Defined expectations. Strategic negotiation. Designed
            to reduce friction and keep transactions controlled and moving.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.title}
              className="group rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md"
            >
              <h3 className="text-xl font-semibold text-slate-950">
                {s.title}
              </h3>

              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {s.desc}
              </p>

              <div className="mt-8">
                <Link
                  href={s.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition group-hover:translate-x-1"
                >
                  {s.cta}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-14 text-xs text-slate-500">
          Representation services are provided by Abraham Zehaifi, Texas
          REALTOR®, brokered by 5th Stream Realty LLC, under written agreements
          where required by Texas law.
        </p>
      </div>
    </section>
  );
}