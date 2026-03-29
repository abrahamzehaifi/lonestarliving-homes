import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Houston Area Not Found | LonestarLiving",
  description:
    "Explore Houston neighborhoods or request curated housing options based on your criteria.",
};

type HoustonAreaNotFoundProps = {
  searchParams?: {
    lang?: string;
  };
};

function getLanguage(value?: string): "en" | "es" | "ar" {
  if (value === "es" || value === "ar") return value;
  return "en";
}

const copy = {
  en: {
    eyebrow: "Houston neighborhood guidance",
    title: "Area page not found.",
    body:
      "The page you requested is not available. You can explore Houston area guidance or begin an intake to receive options aligned with your criteria.",
    primaryCta: "Explore Houston area pages",
    secondaryCta: "Begin intake",
    tertiaryCta: "Ask a question",
  },
  es: {
    eyebrow: "Guía de vecindarios en Houston",
    title: "La página del área no fue encontrada.",
    body:
      "La página que solicitó no está disponible. Puede explorar la guía de zonas de Houston o comenzar una solicitud para recibir opciones alineadas con sus criterios.",
    primaryCta: "Explorar zonas de Houston",
    secondaryCta: "Comenzar solicitud",
    tertiaryCta: "Hacer una pregunta",
  },
  ar: {
    eyebrow: "إرشاد أحياء هيوستن",
    title: "صفحة المنطقة غير موجودة.",
    body:
      "الصفحة التي طلبتها غير متاحة. يمكنك استكشاف إرشاد مناطق هيوستن أو بدء طلب للحصول على خيارات مناسبة لمعاييرك.",
    primaryCta: "استكشف مناطق هيوستن",
    secondaryCta: "ابدأ الطلب",
    tertiaryCta: "اطرح سؤالاً",
  },
} as const;

export default function HoustonAreaNotFound({
  searchParams,
}: HoustonAreaNotFoundProps) {
  const lang = getLanguage(searchParams?.lang);
  const t = copy[lang];
  const isArabic = lang === "ar";

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f5f5f3] text-neutral-950"
    >
      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          {t.eyebrow}
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          {t.title}
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-neutral-600">
          {t.body}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/houston?lang=${lang}`}
            className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            {t.primaryCta}
          </Link>

          <Link
            href={`/intake?type=tenant&segment=general&lang=${lang}`}
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:border-black/20"
          >
            {t.secondaryCta}
          </Link>

          <Link
            href={`/contact?lang=${lang}`}
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:border-black/20"
          >
            {t.tertiaryCta}
          </Link>
        </div>
      </section>
    </main>
  );
}