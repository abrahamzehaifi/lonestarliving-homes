import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request received",
  description: "Your request has been received. Next steps will follow shortly.",
};

type Language = "en" | "es" | "ar";

type ThanksPageProps = {
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
    eyebrow: "Request received",
    title: "Thank you.",
    body:
      "Your request has been received. The details will be reviewed and the most appropriate next step will be determined shortly.",
  },

  es: {
    eyebrow: "Solicitud recibida",
    title: "Gracias.",
    body:
      "Su solicitud ha sido recibida. Los detalles serán revisados y se determinará el siguiente paso más apropiado en breve.",
  },

  ar: {
    eyebrow: "تم استلام الطلب",
    title: "شكرًا.",
    body:
      "تم استلام طلبك. سيتم مراجعة التفاصيل وتحديد الخطوة التالية المناسبة قريبًا.",
  },
} as const;

export default async function ThanksPage({ searchParams }: ThanksPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const lang = getLanguage(resolvedSearchParams.lang);
  const t = copy[lang];
  const isArabic = lang === "ar";

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="mx-auto max-w-2xl px-6 py-16"
    >
      <div className="rounded-3xl border border-neutral-200 bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
          {t.eyebrow}
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
          {t.title}
        </h1>

        <p className="mt-4 text-neutral-700">{t.body}</p>
      </div>
    </main>
  );
}