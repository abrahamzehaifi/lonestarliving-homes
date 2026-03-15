import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rice Student Housing | 5th Stream Realty LLC",
  description:
    "Houston rental guidance for qualified students, parents, and nearby academic renters seeking housing near Rice University.",
};

type Language = "en" | "es" | "ar";

type RiceStudentHousingPageProps = {
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
    eyebrow: "Rice Student Housing",
    title: "Rental guidance near Rice University.",
    body:
      "Organized rental support for qualified students, parents, and nearby academic or research-related renters seeking stronger location fit, commute efficiency, and screening readiness.",
    primaryCta: "Start housing request",
    secondaryCta: "Contact",
    cards: [
      {
        title: "Student-oriented search",
        description:
          "Useful for students and parents who want a more organized starting point around budget, location, and timing.",
      },
      {
        title: "Location and transit fit",
        description:
          "The request can be framed around proximity to campus, daily travel patterns, and practical housing priorities.",
      },
      {
        title: "Cleaner intake flow",
        description:
          "The goal is to move beyond scattered inquiries and capture the details needed for a more focused next step.",
      },
    ],
    legal:
      "Brokered by 5th Stream Realty LLC. Submitting a request does not create an agency relationship. Representation, availability, and next steps depend on review, fit, and applicable written agreement.",
  },

  es: {
    eyebrow: "Vivienda para estudiantes de Rice",
    title: "Guía de renta cerca de Rice University.",
    body:
      "Apoyo organizado de renta para estudiantes calificados, padres y arrendatarios académicos o de investigación cercanos que buscan mejor ubicación, eficiencia de trayecto y preparación de solicitud.",
    primaryCta: "Comenzar solicitud de vivienda",
    secondaryCta: "Contacto",
    cards: [
      {
        title: "Búsqueda orientada al estudiante",
        description:
          "Útil para estudiantes y padres que desean un punto de partida más organizado en torno a presupuesto, ubicación y tiempo.",
      },
      {
        title: "Ubicación y ajuste de transporte",
        description:
          "La solicitud puede estructurarse en torno a la cercanía al campus, los trayectos diarios y las prioridades prácticas de vivienda.",
      },
      {
        title: "Proceso de solicitud más claro",
        description:
          "La meta es ir más allá de consultas dispersas y capturar los detalles necesarios para un siguiente paso más enfocado.",
      },
    ],
    legal:
      "Intermediado por 5th Stream Realty LLC. Enviar una solicitud no crea una relación de agencia. La representación, disponibilidad y los siguientes pasos dependen de revisión, ajuste y acuerdo escrito aplicable.",
  },

  ar: {
    eyebrow: "سكن طلاب Rice",
    title: "إرشاد للإيجار بالقرب من Rice University.",
    body:
      "دعم إيجاري منظم للطلاب المؤهلين وأولياء الأمور والمستأجرين المرتبطين بالدراسة أو البحث ممن يبحثون عن موقع أفضل وكفاءة أعلى في التنقل وجاهزية أقوى للتقديم.",
    primaryCta: "ابدأ طلب السكن",
    secondaryCta: "تواصل",
    cards: [
      {
        title: "بحث موجه للطلاب",
        description:
          "مفيد للطلاب وأولياء الأمور الذين يريدون نقطة بداية أكثر تنظيمًا فيما يتعلق بالميزانية والموقع والتوقيت.",
      },
      {
        title: "الملاءمة من حيث الموقع والتنقل",
        description:
          "يمكن صياغة الطلب حول القرب من الحرم الجامعي وأنماط التنقل اليومية وأولويات السكن العملية.",
      },
      {
        title: "استقبال أوضح",
        description:
          "الهدف هو تجاوز الاستفسارات المتفرقة وجمع التفاصيل اللازمة لخطوة تالية أكثر تركيزًا.",
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

export default async function RiceStudentHousingPage({
  searchParams,
}: RiceStudentHousingPageProps) {
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
            href={`/intake?type=tenant&segment=rice_student&lang=${lang}`}
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
          <p className="text-sm leading-7 text-neutral-600">{t.legal}</p>
        </div>
      </section>
    </main>
  );
}