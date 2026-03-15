import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Houston Relocation | 5th Stream Realty LLC",
  description:
    "Houston relocation guidance for qualified clients moving for work, school, medical training, or personal transition.",
};

type Language = "en" | "es" | "ar";

type HoustonRelocationPageProps = {
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
      "Brokered by 5th Stream Realty LLC. Submitting a request does not create an agency relationship. Representation, availability, and next steps depend on review, fit, and applicable written agreement.",
  },

  es: {
    eyebrow: "Reubicación a Houston",
    title: "Guía de reubicación para una mudanza más organizada a Houston.",
    body:
      "Apoyo estructurado para inquilinos y compradores calificados que se mudan a Houston, con mejor planificación en torno a tiempos, vecindarios, trayectos, perfil de evaluación y ejecución práctica del siguiente paso.",
    primaryCta: "Comenzar solicitud de renta",
    secondaryCta: "Explorar compra",
    cards: [
      {
        title: "Planificación de mudanza",
        description:
          "Útil para clientes que equilibran fechas de mudanza, presión temporal, elección de vecindarios y realidad del trayecto.",
      },
      {
        title: "Solicitud estructurada",
        description:
          "La solicitud captura los detalles base necesarios para dirigir la conversación de reubicación de manera más eficiente.",
      },
      {
        title: "Siguiente paso con enfoque en ejecución",
        description:
          "La meta es convertir una consulta amplia de reubicación en una ruta de vivienda más clara y con menos pasos desperdiciados.",
      },
    ],
    legal:
      "Intermediado por 5th Stream Realty LLC. Enviar una solicitud no crea una relación de agencia. La representación, disponibilidad y los siguientes pasos dependen de revisión, ajuste y acuerdo escrito aplicable.",
  },

  ar: {
    eyebrow: "الانتقال إلى هيوستن",
    title: "إرشاد للانتقال من أجل انتقال أكثر تنظيمًا إلى هيوستن.",
    body:
      "دعم منظم للمستأجرين والمشترين المؤهلين المنتقلين إلى هيوستن مع تخطيط أفضل يتعلق بالتوقيت والأحياء وأنماط التنقل والجاهزية والفحص والتنفيذ العملي للخطوة التالية.",
    primaryCta: "ابدأ طلب الإيجار",
    secondaryCta: "استكشف الشراء",
    cards: [
      {
        title: "تخطيط الانتقال",
        description:
          "مفيد للعملاء الذين يوازنون بين مواعيد الانتقال والضغط الزمني المؤقت واختيار الأحياء وواقع التنقل اليومي.",
      },
      {
        title: "استقبال منظم",
        description:
          "يلتقط الطلب التفاصيل الأساسية اللازمة لتوجيه محادثة الانتقال بكفاءة أكبر.",
      },
      {
        title: "خطوة تالية تركز على التنفيذ",
        description:
          "الهدف هو تحويل استفسار الانتقال العام إلى مسار سكني أوضح مع خطوات مهدورة أقل.",
      },
    ],
    legal:
      "يتم التوسط من خلال 5th Stream Realty LLC. لا يؤدي إرسال الطلب إلى إنشاء علاقة وكالة. تعتمد التمثيل والتوفر والخطوات التالية على المراجعة والملاءمة والاتفاق الكتابي المعمول به.",
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

export default async function HoustonRelocationPage({
  searchParams,
}: HoustonRelocationPageProps) {
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