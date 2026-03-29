import Link from "next/link";
import { getPreferredSiteLang } from "@/lib/i18n/getLangServer";

type Language = "en" | "es" | "ar";

type BuyPageProps = {
  searchParams?: Promise<{
    lang?: string;
  }>;
};

const copy = {
  en: {
    eyebrow: "Buy",
    title: "Buy a home in Houston with clarity and strategy.",
    bodyOne:
      "Buying a home should be handled with clear guidance from the start. The goal is not simply to tour properties. The goal is to identify the right fit, understand the market, structure the offer thoughtfully, and protect your position throughout the transaction.",
    bodyTwo:
      "That includes search planning, private showings, market guidance, contract support, negotiation, option period coordination, and a clear path from contract to closing.",
    primaryCta: "Begin Buyer Intake",
    secondaryCta: "Ask a Question",
    legal:
      "Buyer representation is provided by Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },
  es: {
    eyebrow: "Comprar",
    title: "Compre una vivienda en Houston con claridad y estrategia.",
    bodyOne:
      "La compra de una vivienda debe manejarse con una orientación clara desde el principio. El objetivo no es simplemente visitar propiedades. El objetivo es identificar la opción correcta, entender el mercado, estructurar la oferta con criterio y proteger su posición durante toda la transacción.",
    bodyTwo:
      "Eso incluye planificación de búsqueda, visitas privadas, orientación de mercado, apoyo contractual, negociación, coordinación del período de opción y un camino claro desde el contrato hasta el cierre.",
    primaryCta: "Comenzar solicitud de comprador",
    secondaryCta: "Hacer una pregunta",
    legal:
      "La representación del comprador es proporcionada por Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },
  ar: {
    eyebrow: "شراء",
    title: "اشترِ منزلاً في هيوستن بوضوح واستراتيجية.",
    bodyOne:
      "يجب أن تتم عملية شراء المنزل بإرشاد واضح من البداية. الهدف ليس مجرد مشاهدة العقارات، بل تحديد الخيار المناسب، وفهم السوق، وصياغة العرض بعناية، وحماية موقفك طوال الصفقة.",
    bodyTwo:
      "ويشمل ذلك تخطيط البحث، والجولات الخاصة، والإرشاد السوقي، والدعم التعاقدي، والتفاوض، وتنسيق فترة الخيار، ومسارًا واضحًا من العقد إلى الإغلاق.",
    primaryCta: "ابدأ طلب المشتري",
    secondaryCta: "اطرح سؤالاً",
    legal:
      "يتم تقديم تمثيل المشتري من قبل Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },
} as const;

export default async function BuyPage({ searchParams }: BuyPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const lang: Language = await getPreferredSiteLang(resolvedSearchParams.lang);
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
          href={`/intake?type=buy&lang=${lang}`}
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