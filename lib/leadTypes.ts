// lib/leadTypes.ts

export type LeadType = "rent" | "buy" | "sell" | "landlord" | "other";

export type CreditScoreBand =
  | "500-549"
  | "550-599"
  | "600-649"
  | "650-699"
  | "700+";

export type PetsStatus = "yes" | "no" | "service_animal" | "unknown";

/**
 * Raw form state from UI inputs.
 * All numeric values remain strings until normalized.
 */
export type RentalFormInput = {
  name: string;
  email: string;
  phone: string;

  budget: string;
  areas: string;
  moveInDate: string;
  creditScoreBand?: CreditScoreBand;
  incomeMonthly: string;

  eviction?: boolean;
  brokenLease?: boolean;

  pets?: PetsStatus;

  message: string;

  screeningAck: boolean;
  contactConsent: boolean;
};