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
};

function intentToLeadType(intent: Intent): LeadType {
  if (intent === "tenant") return "rent";
  if (intent === "buyer") return "buy";
  if (intent === "seller") return "sell";
  if (intent === "landlord") return "landlord";
  return "other";
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

function getIntroCopy(lang: Language, leadType: LeadType) {
  const copy = {
    en: {
      requestLabel: "Request",
      generalSubtext:
        "Share a few details and I’ll follow up with the next step.",
      headings: {
        rent: "Rental Request",
        buy: "Buyer Request",
        sell: "Seller Request",
        landlord: "Leasing Request",
        other: "Tell Me What You Need",
      },
      subtexts: {
        rent: "Tell me about your move, budget, and preferred areas.",
        buy: "Tell me about your goals, budget, and the areas you want to explore.",
        sell: "Tell me about the property and what you would like to accomplish.",
        landlord: "Tell me about the property and the leasing help you need.",
        other: "Share a few details and I’ll review the best next step.",
      },
      submitHelp: "I’ll review your request and follow up directly.",
      areaPrefix: "Area preference:",
      contactTitle: "Your Information",
      contactText: "Enter your contact details and a few basics.",
      detailsTitle: "Request Details",
      detailsText: "A few details help me understand what you need.",
    },
    es: {
      requestLabel: "Solicitud",
      generalSubtext:
        "Comparta algunos detalles y le daré seguimiento con el siguiente paso.",
      headings: {
        rent: "Solicitud de renta",
        buy: "Solicitud de compra",
        sell: "Solicitud de venta",
        landlord: "Solicitud de arrendamiento",
        other: "Cuénteme lo que necesita",
      },
      subtexts: {
        rent: "Cuénteme sobre su mudanza, presupuesto y zonas preferidas.",
        buy: "Cuénteme sobre sus metas, presupuesto y las zonas que desea explorar.",
        sell: "Cuénteme sobre la propiedad y lo que le gustaría lograr.",
        landlord:
          "Cuénteme sobre la propiedad y la ayuda de arrendamiento que necesita.",
        other:
          "Comparta algunos detalles y revisaré el mejor siguiente paso.",
      },
      submitHelp: "Revisaré su solicitud y le responderé directamente.",
      areaPrefix: "Zona preferida:",
      contactTitle: "Su información",
      contactText: "Ingrese sus datos y algunos datos básicos.",
      detailsTitle: "Detalles de la solicitud",
      detailsText: "Algunos detalles me ayudan a entender lo que necesita.",
    },
    ar: {
      requestLabel: "طلب",
      generalSubtext: "شارك بعض التفاصيل وسأتابع معك بالخطوة التالية.",
      headings: {
        rent: "طلب استئجار",
        buy: "طلب شراء",
        sell: "طلب بيع",
        landlord: "طلب تأجير عقار",
        other: "أخبرني بما تحتاجه",
      },
      subtexts: {
        rent: "أخبرني عن موعد الانتقال والميزانية والمناطق المفضلة.",
        buy: "أخبرني عن هدفك والميزانية والمناطق التي ترغب في استكشافها.",
        sell: "أخبرني عن العقار وما الذي ترغب في تحقيقه.",
        landlord: "أخبرني عن العقار ونوع المساعدة التي تحتاجها في التأجير.",
        other: "شارك بعض التفاصيل وسأراجع أفضل خطوة تالية.",
      },
      submitHelp: "سأراجع طلبك وأتواصل معك مباشرة.",
      areaPrefix: "المنطقة المفضلة:",
      contactTitle: "معلوماتك",
      contactText: "أدخل معلومات التواصل وبعض التفاصيل الأساسية.",
      detailsTitle: "تفاصيل الطلب",
      detailsText: "بعض التفاصيل تساعدني على فهم ما تحتاجه.",
    },
  } as const;

  return {
    requestLabel: copy[lang].requestLabel,
    generalSubtext: copy[lang].generalSubtext,
    heading: copy[lang].headings[leadType],
    subtext: copy[lang].subtexts[leadType],
    submitHelp: copy[lang].submitHelp,
    areaPrefix: copy[lang].areaPrefix,
    contactTitle: copy[lang].contactTitle,
    contactText: copy[lang].contactText,
    detailsTitle: copy[lang].detailsTitle,
    detailsText: copy[lang].detailsText,
  };
}

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[1.75rem] border border-black/5 bg-neutral-50 p-5 md:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export default function IntakeClient({ lang, intent, area }: Props) {
  const router = useRouter();

  const t = translations[lang].intake;
  const brand = translations[lang].brand;
  const isArabic = lang === "ar";

  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");

  const initialLeadType = useMemo(() => intentToLeadType(intent), [intent]);
  const [leadType, setLeadType] = useState<LeadType>(initialLeadType);

  useEffect(() => {
    const nextLeadType = intentToLeadType(intent);
    setLeadType(nextLeadType);
    setMsg("");
  }, [intent]);

  function handleLeadTypeChange(next: LeadType) {
    setLeadType(next);
    setMsg("");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (status === "sending") return;

    setStatus("sending");
    setMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          preferredLanguage: lang,
          lang,
          source: "website",
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

  const copy = getIntroCopy(lang, leadType);
  const areaLabel = formatAreaLabel(area);

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-white text-neutral-950"
    >
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-col gap-4 border-b border-black/5 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
              {brand}
            </p>
          </div>

          <LanguageSwitcher />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            {copy.requestLabel}
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
            {copy.heading}
          </h1>

          <p className="mt-4 text-base leading-8 text-neutral-600">
            {copy.subtext}
          </p>

          {areaLabel ? (
            <p className="mt-4 rounded-2xl border border-black/5 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
              {copy.areaPrefix} <span className="font-medium">{areaLabel}</span>
            </p>
          ) : null}

          <p className="mt-4 text-sm leading-7 text-neutral-500">
            {copy.generalSubtext}
          </p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={onSubmit}>
          <input type="hidden" name="preferredLanguage" value={lang} />
          <input type="hidden" name="source" value="website" />
          <input type="hidden" name="ref" value="web_intake" />

          <SectionCard className="bg-white">
            <div className="mb-5">
              <p className="text-sm font-semibold text-neutral-950">
                {copy.contactTitle}
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                {copy.contactText}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                name="name"
                className={inputClass}
                placeholder={t.fields.fullName}
                autoComplete="name"
                required
              />

              <input
                name="email"
                type="email"
                className={inputClass}
                placeholder={t.fields.email}
                autoComplete="email"
                required
              />

              <input
                name="phone"
                type="tel"
                className={inputClass}
                placeholder={t.fields.phone}
                autoComplete="tel"
                required
              />

              <select
                name="leadType"
                className={inputClass}
                value={leadType}
                onChange={(e) =>
                  handleLeadTypeChange(coerceLeadType(e.target.value))
                }
              >
                <option value="rent">{t.options.leadType.rent}</option>
                <option value="buy">{t.options.leadType.buy}</option>
                <option value="sell">{t.options.leadType.sell}</option>
                <option value="landlord">{t.options.leadType.landlord}</option>
                <option value="other">{t.options.leadType.other}</option>
              </select>
            </div>

            <div className="mt-4">
              <select
                name="timeline"
                className={inputClass}
                defaultValue=""
                required
              >
                <option value="" disabled>
                  {t.fields.timelinePlaceholder}
                </option>
                <option value="asap">{t.options.timeline.asap}</option>
                <option value="30_days">{t.options.timeline.within30}</option>
                <option value="1_3_months">{t.options.timeline.oneToThree}</option>
                <option value="3_plus_months">
                  {t.options.timeline.threePlus}
                </option>
              </select>
            </div>
          </SectionCard>

          {leadType === "rent" ? (
            <SectionCard>
              <div className="mb-5">
                <p className="text-sm font-semibold text-neutral-950">
                  {copy.detailsTitle}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {copy.detailsText}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  name="budget"
                  inputMode="numeric"
                  className={inputClass}
                  placeholder={t.fields.budget}
                />

                <input
                  name="moveInDate"
                  type="date"
                  className={inputClass}
                />

                <input
                  name="areas"
                  className={`${inputClass} md:col-span-2`}
                  placeholder={
                    areaLabel
                      ? `${t.fields.preferredArea} (${areaLabel})`
                      : t.fields.preferredArea
                  }
                  defaultValue={areaLabel}
                />

                <textarea
                  name="message"
                  className={`min-h-[140px] ${inputClass} md:col-span-2`}
                  placeholder={t.fields.message}
                />
              </div>
            </SectionCard>
          ) : null}

          {leadType === "buy" ? (
            <SectionCard>
              <div className="mb-5">
                <p className="text-sm font-semibold text-neutral-950">
                  {copy.detailsTitle}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {copy.detailsText}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  name="priceRange"
                  className={inputClass}
                  placeholder={t.fields.priceRange}
                />

                <select
                  name="financingStatus"
                  className={inputClass}
                  defaultValue=""
                >
                  <option value="" disabled>
                    {t.options.financingStatus.placeholder}
                  </option>
                  <option value="preapproved">
                    {t.options.financingStatus.preapproved}
                  </option>
                  <option value="cash">{t.options.financingStatus.cash}</option>
                  <option value="need_lender">
                    {t.options.financingStatus.needLender}
                  </option>
                  <option value="exploring">
                    {t.options.financingStatus.exploring}
                  </option>
                </select>

                <input
                  name="areas"
                  className={`${inputClass} md:col-span-2`}
                  placeholder={
                    areaLabel
                      ? `${t.fields.preferredArea} (${areaLabel})`
                      : t.fields.preferredArea
                  }
                  defaultValue={areaLabel}
                />

                <textarea
                  name="message"
                  className={`min-h-[140px] ${inputClass} md:col-span-2`}
                  placeholder={t.fields.message}
                />
              </div>
            </SectionCard>
          ) : null}

          {leadType === "sell" ? (
            <SectionCard>
              <div className="mb-5">
                <p className="text-sm font-semibold text-neutral-950">
                  {copy.detailsTitle}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {copy.detailsText}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  name="propertyAddress"
                  className={`${inputClass} md:col-span-2`}
                  placeholder={t.fields.propertyAddress}
                />

                <select
                  name="sellerGoal"
                  className={inputClass}
                  defaultValue=""
                >
                  <option value="" disabled>
                    {t.options.sellerGoal.placeholder}
                  </option>
                  <option value="max_price">{t.options.sellerGoal.maxPrice}</option>
                  <option value="fast_sale">{t.options.sellerGoal.fastSale}</option>
                  <option value="both">{t.options.sellerGoal.both}</option>
                </select>

                <textarea
                  name="message"
                  className={`min-h-[140px] ${inputClass} md:col-span-2`}
                  placeholder={t.fields.message}
                />
              </div>
            </SectionCard>
          ) : null}

          {leadType === "landlord" ? (
            <SectionCard>
              <div className="mb-5">
                <p className="text-sm font-semibold text-neutral-950">
                  {copy.detailsTitle}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {copy.detailsText}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  name="propertyArea"
                  className={inputClass}
                  placeholder={t.fields.propertyArea}
                />

                <select
                  name="propertyType"
                  className={inputClass}
                  defaultValue=""
                >
                  <option value="" disabled>
                    {t.options.propertyType.placeholder}
                  </option>
                  <option value="house">{t.options.propertyType.house}</option>
                  <option value="condo_townhome">
                    {t.options.propertyType.condoTownhome}
                  </option>
                  <option value="apartment_unit">
                    {t.options.propertyType.apartmentUnit}
                  </option>
                  <option value="other">{t.options.propertyType.other}</option>
                </select>

                <select
                  name="readyToLease"
                  className={`${inputClass} md:col-span-2`}
                  defaultValue=""
                >
                  <option value="" disabled>
                    {t.options.readyToLease.placeholder}
                  </option>
                  <option value="yes">{t.options.readyToLease.yes}</option>
                  <option value="no">{t.options.readyToLease.no}</option>
                </select>

                <textarea
                  name="message"
                  className={`min-h-[140px] ${inputClass} md:col-span-2`}
                  placeholder={t.fields.message}
                />
              </div>
            </SectionCard>
          ) : null}

          {leadType === "other" ? (
            <SectionCard>
              <p className="text-sm leading-7 text-neutral-600">{t.otherBox}</p>

              <textarea
                name="message"
                className={`mt-4 min-h-[140px] ${inputClass}`}
                placeholder={t.placeholders.otherMessage}
              />
            </SectionCard>
          ) : null}

          <SectionCard className="bg-white">
            <label className="flex items-start gap-3 text-sm text-neutral-700">
              <input
                name="contactConsent"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-neutral-300"
                required
              />
              <span>{t.fields.consent}</span>
            </label>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? t.sending : t.submit}
              </button>

              <p className="text-xs text-neutral-500">{copy.submitHelp}</p>
            </div>

            {msg ? <p className="mt-4 text-sm text-red-600">{msg}</p> : null}

            <p className="mt-5 text-xs leading-6 text-neutral-500">
              {t.disclaimer}
            </p>
          </SectionCard>
        </form>
      </section>

      <footer className="border-t border-black/5">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-500">{brand}</p>
          <LanguageSwitcher />
        </div>
      </footer>
    </main>
  );
}

const inputClass =
  "w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900";