// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SupportedLang = "en" | "es" | "ar";

export type LocalizedText = {
  en: string;
  es?: string;
  ar?: string;
};

export type LocalizedList = {
  en: string[];
  es?: string[];
  ar?: string[];
};

export type LocalizedFaqItem = {
  question: string;
  answer: string;
};

export type LocalizedFaqs = {
  en: LocalizedFaqItem[];
  es?: LocalizedFaqItem[];
  ar?: LocalizedFaqItem[];
};

export type HoustonAreaPage = {
  slug: string;
  title: LocalizedText;
  h1: LocalizedText;
  intro: LocalizedText;
  overview: LocalizedList;
  bestFor: LocalizedList;
  housing: LocalizedList;
  lifestyle: LocalizedList;
  pricingNote: LocalizedText;
  commute: LocalizedList;
  zipCodes: string[];
  metaTitle: LocalizedText;
  metaDescription: LocalizedText;
  seoFaqs: LocalizedFaqs;
};

// ---------------------------------------------------------------------------
// Data (CLEAN STRUCTURE)
// ---------------------------------------------------------------------------

export const houstonAreaPages: HoustonAreaPage[] = [
  {
    slug: "cypress",

    title: { en: "Cypress", es: "Cypress", ar: "سايبريس" },

    h1: {
      en: "Cypress neighborhood guidance",
      es: "Guía del vecindario de Cypress",
      ar: "دليل حي سايبريس",
    },

    intro: {
      en: "Cypress is a strong suburban Houston option for clients seeking more space and newer communities.",
      es: "Cypress es una opción suburbana sólida en Houston.",
      ar: "تُعد سايبريس خيارًا قويًا في ضواحي هيوستن.",
    },

    overview: {
      en: [
        "Master-planned communities and suburban neighborhoods",
        "Strong for space and livability",
        "Less central access than inner Houston",
      ],
    },

    bestFor: {
      en: [
        "Families seeking space",
        "Suburban lifestyle buyers",
        "Clients trading commute for value",
      ],
    },

    housing: {
      en: [
        "Single-family homes, townhomes, apartments",
        "Wide price range",
      ],
    },

    lifestyle: {
      en: [
        "Suburban and residential",
        "Less nightlife, more routine",
      ],
    },

    pricingNote: {
      en: "Strong value per square foot compared to central Houston.",
    },

    commute: {
      en: [
        "Best for northwest Houston access",
        "Longer commute to central areas",
      ],
    },

    zipCodes: ["77429", "77433"],

    metaTitle: {
      en: "Cypress Houston neighborhood guidance | Lonestar Living",
    },

    metaDescription: {
      en: "Explore Cypress Houston with structured housing and lifestyle guidance.",
    },

    seoFaqs: {
      en: [
        {
          question: "Is Cypress a good suburb in Houston?",
          answer:
            "Yes, Cypress is a strong suburban option for space and community living.",
        },
      ],
    },
  },

  {
    slug: "katy",

    title: { en: "Katy" },

    h1: {
      en: "Katy neighborhood guidance",
    },

    intro: {
      en: "Katy is one of Houston’s most established suburban markets.",
    },

    overview: {
      en: [
        "Large suburban footprint",
        "Strong housing supply",
        "Well-known area identity",
      ],
    },

    bestFor: {
      en: [
        "Families",
        "Suburban buyers",
        "Long-term homeowners",
      ],
    },

    housing: {
      en: [
        "Master-planned communities",
        "Single-family homes",
      ],
    },

    lifestyle: {
      en: [
        "Family-oriented",
        "Structured suburban living",
      ],
    },

    pricingNote: {
      en: "Balanced pricing with strong housing availability.",
    },

    commute: {
      en: [
        "West Houston access",
        "Commute varies by destination",
      ],
    },

    zipCodes: ["77449", "77450"],

    metaTitle: {
      en: "Katy Houston neighborhood guidance | Lonestar Living",
    },

    metaDescription: {
      en: "Explore Katy with structured suburban housing guidance.",
    },

    seoFaqs: {
      en: [
        {
          question: "Is Katy good for families?",
          answer:
            "Yes, Katy is widely considered a strong suburban option for families.",
        },
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Slug Helpers
// ---------------------------------------------------------------------------

function normalizeSlug(slug: unknown): string | null {
  if (typeof slug !== "string") return null;
  const s = slug.trim().toLowerCase();
  return s.length ? s : null;
}

export function getHoustonAreaBySlug(
  slug: unknown
): HoustonAreaPage | undefined {
  const normalized = normalizeSlug(slug);
  if (!normalized) return undefined;

  return houstonAreaPages.find((p) => p.slug === normalized);
}

export function getAllHoustonAreaSlugs(): string[] {
  return houstonAreaPages.map((p) => p.slug);
}

// ---------------------------------------------------------------------------
// Localization Helpers (NO BUGS)
// ---------------------------------------------------------------------------

export function pickLocalizedText(
  value: LocalizedText,
  lang: SupportedLang
): string {
  return value[lang] ?? value.en;
}

export function pickLocalizedList(
  value: LocalizedList,
  lang: SupportedLang
): string[] {
  return value[lang] ?? value.en;
}

export function pickLocalizedFaqs(
  value: LocalizedFaqs,
  lang: SupportedLang
): LocalizedFaqItem[] {
  return value[lang] ?? value.en;
}