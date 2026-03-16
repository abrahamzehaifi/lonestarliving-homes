"use client";

import { FormEvent, ReactNode, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { getLanguage } from "../../lib/i18n/translations";

type FormDataState = {
  name: string;
  email: string;
  phone: string;
  moveInDate: string;
  budget: string;
  areas: string;
  screeningProfile: string;
  pets: string;
  message: string;
  consent: boolean;
};

const initialState: FormDataState = {
  name: "",
  email: "",
  phone: "",
  moveInDate: "",
  budget: "",
  areas: "",
  screeningProfile: "",
  pets: "",
  message: "",
  consent: false,
};

function coerceSegment(value: string | null) {
  const x = (value ?? "").toLowerCase();

  if (
    x === "medical_center" ||
    x === "rice_student" ||
    x === "relocation" ||
    x === "apartment_locator" ||
    x === "general" ||
    x === "other"
  ) {
    return x;
  }

  return "general";
}

export default function ApplyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = getLanguage(searchParams.get("lang") ?? "en");

  const [form, setForm] = useState<FormDataState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const isArabic = lang === "ar";
  const segment = coerceSegment(searchParams.get("segment"));

  function updateField<K extends keyof FormDataState>(
    key: K,
    value: FormDataState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          moveInDate: form.moveInDate,
          budget: form.budget,
          areas: form.areas,
          screeningProfile: form.screeningProfile,
          message: [form.pets, form.message].filter(Boolean).join("\n\n"),
          contactConsent: form.consent,
          preferredLanguage: lang,
          leadType: "rent",
          intent: "tenant",
          timeline: "asap",
          source: "website",
          segment,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.error || "Unable to submit request.");
      }

      setSubmitSuccess(true);
      setForm(initialState);

      window.setTimeout(() => {
        router.push(`/thanks/rent?lang=${lang}`);
      }, 1200);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-white text-neutral-950"
    >
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
              LonestarLiving.homes
            </p>
          </div>

          <LanguageSwitcher
            currentPath="/apply"
            currentLang={lang}
            extraQuery={{ segment }}
          />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
          Application
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          Begin rental assistance
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-600">
          Submit your rental criteria so the search can begin with your budget,
          move-in timing, target areas, and screening profile.
        </p>

        {submitSuccess ? (
          <div className="mt-10 rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              Request received
            </h2>
            <p className="mt-3 text-neutral-700">
              Your information has been submitted successfully. You will be
              redirected shortly.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <input type="hidden" name="preferredLanguage" value={lang} />
            <input type="hidden" name="leadType" value="rent" />
            <input type="hidden" name="intent" value="tenant" />
            <input type="hidden" name="timeline" value="asap" />
            <input type="hidden" name="source" value="website" />
            <input type="hidden" name="segment" value={segment} />

            <div className="grid gap-6 md:grid-cols-2">
              <Field
                label="Full name"
                required
                input={
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Your full name"
                    className={inputClass}
                    required
                  />
                }
              />

              <Field
                label="Email"
                required
                input={
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                    required
                  />
                }
              />

              <Field
                label="Phone"
                required
                input={
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="Phone number"
                    className={inputClass}
                    required
                  />
                }
              />

              <Field
                label="Move-in date"
                required
                input={
                  <input
                    type="date"
                    value={form.moveInDate}
                    onChange={(e) => updateField("moveInDate", e.target.value)}
                    className={inputClass}
                    required
                  />
                }
              />

              <Field
                label="Monthly budget"
                required
                input={
                  <input
                    type="number"
                    min="500"
                    value={form.budget}
                    onChange={(e) => updateField("budget", e.target.value)}
                    placeholder="Monthly budget"
                    className={inputClass}
                    required
                  />
                }
              />

              <Field
                label="Preferred areas"
                required
                input={
                  <input
                    type="text"
                    value={form.areas}
                    onChange={(e) => updateField("areas", e.target.value)}
                    placeholder="Preferred neighborhoods or areas"
                    className={inputClass}
                    required
                  />
                }
              />

              <Field
                label="Screening profile"
                required
                input={
                  <select
                    value={form.screeningProfile}
                    onChange={(e) =>
                      updateField("screeningProfile", e.target.value)
                    }
                    className={inputClass}
                    required
                  >
                    <option value="">Select one</option>
                    <option value="clean">Clean screening</option>
                    <option value="no_us_credit">No U.S. credit</option>
                    <option value="credit_concern">Credit concern</option>
                    <option value="broken_lease">Broken lease</option>
                    <option value="eviction">Eviction</option>
                  </select>
                }
              />

              <Field
                label="Pets"
                input={
                  <input
                    type="text"
                    value={form.pets}
                    onChange={(e) => updateField("pets", e.target.value)}
                    placeholder="Pets, breed, weight, or none"
                    className={inputClass}
                  />
                }
              />
            </div>

            <div className="mt-6 grid gap-6">
              <Field
                label="Additional details"
                input={
                  <textarea
                    value={form.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    placeholder="Anything else that would help narrow the search"
                    rows={6}
                    className={inputClass}
                  />
                }
              />

              <label className="flex items-start gap-3 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => updateField("consent", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-neutral-300"
                  required
                />
                <span>
                  I consent to be contacted regarding my housing request.
                </span>
              </label>
            </div>

            {submitError ? (
              <p className="mt-4 text-sm text-red-600">{submitError}</p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        )}
      </section>

      <footer className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-500">LonestarLiving.homes</p>
          <LanguageSwitcher
            currentPath="/apply"
            currentLang={lang}
            extraQuery={{ segment }}
          />
        </div>
      </footer>
    </main>
  );
}

function Field({
  label,
  input,
  required = false,
}: {
  label: string;
  input: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-neutral-800">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      {input}
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900";