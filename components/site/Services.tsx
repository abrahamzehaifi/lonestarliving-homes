"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const services = [
  {
    title: "Buyer Representation",
    desc: "Support for clients purchasing a home, from the early search through contract and closing.",
    cta: "Buyer Request",
    type: "buyer",
    src: "services_buyer",
  },
  {
    title: "Seller Representation",
    desc: "Support for owners preparing, pricing, marketing, and selling a property in Houston.",
    cta: "Seller Request",
    type: "seller",
    src: "services_seller",
  },
  {
    title: "Rental Guidance",
    desc: "Help for clients searching for a rental home, apartment, or lease opportunity that fits their needs.",
    cta: "Rental Request",
    type: "tenant",
    src: "services_tenant",
  },
  {
    title: "Leasing Support",
    desc: "Help for property owners who want assistance bringing a rental to market and moving toward lease execution.",
    cta: "Owner Request",
    type: "landlord",
    src: "services_landlord",
  },
];

export default function ServicesSection() {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "en";

  return (
    <section id="services" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Services
          </div>

          <h2 className="mt-6 text-3xl font-semibold leading-tight text-slate-950 md:text-4xl">
            Real estate representation with a clear, steady approach.
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            Buying, selling, renting, or leasing out a property often comes with
            important decisions. The focus here is simple: clear communication,
            practical guidance, and dependable support.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {services.map((service) => {
            const href = `/intake?type=${service.type}&src=${service.src}&channel=organic&lang=${lang}`;

            return (
              <div
                key={service.title}
                className="group rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md"
              >
                <h3 className="text-xl font-semibold text-slate-950">
                  {service.title}
                </h3>

                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {service.desc}
                </p>

                <div className="mt-8">
                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition group-hover:translate-x-1"
                  >
                    {service.cta}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-14 text-xs leading-relaxed text-slate-500">
          Representation services are provided by Abraham Zehaifi, Texas
          REALTOR®, brokered by 5th Stream Realty LLC, under written agreements
          where required by Texas law.
        </p>
      </div>
    </section>
  );
}