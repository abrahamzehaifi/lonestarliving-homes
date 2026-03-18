"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { translations } from "../../lib/i18n/translations";

type Status = "idle" | "sending" | "error";
type Language = "en" | "es" | "ar";
type LeadType = "rent" | "buy" | "sell" | "landlord" | "other";
type Intent = "tenant" | "buyer" | "seller" | "landlord" | "other";
type Segment =
  | "medical_center"
  | "rice_student"
  | "relocation"
  | "apartment_locator"
  | "general"
  | "other";

type Props = {
  lang: Language;
  intent: Intent;
  segment: Segment;
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

export default function IntakeClient({ lang, intent, segment }: Props) {
  const router = useRouter();

  const t = translations[lang].intake;
  const brand = translations[lang].brand;
  const isArabic = lang === "ar";

  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");

  const initialLeadType = useMemo(() => intentToLeadType(intent), [intent]);
  const [leadType, setLeadType] = useState<LeadType>(initialLeadType);
  const [rentalGateComplete, setRentalGateComplete] = useState(
    initialLeadType !== "rent"
  );

  useEffect(() => {
    const nextLeadType = intentToLeadType(intent);
    setLeadType(nextLeadType);
    setRentalGateComplete(nextLeadType !== "rent");
  }, [intent]);

  function handleLeadTypeChange(next: LeadType) {
    setLeadType(next);
    setRentalGateComplete(next !== "rent");
    setMsg("");
  }

  function getHeading(type: LeadType) {
    return t.headings[type];
  }

  function getSubtext(type: LeadType) {
    return t.subtexts[type];
  }

  function onRentalGateContinue(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const form = e.currentTarget.form;
    if (!form) return;

    const budget = (
      form.elements.namedItem("budget") as HTMLInputElement | null
    )?.value?.trim();

    const moveInDate = (
      form.elements.namedItem("moveInDate") as HTMLInputElement | null
    )?.value?.trim();

    const screeningProfile = (
      form.elements.namedItem("screeningProfile") as HTMLSelectElement | null
    )?.value?.trim();

    if (!budget || !moveInDate || !screeningProfile) {
      setMsg(t.rentalGate.error);
      return;
    }

    setMsg("");
    setRentalGateComplete(true);
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
          intent,
          segment,
          source: "website",
          preferredLanguage: lang,
          lang,
          source_page: window.location.pathname,
          source_path: window.location.pathname + window.location.search,
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

      const dest = leadType === "rent" ? "/thanks/rent" : "/thanks";
      router.push(dest);
    } catch {
      setStatus("error");
      setMsg(t.messages.networkError);
    } finally {
      setStatus((s) => (s === "sending" ? "idle" : s));
    }
  }

  const heading = getHeading(leadType);
  const subtext = getSubtext(leadType);

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
            {t.requestLabel}
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
            {heading}
          </h1>

          <p className="mt-4 text-base leading-8 text-neutral-600">
            {subtext}
          </p>

          <p className="mt-4 text-sm leading-7 text-neutral-500">
            {t.requestSubtext}
          </p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={onSubmit}>
          <input type="hidden" name="intent" value={intent} />
          <input type="hidden" name="preferredLanguage" value={lang} />
          <input type="hidden" name="segment" value={segment} />
          <input type="hidden" name="source" value="website" />

          <SectionCard className="bg-white">
            <div className="mb-5">
              <p className="text-sm font-semibold text-neutral-950">
                {t.sections.contact.title}
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                {t.sections.contact.text}
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
            <>
              <SectionCard>
                <div className="mb-5">
                  <p className="text-sm font-semibold text-neutral-950">
                    {t.rentalGate.title}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">
                    {t.rentalGate.text}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <input
                    name="budget"
                    inputMode="numeric"
                    className={inputClass}
                    placeholder={t.fields.budget}
                    required
                  />

                  <input
                    name="moveInDate"
                    type="date"
                    className={inputClass}
                    required
                  />

                  <select
                    name="screeningProfile"
                    className={inputClass}
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      {t.options.screeningProfile.placeholder}
                    </option>
                    <option value="clean">{t.options.screeningProfile.clean}</option>
                    <option value="no_us_credit">
                      {t.options.screeningProfile.noUsCredit}
                    </option>
                    <option value="credit_concern">
                      {t.options.screeningProfile.creditConcern}
                    </option>
                    <option value="broken_lease">
                      {t.options.screeningProfile.brokenLease}
                    </option>
                    <option value="eviction">
                      {t.options.screeningProfile.eviction}
                    </option>
                  </select>
                </div>

                {!rentalGateComplete ? (
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={onRentalGateContinue}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800"
                    >
                      {t.rentalGate.continue}
                    </button>

                    <p className="text-xs text-neutral-500">
                      {t.rentalGate.continueHelp}
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    {t.rentalGate.completeMessage}
                  </div>
                )}
              </SectionCard>

              {rentalGateComplete ? (
                <SectionCard>
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-neutral-950">
                      {t.sections.searchDetails.title}
                    </p>
                    <p className="mt-1 text-sm text-neutral-600">
                      {t.sections.searchDetails.text}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      name="areas"
                      className={`${inputClass} md:col-span-2`}
                      placeholder={t.fields.preferredArea}
                      required
                    />

                    <textarea
                      name="message"
                      className={`min-h-[140px] ${inputClass} md:col-span-2`}
                      placeholder={t.fields.message}
                    />
                  </div>
                </SectionCard>
              ) : null}
            </>
          ) : null}

          {leadType === "buy" ? (
            <SectionCard>
              <div className="mb-5">
                <p className="text-sm font-semibold text-neutral-950">
                  {t.sections.buyerDetails.title}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {t.sections.buyerDetails.text}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  name="priceRange"
                  className={inputClass}
                  placeholder={t.fields.priceRange}
                  required
                />

                <select
                  name="financingStatus"
                  className={inputClass}
                  defaultValue=""
                  required
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
                  placeholder={t.fields.preferredArea}
                  required
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
                  {t.sections.sellerDetails.title}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {t.sections.sellerDetails.text}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  name="propertyAddress"
                  className={`${inputClass} md:col-span-2`}
                  placeholder={t.fields.propertyAddress}
                  required
                />

                <select
                  name="sellerGoal"
                  className={inputClass}
                  defaultValue=""
                  required
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
                  {t.sections.landlordDetails.title}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {t.sections.landlordDetails.text}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  name="propertyArea"
                  className={inputClass}
                  placeholder={t.fields.propertyArea}
                  required
                />

                <select
                  name="propertyType"
                  className={inputClass}
                  defaultValue=""
                  required
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
                  required
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
                disabled={
                  status === "sending" ||
                  (leadType === "rent" && !rentalGateComplete)
                }
                className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? t.sending : t.submit}
              </button>

              <p className="text-xs text-neutral-500">
                {t.structuredHelp}
              </p>
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