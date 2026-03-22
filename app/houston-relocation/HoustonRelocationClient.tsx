"use client";

import Link from "next/link";

type Props = {
  lang: "en" | "es" | "ar";
};

const copy = {
  en: {
    eyebrow: "Houston relocation",
    title: "Relocating to Houston.",
    intro:
      "Houston is a large and diverse housing market. Choosing the right area depends on commute patterns, pricing, neighborhood style, and overall housing goals.",
    body1:
      "Different parts of Houston offer very different living experiences. Some areas prioritize shorter commutes to major employment centers, while others offer more space, newer construction, or quieter residential environments.",
    body2:
      "Comparing neighborhoods early can help reduce unnecessary touring and focus on the areas that best match your priorities.",
    ctaPrimary: "Explore options",
    ctaSecondary: "Browse Houston areas",

    areasTitle: "Popular Houston areas",
    areaLinks: [
      { href: "/houston/cypress", label: "Cypress" },
      { href: "/houston/katy", label: "Katy" },
      { href: "/houston/the-heights", label: "The Heights" },
      {
        href: "/houston/memorial-energy-corridor",
        label: "Memorial & Energy Corridor",
      },
      {
        href: "/houston/river-oaks-upper-kirby",
        label: "River Oaks & Upper Kirby",
      },
      {
        href: "/houston/downtown-midtown-montrose-river-oaks-adjacent",
        label: "Downtown, Midtown & Montrose",
      },
      {
        href: "/houston/spring-branch",
        label: "Spring Branch",
      },
      {
        href: "/houston/baytown-east-houston-corridor",
        label: "Baytown & East Houston Corridor",
      },
    ],

    languageLabel: "Language",
  },

  es: {
    eyebrow: "Reubicación en Houston",
    title: "Mudarse a Houston.",
    intro:
      "Houston es un mercado de vivienda grande y diverso. Elegir la zona adecuada depende del trayecto, precios, estilo de vecindario y objetivos de vivienda.",
    body1:
      "Las diferentes áreas de Houston ofrecen experiencias distintas. Algunas priorizan trayectos más cortos hacia centros de empleo, mientras que otras ofrecen más espacio o entornos residenciales más tranquilos.",
    body2:
      "Comparar vecindarios desde el inicio puede ayudar a reducir visitas innecesarias y enfocarse en las mejores opciones.",
    ctaPrimary: "Explorar opciones",
    ctaSecondary: "Ver zonas de Houston",

    areasTitle: "Zonas populares de Houston",
    areaLinks: [
      { href: "/houston/cypress", label: "Cypress" },
      { href: "/houston/katy", label: "Katy" },
      { href: "/houston/the-heights", label: "The Heights" },
      {
        href: "/houston/memorial-energy-corridor",
        label: "Memorial y Energy Corridor",
      },
      {
        href: "/houston/river-oaks-upper-kirby",
        label: "River Oaks y Upper Kirby",
      },
      {
        href: "/houston/downtown-midtown-montrose-river-oaks-adjacent",
        label: "Downtown, Midtown y Montrose",
      },
      {
        href: "/houston/spring-branch",
        label: "Spring Branch",
      },
      {
        href: "/houston/baytown-east-houston-corridor",
        label: "Baytown y este de Houston",
      },
    ],

    languageLabel: "Idioma",
  },

  ar: {
    eyebrow: "الانتقال إلى هيوستن",
    title: "الانتقال إلى هيوستن.",
    intro:
      "هيوستن سوق سكني كبير ومتنوع. اختيار المنطقة المناسبة يعتمد على موقع العمل، الأسعار، ونمط الحي.",
    body1:
      "تقدم مناطق هيوستن المختلفة أنماط حياة مختلفة. بعضها يوفر تنقلًا أقصر، والبعض الآخر يوفر مساحات أكبر أو بيئة أكثر هدوءًا.",
    body2:
      "مقارنة الأحياء مبكرًا تساعد على تقليل الجهد والتركيز على الخيارات المناسبة.",
    ctaPrimary: "استكشف الخيارات",
    ctaSecondary: "استعرض مناطق هيوستن",

    areasTitle: "مناطق شائعة في هيوستن",
    areaLinks: [
      { href: "/houston/cypress", label: "سايبريس" },
      { href: "/houston/katy", label: "كاتي" },
      { href: "/houston/the-heights", label: "ذا هايتس" },
      {
        href: "/houston/memorial-energy-corridor",
        label: "مموريال وإنرجي كوريدور",
      },
      {
        href: "/houston/river-oaks-upper-kirby",
        label: "ريفر أوكس وأبر كيربي",
      },
      {
        href: "/houston/downtown-midtown-montrose-river-oaks-adjacent",
        label: "داونتاون وميدتاون",
      },
      {
        href: "/houston/spring-branch",
        label: "سبرينغ برانش",
      },
      {
        href: "/houston/baytown-east-houston-corridor",
        label: "بايتاون وشرق هيوستن",
      },
    ],

    languageLabel: "اللغة",
  },
} as const;

export default function HoustonRelocationClient({ lang }: Props) {
  const t = copy[lang];

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-neutral-950">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
          {t.eyebrow}
        </p>

        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
          {t.title}
        </h1>

        <p className="mt-6 max-w-3xl text-neutral-600">
          {t.intro}
        </p>

        <p className="mt-4 max-w-3xl text-neutral-600">
          {t.body1}
        </p>

        <p className="mt-4 max-w-3xl text-neutral-600">
          {t.body2}
        </p>

        <div className="mt-10 flex gap-3">
          <Link
            href={`/intake?service=tenant&src=relocation&lang=${lang}`}
            className="rounded-full bg-black px-5 py-3 text-sm text-white"
          >
            {t.ctaPrimary}
          </Link>

          <Link
            href={`/houston?lang=${lang}`}
            className="rounded-full border px-5 py-3 text-sm"
          >
            {t.ctaSecondary}
          </Link>
        </div>

        <p className="mt-6 text-sm text-neutral-500">
          {t.languageLabel}: {lang}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {t.areaLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border bg-white p-4 text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}