"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { translations } from "../../lib/i18n/translations";

type Status = "idle" | "sending" | "error";
type Language = "en" | "es" | "ar";
type LeadType = "rent" | "buy" | "sell" | "landlord" | "other";
type Intent = "tenant" | "buyer" | "seller" | "landlord" | "other";

type Props = {
  lang: Language;
  intent: Intent;
  area: string;
  src?: string;
  channel?: string;
};

function intentToLeadType(intent: Intent): LeadType {
  if (intent === "tenant") return "rent";
  if (intent === "buyer") return "buy";
  if (intent === "seller") return "sell";
  if (intent === "landlord") return "landlord";
  return "other";
}

function getLeadScore(intent: Intent, src?: string) {
  let score = 0;

  if (intent === "buyer") score += 50;
  if (intent === "seller") score += 60;
  if (intent === "landlord") score += 40;
  if (intent === "tenant") score += 25;

  if (src?.includes("priority")) score += 30;
  if (src?.includes("seo")) score += 20;

  return score;
}

function coerceLeadType(v: string): LeadType {
  if (
    v === "rent" ||
    v === "buy" ||
    v === "sell" ||
    v === "landlord" ||
    v === "other"
  ) {
    return v;
  }
  return "other";
}

function formatAreaLabel(area: string) {
  if (!area) return "";
  return area
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function IntakeClient({
  lang,
  intent,
  area,
  src,
  channel,
}: Props) {
  const router = useRouter();
  const t = translations[lang].intake;
  const brand = translations[lang].brand;
  const isArabic = lang === "ar";

  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");

  const initialLeadType = useMemo(() => intentToLeadType(intent), [intent]);
  const [leadType, setLeadType] = useState<LeadType>(initialLeadType);

  useEffect(() => {
    setLeadType(intentToLeadType(intent));
    setMsg("");
  }, [intent]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (status === "sending") return;

    setStatus("sending");
    setMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    const leadScore = getLeadScore(intent, src);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,

          leadType,
          intent,
          area,

          source: "website",
          source_detail: src || "unknown",
          channel: channel || "direct",

          lead_score: leadScore,
          priority: leadScore >= 70 ? "high" : "normal",

          lang,
          preferredLanguage: lang,
          ref: "web_intake",
          source_page: window.location.pathname,
          source_path: window.location.pathname + window.location.search,

          requestContext: {
            intent,
            area,
          },
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setMsg(
          typeof data?.error === "string"
            ? data.error
            : t.messages.submitError
        );
        return;
      }

      router.push("/thanks");
    } catch {
      setStatus("error");
      setMsg(t.messages.networkError);
    } finally {
      setStatus((s) => (s === "sending" ? "idle" : s));
    }
  }

  const areaLabel = formatAreaLabel(area);

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-white text-neutral-950"
    >
      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-black/5 pb-6">
          <p className="text-sm text-neutral-500">{brand}</p>
          <LanguageSwitcher />
        </div>

        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {t.title}
          </h1>

          {areaLabel ? (
            <p className="mt-4 rounded-2xl border border-black/5 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
              Area preference: <span className="font-medium">{areaLabel}</span>
            </p>
          ) : null}
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <input
            name="name"
            placeholder="Full Name"
            className={inputClass}
            autoComplete="name"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className={inputClass}
            autoComplete="email"
            required
          />

          <input
            name="phone"
            type="tel"
            placeholder="Phone"
            className={inputClass}
            autoComplete="tel"
            required
          />

          <select
            name="timeline"
            className={inputClass}
            defaultValue=""
            required
          >
            <option value="" disabled>
              Select timeline
            </option>
            <option value="asap">ASAP</option>
            <option value="30_days">Within 30 days</option>
            <option value="1_3_months">1–3 months</option>
            <option value="3_plus_months">3+ months</option>
          </select>

          <select
            name="leadType"
            className={inputClass}
            value={leadType}
            onChange={(e) => setLeadType(coerceLeadType(e.target.value))}
          >
            <option value="rent">Rent</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
            <option value="landlord">Landlord</option>
            <option value="other">Other</option>
          </select>

          {leadType === "rent" ? (
            <>
              <input
                name="budget"
                inputMode="numeric"
                placeholder="Budget"
                className={inputClass}
                required
              />
              <input
                name="moveInDate"
                type="date"
                className={inputClass}
                required
              />
              <input
                name="areas"
                placeholder={areaLabel ? `Preferred Areas (${areaLabel})` : "Preferred Areas"}
                defaultValue={areaLabel}
                className={inputClass}
              />
            </>
          ) : null}

          {leadType === "buy" ? (
            <>
              <input
                name="priceRange"
                placeholder="Price Range"
                className={inputClass}
                required
              />
              <select
                name="financingStatus"
                className={inputClass}
                defaultValue=""
              >
                <option value="" disabled>
                  Financing Status
                </option>
                <option value="preapproved">Preapproved</option>
                <option value="cash">Cash</option>
                <option value="need_lender">Need lender</option>
                <option value="exploring">Exploring</option>
              </select>
              <input
                name="areas"
                placeholder={areaLabel ? `Preferred Areas (${areaLabel})` : "Preferred Areas"}
                defaultValue={areaLabel}
                className={inputClass}
              />
            </>
          ) : null}

          {leadType === "sell" ? (
            <>
              <input
                name="propertyAddress"
                placeholder="Property Address"
                className={inputClass}
                required
              />
              <select
                name="sellerGoal"
                className={inputClass}
                defaultValue=""
              >
                <option value="" disabled>
                  Seller Goal
                </option>
                <option value="max_price">Max price</option>
                <option value="fast_sale">Fast sale</option>
                <option value="both">Both</option>
              </select>
            </>
          ) : null}

          {leadType === "landlord" ? (
            <>
              <input
                name="propertyArea"
                placeholder="Property Area"
                className={inputClass}
                required
              />
              <select
                name="propertyType"
                className={inputClass}
                defaultValue=""
              >
                <option value="" disabled>
                  Property Type
                </option>
                <option value="house">House</option>
                <option value="condo_townhome">Condo / Townhome</option>
                <option value="apartment_unit">Apartment Unit</option>
                <option value="other">Other</option>
              </select>
              <select
                name="readyToLease"
                className={inputClass}
                defaultValue=""
              >
                <option value="" disabled>
                  Ready to Lease?
                </option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </>
          ) : null}

          <textarea
            name="message"
            placeholder="Tell me what you need..."
            className={`${inputClass} min-h-[140px]`}
          />

          <label className="flex items-start gap-3 text-sm text-neutral-700">
            <input
              name="contactConsent"
              type="checkbox"
              value="true"
              className="mt-1 h-4 w-4 rounded border-neutral-300"
              required
            />
            <span>I agree to be contacted about my request.</span>
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-black py-3 text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending..." : "Submit"}
          </button>

          {msg ? <p className="text-sm text-red-500">{msg}</p> : null}
        </form>
      </section>
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900";