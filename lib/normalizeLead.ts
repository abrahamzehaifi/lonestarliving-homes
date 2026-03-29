import type { RentalFormInput, NormalizedRentalLead } from "./leadTypes";

function toNumber(value?: string): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function cleanString(value?: string): string | null {
  if (!value) return null;
  const v = value.trim();
  return v.length ? v : null;
}

function normalizePhone(phone?: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 ? digits : null;
}

function bandToNumber(
  band?: RentalFormInput["creditScoreBand"]
): number | null {
  if (!band) return null;

  if (band === "700+") return 720;

  if (!band.includes("-")) return null;

  const [loRaw, hiRaw] = band.split("-");
  const lo = Number(loRaw);
  const hi = Number(hiRaw);

  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return null;
  return Math.round((lo + hi) / 2);
}

export function normalizeRentalLead(
  input: RentalFormInput
): NormalizedRentalLead {
  return {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: normalizePhone(input.phone),

    budget: toNumber(input.budget),
    areas: cleanString(input.areas),
    moveInDate: cleanString(input.moveInDate),
    creditScoreBand: input.creditScoreBand,
    creditScore: bandToNumber(input.creditScoreBand),
    incomeMonthly: toNumber(input.incomeMonthly),

    eviction:
      typeof input.eviction === "boolean" ? input.eviction : null,
    brokenLease:
      typeof input.brokenLease === "boolean" ? input.brokenLease : null,

    pets: input.pets ?? "unknown",

    message: cleanString(input.message),

    screeningAck: input.screeningAck,
    contactConsent: input.contactConsent,
  };
}