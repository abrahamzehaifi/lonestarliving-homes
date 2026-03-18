"use client";

import Link from "next/link";

type Props = {
  lang: "en" | "es" | "ar";
};

const copy = {
  en: {
    eyebrow: "Houston relocation guidance",
    title: "Relocating to Houston with a more organized plan.",
    intro:
      "Houston is a large, highly segmented market. The right relocation strategy depends on commute pattern, housing goals, budget, school priorities, and the type of neighborhood that fits your household best.",
    body1:
      "We help clients narrow Houston intelligently instead of wasting time across disconnected listings and mismatched areas. That includes rental guidance, neighborhood comparisons, relocation planning, and next-step recommendations based on your actual criteria.",
    body2:
      "Whether you are moving for work, family, school, or a change in housing needs, the goal is not just finding a property. The goal is selecting the right Houston area, the right inventory, and the right sequence of decisions.",
    ctaPrimary: "Request relocation guidance",
    ctaSecondary: "Explore Houston neighborhoods",
    fitTitle: "This page is best for",
    fitItems: [
      "Clients moving to Houston for work or family reasons",
      "Renters comparing neighborhoods before touring",
      "Buyers who need area guidance before starting a search",
      "Relocating households balancing commute, budget, and lifestyle",
    ],
    processTitle: "How we help",
    processItems: [
      "Clarify budget, timeline, commute, and housing priorities",
      "Narrow the strongest Houston submarkets for your situation",
      "Identify realistic rental or purchase options",
      "Move from broad searching to focused execution",
    ],
    areasTitle: "Popular Houston area pages",
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
    eyebrow: "Guía de reubicación en Houston",
    title: "Mudarse a Houston con un plan más organizado.",
    intro:
      "Houston es un mercado grande y muy segmentado. La estrategia correcta depende del trayecto diario, metas de vivienda, presupuesto, prioridades escolares y el tipo de vecindario que mejor se ajuste a su hogar.",
    body1:
      "Ayudamos a los clientes a reducir Houston de forma inteligente en lugar de perder tiempo entre listados desconectados y zonas que no encajan. Esto incluye orientación para renta, comparación de vecindarios, planificación de reubicación y recomendaciones basadas en sus criterios reales.",
    body2:
      "Ya sea que se mude por trabajo, familia, estudios o un cambio en sus necesidades de vivienda, la meta no es solo encontrar una propiedad. La meta es elegir la zona correcta de Houston, el inventario correcto y la secuencia correcta de decisiones.",
    ctaPrimary: "Solicitar orientación de reubicación",
    ctaSecondary: "Explorar vecindarios de Houston",
    fitTitle: "Esta página es ideal para",
    fitItems: [
      "Clientes que se mudan a Houston por trabajo o familia",
      "Inquilinos comparando vecindarios antes de visitar propiedades",
      "Compradores que necesitan orientación por zona antes de empezar",
      "Hogares que equilibran trayecto, presupuesto y estilo de vida",
    ],
    processTitle: "Cómo ayudamos",
    processItems: [
      "Definir presupuesto, tiempo, trayecto y prioridades",
      "Reducir las mejores zonas de Houston para su situación",
      "Identificar opciones realistas para renta o compra",
      "Pasar de una búsqueda amplia a una ejecución enfocada",
    ],
    areasTitle: "Páginas populares de zonas en Houston",
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
        label: "Baytown y corredor este de Houston",
      },
    ],
    languageLabel: "Idioma",
  },
  ar: {
    eyebrow: "إرشاد الانتقال إلى هيوستن",
    title: "الانتقال إلى هيوستن بخطة أكثر تنظيمًا.",
    intro:
      "هيوستن سوق كبير ومتنوع للغاية. الاستراتيجية المناسبة تعتمد على موقع العمل، هدف السكن، الميزانية، أولوية المدارس، ونوع الحي الذي يناسب الأسرة.",
    body1:
      "نساعد العملاء على تضييق الخيارات في هيوستن بشكل ذكي بدلًا من إضاعة الوقت بين قوائم غير مترابطة ومناطق لا تناسب احتياجاتهم. يشمل ذلك إرشاد الإيجار، مقارنة الأحياء، تخطيط الانتقال، وتوصيات عملية بناءً على معاييركم الفعلية.",
    body2:
      "سواء كان الانتقال من أجل العمل أو الأسرة أو الدراسة أو تغيير احتياج السكن، فالهدف ليس فقط العثور على عقار. الهدف هو اختيار المنطقة المناسبة في هيوستن، والمخزون المناسب، وتسلسل القرار المناسب.",
    ctaPrimary: "طلب إرشاد الانتقال",
    ctaSecondary: "استكشاف أحياء هيوستن",
    fitTitle: "هذه الصفحة مناسبة لـ",
    fitItems: [
      "العملاء المنتقلين إلى هيوستن للعمل أو لأسباب عائلية",
      "المستأجرين الذين يقارنون الأحياء قبل الزيارات",
      "المشترين الذين يحتاجون إلى توجيه حسب المنطقة قبل البدء",
      "الأسر التي توازن بين التنقل والميزانية ونمط الحياة",
    ],
    processTitle: "كيف نساعد",
    processItems: [
      "توضيح الميزانية والجدول الزمني والتنقل وأولويات السكن",
      "تحديد أفضل مناطق هيوستن المناسبة لوضعكم",
      "تحديد خيارات واقعية للإيجار أو الشراء",
      "الانتقال من البحث العام إلى التنفيذ المركز",
    ],
    areasTitle: "صفحات مناطق شائعة في هيوستن",
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
        label: "داونتاون وميدتاون ومونتروز",
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
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          {t.eyebrow}
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
          {t.title}
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-600">
          {t.intro}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/request-guidance"
            className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            {t.ctaPrimary}
          </Link>

          <Link
            href="/houston"
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:border-black/20"
          >
            {t.ctaSecondary}
          </Link>
        </div>

        <p className="mt-6 text-sm text-neutral-500">
          {t.languageLabel}: {lang}
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 md:grid-cols-2">
        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6">
          <h2 className="text-xl font-semibold tracking-tight">
            {t.fitTitle}
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-neutral-600">
            <p>{t.body1}</p>
            <p>{t.body2}</p>
          </div>

          <ul className="mt-5 space-y-3 text-sm leading-7 text-neutral-600">
            {t.fitItems.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6">
          <h2 className="text-xl font-semibold tracking-tight">
            {t.processTitle}
          </h2>

          <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-600">
            {t.processItems.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 md:p-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t.areasTitle}
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {t.areaLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-black/5 bg-neutral-50 p-4 text-sm font-medium text-neutral-900 transition hover:border-black/10 hover:bg-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}