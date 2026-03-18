"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buildHref } from "@/lib/i18n/buildHref";

export default function Hero() {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "en";

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[url('/images/hero-houston.jpg')] bg-cover bg-center" />

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/65 to-slate-950/90" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <p className="text-xs uppercase tracking-[0.32em] text-white/70 md:text-sm">
          Full-Service Real Estate Representation
        </p>

        <h1 className="mt-6 max-w-[20ch] text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-[#F2EFEA] md:text-6xl">
          Houston real estate,
          <br />
          executed with precision.
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
          Representation for buyers, sellers, landlords, and qualified renters
          across Houston, with clear communication and disciplined execution.
        </p>

        <p className="mt-4 text-sm text-white/55">
          Serving Houston • Buying, selling, leasing, relocation • Arabic,
          English, Español
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href={buildHref("/contact", {}, lang)}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-white/90 active:scale-[0.99]"
          >
            Request a Strategy Call
          </Link>

          <Link
            href={buildHref("/buy", {}, lang)}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition hover:border-white/35 hover:bg-white/10 active:scale-[0.99]"
          >
            Buy a Home
          </Link>

          <Link
            href={buildHref("/sell", {}, lang)}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition hover:border-white/35 hover:bg-white/10 active:scale-[0.99]"
          >
            Sell Your Home
          </Link>

          <span className="text-sm text-white/55">
            Brokered by 5th Stream Realty LLC
          </span>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {[
            "Buyer and seller representation",
            "Leasing and landlord support",
            "Houston market expertise",
          ].map((text) => (
            <div
              key={text}
              className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
            >
              <div className="flex items-center gap-2 text-sm text-white/85">
                <span aria-hidden className="text-white/80">
                  ✓
                </span>
                <span className="leading-snug">{text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}