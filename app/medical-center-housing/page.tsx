import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Center Housing | 5th Stream Realty LLC",
  description:
    "Houston Medical Center rental guidance for qualified renters seeking housing near hospitals, clinics, and major healthcare employers.",
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
    eyebrow: "Medical Center Housing",
    title: "Houston housing guidance near the Texas Medical Center.",
    body:
      "Structured rental guidance for qualified clients seeking housing near the Texas Medical Center, hospitals, clinics, and surrounding neighborhoods with more practical commute and screening alignment.",
    primaryCta: "Start housing request",
    secondaryCta: "Contact",

    cards: [
      {
        title: "Commute-focused search",
        description:
          "Useful for clients who need better access to hospitals, clinics, training programs, or medical employment centers.",
      },
      {
        title: "Screening-aware intake",
        description:
          "Budget, timing, and practical rental criteria are captured early so the next step can be more efficient.",
      },
      {
        title: "Structured next step",
        description:
          "The intake path is designed to reduce scattered communication and move qualified requests into a clearer review flow.",
      },
    ],

    legal:
      "Brokered by 5th Stream Realty LLC. Submitting a request does not create an agency relationship. Representation, availability, and next steps depend on review, fit, and applicable written agreement.",
  },

  es: {
    eyebrow: "Vivienda Medical Center",
    title: "Guía de vivienda en Houston cerca del Texas Medical Center.",
    body:
      "Guía estructurada de renta para clientes calificados que buscan vivienda cerca del Texas Medical Center, hospitales, clínicas y vecindarios cercanos con mejor alineación de trayecto y perfil de evaluación.",
    primaryCta: "Comenzar solicitud de vivienda",
    secondaryCta: "Contacto",

    cards: [
      {
        title: "Búsqueda orientada al trayecto",
        description:
          "Útil para clientes que necesitan mejor acceso a hospitales, clínicas, programas de formación o centros de empleo médico.",
      },
      {
        title: "Solicitud alineada con evaluación",
        description:
          "El presupuesto, el tiempo y los criterios prácticos de renta se capturan desde el inicio para que el siguiente paso sea más eficiente.",
      },
      {
        title: "Siguiente paso estructurado",
        description:
          "La ruta de solicitud está diseñada para reducir la comunicación dispersa y mover solicitudes calificadas hacia un proceso de revisión más claro.",
      },
    ],

    legal:
      "Intermediado por 5th Stream Realty LLC. Enviar una solicitud no crea una relación de agencia. La representación, disponibilidad y los siguientes pasos dependen de revisión, ajuste y acuerdo escrito aplicable.",
  },

  ar: {
    eyebrow: "سكن Medical Center",
    title: "إرشاد سكني في هيوستن بالقرب من Texas Medical Center.",
    body:
      "إرشاد منظم للإيجار للعملاء المؤهلين الباحثين عن سكن بالقرب من Texas Medical Center والمستشفيات والعيادات والأحياء المحيطة مع توافق أفضل من ناحية التنقل وجاهزية التقديم.",
    primaryCta: "ابدأ طلب السكن",
    secondaryCta: "تواصل",

    cards: [
      {
        title: "بحث يركز على التنقل",
        description:
          "مفيد للعملاء الذين يحتاجون إلى وصول أفضل إلى المستشفيات والعيادات وبرامج التدريب أو جهات العمل الطبية.",
      },
      {
        title: "استقبال يراعي الجاهزية",
        description:
          "يتم جمع الميزانية والتوقيت ومعايير الإيجار العملية مبكرًا حتى تصبح الخطوة التالية أكثر كفاءة.",
      },
      {
        title: "خطوة تالية أكثر تنظيمًا",
        description:
          "تم تصميم مسار الطلب لتقليل التواصل المتفرق ونقل الطلبات المؤهلة إلى مسار مراجعة أوضح.",
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

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={`/intake?type=tenant&segment=medical_center&lang=${lang}`}
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