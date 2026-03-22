import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apartments Near Texas Medical Center Houston | Housing Guide",
  description:
    "Find apartments and housing near Texas Medical Center in Houston. Compare nearby areas, commute times, and rental options near major hospitals and medical employers.",
};

type Language = "en" | "es" | "ar";

type MedicalCenterHousingPageProps = {
  searchParams?: Promise<{
    lang?: string;
  }>;
};

function getLanguage(value?: string): Language {
  if (value === "es" || value === "ar") return value;
  return "en";
}

const copy = {
  en: {
    eyebrow: "Houston housing",
    title: "Housing near the Texas Medical Center in Houston.",
    body:
      "Housing near the Texas Medical Center is a common priority for renters who want better access to hospitals, clinics, research facilities, and major healthcare employers. Rental options can vary widely by neighborhood, commute pattern, pricing, and building style.",
    bodyTwo:
      "Apartments near Texas Medical Center, Houston Methodist, MD Anderson, Baylor College of Medicine, and nearby hospitals may offer different tradeoffs depending on budget, timing, and preferred living environment. Comparing nearby Houston areas can help narrow the strongest options more efficiently.",
    primaryCta: "Explore options",
    secondaryCta: "Contact",

    cards: [
      {
        title: "Access and commute",
        description:
          "Commute time to hospitals, clinics, and medical employers can vary significantly depending on traffic patterns and neighborhood location.",
      },
      {
        title: "Housing mix",
        description:
          "Options may include apartments, townhomes, and nearby residential neighborhoods depending on budget, availability, and preferred building style.",
      },
      {
        title: "Area selection",
        description:
          "Choosing the right nearby area often depends on commute tolerance, lifestyle preferences, and overall pricing.",
      },
    ],

    areaTitle: "Nearby Houston areas to compare",
    areaLinks: [
      { href: "/houston/west-university-rice-museum-district", label: "West University, Rice & Museum District" },
      { href: "/houston/downtown-midtown-montrose-river-oaks-adjacent", label: "Downtown, Midtown & Montrose" },
      { href: "/houston/the-heights", label: "The Heights" },
      { href: "/houston/galleria-tanglewood", label: "Galleria & Tanglewood" },
      { href: "/houston/spring-branch", label: "Spring Branch" },
      { href: "/houston/bellaire", label: "Bellaire" },
    ],

    legal:
      "Brokered by 5th Stream Realty LLC. Representation services are provided in accordance with Texas law and applicable written agreements.",
  },

  es: {
    eyebrow: "Vivienda en Houston",
    title: "Vivienda cerca del Texas Medical Center en Houston.",
    body:
      "La vivienda cerca del Texas Medical Center es una prioridad común para inquilinos que desean mejor acceso a hospitales, clínicas, centros de investigación y grandes empleadores del sector salud. Las opciones de renta pueden variar mucho según el vecindario, el trayecto, el nivel de precios y el tipo de edificio.",
    bodyTwo:
      "Los apartamentos cerca del Texas Medical Center, Houston Methodist, MD Anderson, Baylor College of Medicine y hospitales cercanos pueden ofrecer diferentes ventajas según presupuesto, tiempo y estilo de vida preferido. Comparar zonas cercanas de Houston puede ayudar a reducir las opciones más fuertes con mayor claridad.",
    primaryCta: "Explorar opciones",
    secondaryCta: "Contacto",

    cards: [
      {
        title: "Acceso y trayecto",
        description:
          "El tiempo de trayecto hacia hospitales, clínicas y empleadores médicos puede variar bastante según el tráfico y la ubicación del vecindario.",
      },
      {
        title: "Tipos de vivienda",
        description:
          "Las opciones pueden incluir apartamentos, townhomes y vecindarios residenciales cercanos según presupuesto, disponibilidad y estilo de edificio preferido.",
      },
      {
        title: "Selección de zona",
        description:
          "Elegir la zona adecuada suele depender de la tolerancia al trayecto, preferencias de estilo de vida y nivel general de precios.",
      },
    ],

    areaTitle: "Zonas cercanas de Houston para comparar",
    areaLinks: [
      { href: "/houston/west-university-rice-museum-district", label: "West University, Rice y Museum District" },
      { href: "/houston/downtown-midtown-montrose-river-oaks-adjacent", label: "Downtown, Midtown y Montrose" },
      { href: "/houston/the-heights", label: "The Heights" },
      { href: "/houston/galleria-tanglewood", label: "Galleria y Tanglewood" },
      { href: "/houston/spring-branch", label: "Spring Branch" },
      { href: "/houston/bellaire", label: "Bellaire" },
    ],

    legal:
      "Intermediado por 5th Stream Realty LLC. Los servicios de representación se prestan conforme a la ley de Texas y los acuerdos escritos aplicables.",
  },

  ar: {
    eyebrow: "سكن في هيوستن",
    title: "السكن بالقرب من Texas Medical Center في هيوستن.",
    body:
      "السكن بالقرب من Texas Medical Center يُعد من الأولويات الشائعة للمستأجرين الذين يريدون وصولًا أفضل إلى المستشفيات والعيادات ومراكز الأبحاث وجهات العمل الطبية الكبرى. تختلف خيارات الإيجار بشكل كبير حسب الحي وطبيعة التنقل ومستوى الأسعار ونوع المبنى.",
    bodyTwo:
      "قد توفر الشقق القريبة من Texas Medical Center وHouston Methodist وMD Anderson وBaylor College of Medicine والمستشفيات المجاورة مزايا مختلفة حسب الميزانية والتوقيت ونمط السكن المفضل. مقارنة المناطق القريبة في هيوستن تساعد على تضييق الخيارات الأقوى بشكل أوضح.",
    primaryCta: "استكشف الخيارات",
    secondaryCta: "تواصل",

    cards: [
      {
        title: "الوصول والتنقل",
        description:
          "مدة التنقل إلى المستشفيات والعيادات وجهات العمل الطبية قد تختلف بشكل واضح حسب الحي وحركة المرور.",
      },
      {
        title: "أنواع السكن",
        description:
          "قد تشمل الخيارات شققًا وتاون هاوس وأحياء سكنية قريبة حسب الميزانية والتوفر ونمط المبنى المفضل.",
      },
      {
        title: "اختيار المنطقة",
        description:
          "اختيار المنطقة المناسبة يعتمد غالبًا على تحمل التنقل وتفضيلات نمط الحياة ومستوى الأسعار العام.",
      },
    ],

    areaTitle: "مناطق قريبة في هيوستن للمقارنة",
    areaLinks: [
      { href: "/houston/west-university-rice-museum-district", label: "وست يونيفرسيتي ورايس وميوزيوم ديستركت" },
      { href: "/houston/downtown-midtown-montrose-river-oaks-adjacent", label: "داونتاون وميدتاون ومونتروز" },
      { href: "/houston/the-heights", label: "ذا هايتس" },
      { href: "/houston/galleria-tanglewood", label: "غاليريا وتانلوود" },
      { href: "/houston/spring-branch", label: "سبرينغ برانش" },
      { href: "/houston/bellaire", label: "بيلير" },
    ],

    legal:
      "يتم التوسط من خلال 5th Stream Realty LLC. تُقدَّم خدمات التمثيل وفقًا لقانون تكساس والاتفاقيات الكتابية المعمول بها.",
  },
} as const;

function DetailCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-5">
      <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-neutral-600">{description}</p>
    </div>
  );
}

export default async function MedicalCenterHousingPage({
  searchParams,
}: MedicalCenterHousingPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const lang = getLanguage(resolvedSearchParams.lang);
  const t = copy[lang];
  const isArabic = lang === "ar";

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f5f5f3] text-neutral-950"
    >
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          {t.eyebrow}
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          {t.title}
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-600">
          {t.body}
        </p>

        <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-600">
          {t.bodyTwo}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={`/intake?service=tenant&area=medical-center&src=tmc-seo&lang=${lang}`}
            className="inline-flex h-12 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            {t.primaryCta}
          </Link>

          <Link
            href={`/contact?lang=${lang}`}
            className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 px-6 text-sm font-medium text-neutral-900 transition hover:bg-white"
          >
            {t.secondaryCta}
          </Link>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {t.cards.map((card) => (
            <DetailCard
              key={card.title}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>

        <div className="mt-14 rounded-[1.75rem] border border-black/5 bg-white p-6 md:p-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t.areaTitle}
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {t.areaLinks.map((item) => (
              <Link
                key={item.href}
                href={`${item.href}?lang=${lang}`}
                className="rounded-2xl border border-black/5 bg-neutral-50 p-4 text-sm font-medium text-neutral-900 transition hover:border-black/10 hover:bg-white"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <p className="mt-8 text-sm leading-7 text-neutral-600">{t.legal}</p>
        </div>
      </section>
    </main>
  );
}