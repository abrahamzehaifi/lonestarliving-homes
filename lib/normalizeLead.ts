import { RentalFormInput, NormalizedRentalLead } from "./leadTypes";

export function normalizeRentalLead(input: RentalFormInput): NormalizedRentalLead {
  return {
    leadType: "rent",

    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || undefined,

    budget: input.budget ? Number(input.budget) : undefined,
    areas: input.areas
      ? input.areas.split(",").map((a) => a.trim())
      : undefined,

    moveInDate: input.moveInDate || undefined,

    creditScoreBand: input.creditScoreBand,

    incomeMonthly: input.incomeMonthly
      ? Number(input.incomeMonthly)
      : undefined,

    eviction: input.eviction ?? false,
    brokenLease: input.brokenLease ?? false,

    pets: input.pets,

    message: input.message.trim(),

    screeningAck: input.screeningAck,
    contactConsent: input.contactConsent,
  };
}