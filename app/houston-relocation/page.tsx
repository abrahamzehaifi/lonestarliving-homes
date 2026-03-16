import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houston Relocation | 5th Stream Realty LLC",
  description:
    "Houston relocation guidance for qualified clients moving for work, school, medical training, or personal transition.",
};

type Language = "en" | "es" | "ar";

function getLanguage(value?: string): Language {
  if (value === "es" || value === "ar") return value;
  return "en";
}

type Props = {
  searchParams?: {
    lang?: string;
  };
};

const copy = {
  en: {
    eyebrow: "Houston Relocation",
    title: "Relocation guidance for a more organized move into Houston.",
    body:
      "Structured support for qualified renters and buyers relocating to Houston with better planning around timing, neighborhoods, commute patterns, screening, and practical next-step execution.",
    primaryCta: "Start rental request",
    secondaryCta: "Explore buying",
    cards: [
      {
        title: "Move planning",
        description:
          "Useful for clients balancing move dates, temporary timing pressure, neighborhood choices, and commute realities.",
      },
      {
        title: "Structured intake",
        description:
          "The request captures the baseline details needed to route the relocation conversation more efficiently.",
      },
      {
        title: "Execution-focused next step",
        description:
          "The aim is to turn a broad relocation inquiry into a clearer housing path with fewer wasted steps.",
      },
    ],
    legal:
      "Brokered by 5th Stream Realty LLC. Submitting a request does not create an agency relationship.",
  },

  es: {
    eyebrow: "Reubicación a Houston",
    title: "Guía de reubicación para una mudanza más organizada a Houston.",
    body:
      "Apoyo estructurado para inquilinos y compradores calificados que se mudan a Houston.",
    primaryCta: "Comenzar solicitud de renta",
    secondaryCta: "Explorar compra",
    cards: [
      {
        title: "Planificación de mudanza",
        description:
          "Útil para clientes que equilibran fechas de mudanza y elección de vecindarios.",
      },
      {
        title: "Solicitud estructurada",
        description:
          "La solicitud captura los detalles necesarios para dirigir la conversación.",
      },
      {
        title: "Siguiente paso enfocado",
        description:
          "Convertir una consulta amplia en una ruta de vivienda más clara.",
      },
    ],
    legal:
      "Intermediado por 5th Stream Realty LLC. Enviar una solicitud no crea relación de agencia.",
  },

  ar: {
    eyebrow: "الانتقال إلى هيوستن",
    title: "إرشاد للانتقال إلى هيوستن بشكل أكثر تنظيمًا.",
    body:
      "دعم منظم للمستأجرين والمشترين المؤهلين المنتقلين إلى هيوستن.",
    primaryCta: "ابدأ طلب الإيجار",
    secondaryCta: "استكشف الشراء",
    cards: [
      {
        title: "تخطيط الانتقال",
        description:
          "مفيد للعملاء الذين يوازنون بين مواعيد الانتقال واختيار الأحياء.",
      },
      {
        title: "استقبال منظم",
        description:
          "يلتقط الطلب التفاصيل الأساسية اللازمة لتوجيه المحادثة.",
      },
      {
        title: "خطوة تنفيذ واضحة",
        description:
          "تحويل استفسار الانتقال إلى مسار سكني أوضح.",
      },
    ],
    legal:
      "يتم التوسط من خلال 5th Stream Realty LLC.",
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

export default function HoustonRelocationPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams?.lang);
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

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={`/intake?type=tenant&segment=relocation&lang=${lang}`}
            className="inline-flex h-12 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            {t.primaryCta}
          </Link>

          <Link
            href={`/buy?lang=${lang}`}
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
          <p className="text-sm leading-7 text-neutral-600">{t.legal}</p>
        </div>
      </section>
    </main>
  );
}