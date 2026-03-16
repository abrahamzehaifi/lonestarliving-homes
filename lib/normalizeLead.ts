// lib/normalizeLead.ts

import type { RentalFormInput, NormalizedRentalLead } from "./leadTypes";

function bandToNumber(
  band?: RentalFormInput["creditScoreBand"]
): number | null {
  if (!band) return null;
  if (band === "700+") return 720;

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
    email: input.email.trim(),
    phone: input.phone?.trim() || null,

    budget: input.budget ? Number(input.budget) : null,
    areas: input.areas.trim(),
    moveInDate: input.moveInDate?.trim() || null,
    creditScoreBand: input.creditScoreBand,
    creditScore: bandToNumber(input.creditScoreBand),
    incomeMonthly: input.incomeMonthly ? Number(input.incomeMonthly) : null,

    eviction:
      typeof input.eviction === "boolean" ? input.eviction : null,
    brokenLease:
      typeof input.brokenLease === "boolean" ? input.brokenLease : null,

    pets: input.pets ?? "unknown",

    message: input.message.trim(),

    screeningAck: input.screeningAck,
    contactConsent: input.contactConsent,
  };
}