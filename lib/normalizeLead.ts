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

function cleanRequiredString(value?: string): string {
  return cleanString(value) ?? "";
}

function normalizePhone(phone?: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 ? digits : null;
}

export function normalizeRentalLead(
  input: RentalFormInput
): NormalizedRentalLead {
  return {
    name: cleanRequiredString(input.name),
    email: cleanRequiredString(input.email).toLowerCase(),
    phone: normalizePhone(input.phone),

    budget: toNumber(input.budget),
    areas: cleanRequiredString(input.areas),
    moveInDate: cleanString(input.moveInDate),
    creditScoreBand: input.creditScoreBand,
    incomeMonthly: toNumber(input.incomeMonthly),

    eviction:
      typeof input.eviction === "boolean" ? input.eviction : null,
    brokenLease:
      typeof input.brokenLease === "boolean" ? input.brokenLease : null,

    pets: input.pets ?? "unknown",

    message: cleanRequiredString(input.message),

    screeningAck: input.screeningAck,
    contactConsent: input.contactConsent,
  };
}