"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { RentalFormState } from "@/lib/leadTypes";

type Props = {
  defaultAreasHint?: string;
};

type CreditBand = "500-549" | "550-599" | "600-649" | "650-699" | "700+";
type PetsValue = "unknown" | "no" | "yes" | "service_animal";

function bandToNumber(band?: CreditBand): number | null {
  if (!band) return null;
  if (band === "700+") return 720;

  const [loRaw, hiRaw] = band.split("-");
  const lo = Number(loRaw);
  const hi = Number(hiRaw);

  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return null;
  return Math.round((lo + hi) / 2);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function track(event: string, props?: Record<string, unknown>) {
  console.log("[track]", event, props ?? {});
}

const initialState: RentalFormState = {
  name: "",
  email: "",
  phone: "",

  budget: "",
  areas: "",
  moveInDate: "",

  creditScoreBand: undefined,
  incomeMonthly: "",

  eviction: undefined,
  brokenLease: undefined,
  pets: "unknown",

  message: "",

  screeningAck: false,
  contactConsent: true,
};

export default function LeadFormWizard({ defaultAreasHint }: Props) {
  const router = useRouter();
  const leadType = "rent";

  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [s, setS] = useState<RentalFormState>(() => ({
    ...initialState,
    areas: defaultAreasHint ?? "",
  }));

  const canNext = useMemo(() => {
    if (step === 1) {
      return s.name.trim().length >= 2 && isValidEmail(s.email);
    }

    if (step === 2) {
      return (
        s.budget.trim().length > 0 &&
        Number(s.budget) > 0 &&
        s.areas.trim().length >= 2
      );
    }

    if (step === 3) {
      return (
        !!s.moveInDate &&
        !!s.creditScoreBand &&
        s.incomeMonthly.trim().length > 0 &&
        Number(s.incomeMonthly) > 0
      );
    }

    if (step === 4) {
      return (
        s.screeningAck === true &&
        s.contactConsent === true &&
        s.message.trim().length >= 5
      );
    }

    return false;
  }, [step, s]);

  async function submit() {
    if (busy) return;

    setBusy(true);
    setError(null);

    try {
      track("lead_submit_attempt", { leadType });

      const payload = {
        leadType,

        name: s.name.trim(),
        email: s.email.trim(),
        phone: s.phone.trim() || null,

        budget: s.budget.trim() ? Number(s.budget) : null,
        areas: s.areas.trim() || null,
        moveInDate: s.moveInDate || null,

        creditScore: bandToNumber(s.creditScoreBand as CreditBand) ?? null,
        incomeMonthly: s.incomeMonthly.trim()
          ? Number(s.incomeMonthly)
          : null,

        eviction: typeof s.eviction === "boolean" ? s.eviction : null,
        brokenLease: typeof s.brokenLease === "boolean" ? s.brokenLease : null,

        pets: s.pets ?? "unknown",

        message: s.message.trim(),

        screeningAck: s.screeningAck,
        contactConsent: s.contactConsent,
      };

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const apiError = data?.error ? String(data.error) : null;
        throw new Error(apiError || `Lead submit failed (${res.status})`);
      }

      track("lead_submit_success", { leadType });
      router.push("/thanks/rent");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      track("lead_submit_error", { leadType, message: msg });
      setError(msg || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-xl rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">Rental Matching</div>
        <div className="text-xs text-gray-500">Step {step} of 4</div>
      </div>

      {error && (
        <div
          aria-live="polite"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <div className="text-lg font-semibold">Basics</div>

          <label className="block">
            <span className="text-sm text-gray-700">Name</span>
            <input
              className="mt-1 w-full rounded-xl border p-3"
              value={s.name}
              onChange={(e) =>
                setS((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Your name"
              autoComplete="name"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Email</span>
            <input
              className="mt-1 w-full rounded-xl border p-3"
              type="email"
              inputMode="email"
              value={s.email}
              onChange={(e) =>
                setS((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="you@email.com"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Phone (optional)</span>
            <input
              className="mt-1 w-full rounded-xl border p-3"
              type="tel"
              inputMode="tel"
              value={s.phone}
              onChange={(e) =>
                setS((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="(xxx) xxx-xxxx"
              autoComplete="tel"
            />
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div className="text-lg font-semibold">Budget + areas</div>

          <label className="block">
            <span className="text-sm text-gray-700">Monthly budget (USD)</span>
            <input
              className="mt-1 w-full rounded-xl border p-3"
              type="number"
              value={s.budget}
              onChange={(e) =>
                setS((prev) => ({
                  ...prev,
                  budget: e.target.value,
                }))
              }
              placeholder="e.g. 1600"
              min={0}
              inputMode="numeric"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Areas / ZIPs</span>
            <input
              className="mt-1 w-full rounded-xl border p-3"
              value={s.areas}
              onChange={(e) =>
                setS((prev) => ({ ...prev, areas: e.target.value }))
              }
              placeholder="e.g. 77055, Spring Branch, Galleria"
            />
          </label>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <div className="text-lg font-semibold">Timeline + basics</div>

          <label className="block">
            <span className="text-sm text-gray-700">Move-in date</span>
            <input
              className="mt-1 w-full rounded-xl border p-3"
              type="date"
              value={s.moveInDate}
              onChange={(e) =>
                setS((prev) => ({ ...prev, moveInDate: e.target.value }))
              }
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Credit score range</span>
            <select
              className="mt-1 w-full rounded-xl border p-3"
              value={s.creditScoreBand ?? ""}
              onChange={(e) =>
                setS((prev) => ({
                  ...prev,
                  creditScoreBand: (e.target.value || undefined) as
                    | CreditBand
                    | undefined,
                }))
              }
            >
              <option value="">Select one</option>
              <option value="700+">700+</option>
              <option value="650-699">650–699</option>
              <option value="600-649">600–649</option>
              <option value="550-599">550–599</option>
              <option value="500-549">500–549</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Monthly income (USD)</span>
            <input
              className="mt-1 w-full rounded-xl border p-3"
              type="number"
              value={s.incomeMonthly}
              onChange={(e) =>
                setS((prev) => ({
                  ...prev,
                  incomeMonthly: e.target.value,
                }))
              }
              placeholder="e.g. 5200"
              min={0}
              inputMode="numeric"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Pets</span>
            <select
              className="mt-1 w-full rounded-xl border p-3"
              value={s.pets ?? "unknown"}
              onChange={(e) =>
                setS((prev) => ({
                  ...prev,
                  pets: e.target.value as PetsValue,
                }))
              }
            >
              <option value="unknown">Prefer not to say</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
              <option value="service_animal">Service animal</option>
            </select>
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border p-3 text-sm">
              <div className="font-medium">Eviction</div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  className={`flex-1 rounded-lg border px-2 py-1 ${
                    s.eviction === true ? "bg-gray-900 text-white" : ""
                  }`}
                  onClick={() => setS((prev) => ({ ...prev, eviction: true }))}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`flex-1 rounded-lg border px-2 py-1 ${
                    s.eviction === false ? "bg-gray-900 text-white" : ""
                  }`}
                  onClick={() => setS((prev) => ({ ...prev, eviction: false }))}
                >
                  No
                </button>
              </div>
            </div>

            <div className="rounded-xl border p-3 text-sm">
              <div className="font-medium">Broken lease</div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  className={`flex-1 rounded-lg border px-2 py-1 ${
                    s.brokenLease === true ? "bg-gray-900 text-white" : ""
                  }`}
                  onClick={() =>
                    setS((prev) => ({ ...prev, brokenLease: true }))
                  }
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`flex-1 rounded-lg border px-2 py-1 ${
                    s.brokenLease === false ? "bg-gray-900 text-white" : ""
                  }`}
                  onClick={() =>
                    setS((prev) => ({ ...prev, brokenLease: false }))
                  }
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-3">
          <div className="text-lg font-semibold">Final</div>

          <label className="block">
            <span className="text-sm text-gray-700">
              Short message (required)
            </span>
            <textarea
              className="mt-1 w-full rounded-xl border p-3"
              value={s.message}
              onChange={(e) =>
                setS((prev) => ({ ...prev, message: e.target.value }))
              }
              placeholder="Example: 2 bed, max $1600, needs W/D, work near Galleria..."
              rows={4}
            />
          </label>

          <label className="flex items-start gap-3 rounded-xl border p-3 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={s.screeningAck}
              onChange={(e) =>
                setS((prev) => ({ ...prev, screeningAck: e.target.checked }))
              }
            />
            <span className="text-gray-700">
              I understand approval depends on property screening criteria.
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-xl border p-3 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={s.contactConsent}
              onChange={(e) =>
                setS((prev) => ({ ...prev, contactConsent: e.target.checked }))
              }
            />
            <span className="text-gray-700">
              You may contact me by call/text/email.
            </span>
          </label>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50"
          onClick={() => setStep((v) => Math.max(1, v - 1))}
          disabled={step === 1 || busy}
        >
          Back
        </button>

        {step < 4 ? (
          <button
            type="button"
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
            onClick={() => {
              track("lead_step_next", { leadType, step });
              setStep((v) => Math.min(4, v + 1));
            }}
            disabled={!canNext || busy}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
            onClick={submit}
            disabled={!canNext || busy}
          >
            {busy ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
}