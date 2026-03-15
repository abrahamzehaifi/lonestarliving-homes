import Link from "next/link";

type Language = "en" | "es" | "ar";

type BuyPageProps = {
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
    eyebrow: "Buy",
    title: "Buy a home in Houston with strategy, not guesswork.",
    bodyOne:
      "Buyer representation should be disciplined. The objective is not simply to open doors. The objective is to identify the right property, evaluate the opportunity realistically, structure the offer intelligently, and protect your position throughout the transaction.",
    bodyTwo:
      "That includes search strategy, private showings, market analysis, contract guidance, negotiation, option period coordination, and a clear path from contract to closing.",
    primaryCta: "Begin Buyer Intake",
    secondaryCta: "Ask a Question",
    legal:
      "Buyer representation is provided by Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },
  es: {
    eyebrow: "Comprar",
    title: "Compre una vivienda en Houston con estrategia, no con suposiciones.",
    bodyOne:
      "La representación del comprador debe ser disciplinada. El objetivo no es simplemente abrir puertas. El objetivo es identificar la propiedad correcta, evaluar la oportunidad con realismo, estructurar la oferta con inteligencia y proteger su posición durante toda la transacción.",
    bodyTwo:
      "Eso incluye estrategia de búsqueda, visitas privadas, análisis de mercado, orientación contractual, negociación, coordinación del período de opción y un camino claro desde el contrato hasta el cierre.",
    primaryCta: "Comenzar solicitud de comprador",
    secondaryCta: "Hacer una pregunta",
    legal:
      "La representación del comprador es proporcionada por Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },
  ar: {
    eyebrow: "شراء",
    title: "اشترِ منزلاً في هيوستن باستراتيجية لا بالتخمين.",
    bodyOne:
      "يجب أن يكون تمثيل المشتري منضبطًا. الهدف ليس مجرد فتح الأبواب. الهدف هو تحديد العقار المناسب، وتقييم الفرصة بشكل واقعي، وصياغة العرض بذكاء، وحماية موقفك طوال الصفقة.",
    bodyTwo:
      "ويشمل ذلك استراتيجية البحث، والجولات الخاصة، وتحليل السوق، والإرشاد التعاقدي، والتفاوض، وتنسيق فترة الخيار، ومسارًا واضحًا من العقد إلى الإغلاق.",
    primaryCta: "ابدأ طلب المشتري",
    secondaryCta: "اطرح سؤالاً",
    legal:
      "يتم تقديم تمثيل المشتري من قبل Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },
} as const;

export default async function BuyPage({ searchParams }: BuyPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const lang = getLanguage(resolvedSearchParams.lang);
  const t = copy[lang];
  const isArabic = lang === "ar";

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="mx-auto max-w-5xl px-6 py-20"
    >
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
        {t.eyebrow}
      </p>

      <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
        {t.title}
      </h1>

      <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-600">
        {t.bodyOne}
      </p>

      <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-600">
        {t.bodyTwo}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/intake?type=buyer&segment=general&lang=${lang}`}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          {t.primaryCta}
        </Link>

        <Link
          href={`/contact?lang=${lang}`}
          className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-black/20 hover:bg-neutral-50"
        >
          {t.secondaryCta}
        </Link>
      </div>

      <p className="mt-6 text-sm text-neutral-500">{t.legal}</p>
    </section>
  );
}