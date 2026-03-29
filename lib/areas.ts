export const AREA_GUIDES = {
  "spring-branch": {
    slug: "spring-branch",
    name: "Spring Branch",
    headline: "Strong value and central access",
    summary:
      "Spring Branch offers a mix of older homes, newer townhomes, and growing rental inventory with strong access to central Houston and the Energy Corridor.",
    bullets: [
      "Good value relative to inner-loop pricing",
      "Mix of single-family and townhome developments",
      "Convenient access to I-10 and 610",
      "Popular for renters upgrading space",
    ],
    intent: "rent",
    cta: "View available homes in Spring Branch",
    defaultFilters: {
      area: "spring-branch",
    },
    crm: {
      sourceDetail: "area_spring_branch",
      segment: "general",
      autoResponse:
        "I’ll send you current Spring Branch options that fit your budget and timeline.",
    },
    seo: {
      title: "Spring Branch Houston Homes, Rentals, and Neighborhood Guide",
      description:
        "Explore Spring Branch homes, rentals, and neighborhood insights with quick access to central Houston and the Energy Corridor.",
    },
  },

  "river-oaks-upper-kirby": {
    slug: "river-oaks-upper-kirby",
    name: "River Oaks & Upper Kirby",
    headline: "Premium central Houston living",
    summary:
      "River Oaks and Upper Kirby offer luxury apartments, townhomes, and estates with high-end dining, shopping, and proximity to major employment centers.",
    bullets: [
      "Luxury apartments and high-end homes",
      "Walkable dining and retail pockets",
      "Close to Downtown, Galleria, and Medical Center",
      "Strong fit for executives and professionals",
    ],
    intent: "buy",
    cta: "Explore River Oaks and Upper Kirby opportunities",
    defaultFilters: {
      area: "river-oaks-upper-kirby",
    },
    crm: {
      sourceDetail: "area_river_oaks_upper_kirby",
      segment: "general",
      autoResponse:
        "I’ll send you River Oaks and Upper Kirby options that match your price range and goals.",
    },
    seo: {
      title: "River Oaks and Upper Kirby Houston Homes and Luxury Living Guide",
      description:
        "Explore River Oaks and Upper Kirby homes, luxury rentals, and neighborhood insights near central Houston’s top dining and business districts.",
    },
  },

  "memorial-energy-corridor": {
    slug: "memorial-energy-corridor",
    name: "Memorial & Energy Corridor",
    headline: "Established west Houston living",
    summary:
      "Memorial and the Energy Corridor offer larger homes, quiet neighborhoods, and proximity to major employers along I-10.",
    bullets: [
      "Strong option for families and professionals",
      "Easy access to Energy Corridor employers",
      "More residential and quiet than inner loop",
      "Mix of apartments and single-family homes",
    ],
    intent: "buy",
    cta: "See Memorial and Energy Corridor listings",
    defaultFilters: {
      area: "memorial-energy-corridor",
    },
    crm: {
      sourceDetail: "area_memorial_energy_corridor",
      segment: "general",
      autoResponse:
        "I’ll send you Memorial and Energy Corridor options that fit your budget, timeline, and space needs.",
    },
    seo: {
      title: "Memorial and Energy Corridor Houston Homes and Neighborhood Guide",
      description:
        "Explore Memorial and Energy Corridor homes, rentals, and neighborhood insights with access to west Houston employers and established communities.",
    },
  },

  "downtown-midtown-montrose-river-oaks-adjacent": {
    slug: "downtown-midtown-montrose-river-oaks-adjacent",
    name: "Downtown, Midtown & Montrose",
    headline: "Urban Houston lifestyle",
    summary:
      "These central neighborhoods offer high-density living, nightlife, dining, and walkability for clients who want to stay connected to the city.",
    bullets: [
      "Apartments and high-rise living",
      "Nightlife and dining hubs",
      "Close to major job centers",
      "Popular with young professionals",
    ],
    intent: "rent",
    cta: "Browse central Houston living options",
    defaultFilters: {
      area: "downtown-midtown-montrose-river-oaks-adjacent",
    },
    crm: {
      sourceDetail: "area_downtown_midtown_montrose",
      segment: "general",
      autoResponse:
        "I’ll send you central Houston options that match your budget, timeline, and preferred lifestyle.",
    },
    seo: {
      title: "Downtown, Midtown, and Montrose Houston Rentals and Living Guide",
      description:
        "Explore Downtown, Midtown, and Montrose homes, apartments, and neighborhood insights for central Houston living.",
    },
  },

  "baytown-east-houston-corridor": {
    slug: "baytown-east-houston-corridor",
    name: "Baytown & East Houston Corridor",
    headline: "Industrial corridor with value pricing",
    summary:
      "This corridor provides more affordable housing options with access to petrochemical and industrial employment hubs.",
    bullets: [
      "Lower entry price points",
      "Access to industrial employers",
      "More suburban layout",
      "Practical for budget-focused renters",
    ],
    intent: "rent",
    cta: "View Baytown and East Houston options",
    defaultFilters: {
      area: "baytown-east-houston-corridor",
    },
    crm: {
      sourceDetail: "area_baytown_east_houston",
      segment: "general",
      autoResponse:
        "I’ll send you Baytown and East Houston options that fit your price range and move timeline.",
    },
    seo: {
      title: "Baytown and East Houston Housing Guide for Homes and Rentals",
      description:
        "Explore Baytown and East Houston homes, rentals, and neighborhood insights with practical access to industrial employment centers.",
    },
  },
} as const;

export type AreaGuideKey = keyof typeof AREA_GUIDES;
export type AreaGuide = (typeof AREA_GUIDES)[AreaGuideKey];
export type AreaGuideIntent = AreaGuide["intent"];