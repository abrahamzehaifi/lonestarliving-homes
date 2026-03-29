import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Search Houston Homes | Abraham Zehaifi",
  description:
    "Search Houston homes and rentals with guidance from Abraham Zehaifi, brokered by 5th Stream Realty LLC.",
};

type Language = "en" | "es" | "ar";

type SearchPageProps = {
  searchParams?: {
    lang?: string;
  };
};

function getLanguage(value?: string): Language {
  if (value === "es" || value === "ar") return value;
  return "en";
}

const copy = {
  en: {
    title: "Search Houston Homes",
    body:
      "Online search tools are being expanded. For now, request a curated list and I’ll send options based on your price range, area, and goals.",
    legal:
      "Real estate services are provided by Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
    primaryCta: "Request a Curated List",
    secondaryCta: "Back to Home",
  },
  es: {
    title: "Buscar viviendas en Houston",
    body:
      "Las herramientas de búsqueda en línea se están ampliando. Por ahora, solicite una lista seleccionada y enviaré opciones según su rango de precio, zona y objetivos.",
    legal:
      "Los servicios inmobiliarios son proporcionados por Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
    primaryCta: "Solicitar una lista seleccionada",
    secondaryCta: "Volver al inicio",
  },
  ar: {
    title: "ابحث عن منازل في هيوستن",
    body:
      "يتم توسيع أدوات البحث عبر الإنترنت. في الوقت الحالي، اطلب قائمة مختارة وسأرسل لك خيارات بناءً على نطاق السعر والمنطقة والأهداف.",
    legal:
      "تُقدَّم الخدمات العقارية من قبل Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
    primaryCta: "اطلب قائمة مختارة",
    secondaryCta: "العودة إلى الرئيسية",
  },
} as const;

export default function SearchPage({ searchParams }: SearchPageProps) {
  const lang = getLanguage(searchParams?.lang);
  const t = copy[lang];
  const isArabic = lang === "ar";

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          {t.title}
        </h1>

        <p className="mt-3 text-slate-600">{t.body}</p>

        <p className="mt-4 text-sm text-slate-500">{t.legal}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={`/intake?type=buy&lang=${lang}`}
            className="rounded-xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:opacity-90"
          >
            {t.primaryCta}
          </Link>

          <Link
            href={`/?lang=${lang}`}
            className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-900 transition hover:bg-slate-50"
          >
            {t.secondaryCta}
          </Link>
        </div>
      </div>
    </main>
  );
}