import type { Metadata } from "next";
import Link from "next/link";
import { getPreferredSiteLang } from "@/lib/i18n/getLangServer";

export const metadata: Metadata = {
  title: "Houston Rentals | 5th Stream Realty LLC",
  description:
    "Houston rental and relocation guidance for qualified clients seeking a more organized leasing process through 5th Stream Realty LLC.",
};

type Language = "en" | "es" | "ar";

type RentPageProps = {
  searchParams?: {
    lang?: string;
  };
};

const copy = {
  en: {
    brand: "5th Stream Realty LLC",
    title:
      "Houston rental guidance for clients who value clarity, speed, and a more organized leasing process.",
    body:
      "Rental and relocation support for qualified clients seeking better positioning, cleaner communication, and a more efficient path from search to application and move-in.",
    primaryCta: "Begin Rental Intake",
    secondaryCta: "Ask a Question",

    whoTitle: "Who this is for",
    whoItems: [
      "Professionals relocating to Houston",
      "Texas Medical Center staff, fellows, and researchers",
      "Students with organized financial support documentation",
      "International clients with proof of funds or sponsor support",
      "Renters who want a more informed and efficient leasing process",
    ],

    expectTitle: "What to expect",
    expectItems: [
      "Clear guidance on budget, location, and move timeline",
      "Practical direction on screening and application readiness",
      "More efficient targeting of realistic rental options",
      "Organized communication throughout the leasing process",
      "Support from inquiry through lease execution",
    ],

    situationsEyebrow: "Rental situations",
    situationsTitle: "Choose the path that best matches your situation.",
    situationsBody:
      "Different rental situations require different preparation. These entry points are designed to make the process clearer from the start.",

    services: [
      {
        title: "Medical Center Housing",
        description:
          "Guidance for physicians, nurses, fellows, researchers, and other medical professionals seeking housing near the Texas Medical Center.",
        href: "/medical-center-housing",
        cta: "Explore Medical Center housing",
      },
      {
        title: "Houston Relocation",
        description:
          "Rental support for clients moving to Houston who need local guidance on neighborhoods, commute patterns, and timing.",
        href: "/houston-relocation",
        cta: "View relocation guidance",
      },
      {
        title: "International Renters",
        description:
          "Structured support for clients using proof of funds, sponsor support, or other nontraditional documentation.",
        href: "/intake?type=tenant&segment=international",
        cta: "Start international intake",
      },
      {
        title: "General Rental Intake",
        description:
          "For qualified renters who want a more organized search, stronger communication, and a cleaner leasing process.",
        href: "/intake?type=tenant&segment=general",
        cta: "Begin rental intake",
      },
    ],

    finalTitle: "Better rental decisions start with better information.",
    finalBody:
      "The intake process helps clarify timeline, target areas, application strength, and communication needs so the search can move forward with more precision and less wasted effort.",
    finalPrimary: "Begin Rental Intake",
    finalSecondary: "Contact the Office",
    legal:
      "Rental representation is provided by Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },

  es: {
    brand: "5th Stream Realty LLC",
    title:
      "Guía de renta en Houston para clientes que valoran claridad, rapidez y un proceso de arrendamiento más organizado.",
    body:
      "Apoyo en renta y reubicación para clientes calificados que buscan mejor posicionamiento, comunicación más clara y un camino más eficiente desde la búsqueda hasta la solicitud y mudanza.",
    primaryCta: "Comenzar solicitud de renta",
    secondaryCta: "Hacer una pregunta",

    whoTitle: "Para quién es esto",
    whoItems: [
      "Profesionales que se mudan a Houston",
      "Personal, fellows e investigadores del Texas Medical Center",
      "Estudiantes con documentación financiera organizada",
      "Clientes internacionales con prueba de fondos o respaldo de patrocinador",
      "Inquilinos que quieren un proceso de renta más informado y eficiente",
    ],

    expectTitle: "Qué esperar",
    expectItems: [
      "Guía clara sobre presupuesto, ubicación y tiempo de mudanza",
      "Orientación práctica sobre perfil de evaluación y preparación de solicitud",
      "Selección más eficiente de opciones de renta realistas",
      "Comunicación organizada durante el proceso de arrendamiento",
      "Apoyo desde la consulta hasta la ejecución del contrato",
    ],

    situationsEyebrow: "Situaciones de renta",
    situationsTitle: "Elija la ruta que mejor se ajuste a su situación.",
    situationsBody:
      "Diferentes situaciones de renta requieren diferente preparación. Estos puntos de entrada están diseñados para hacer el proceso más claro desde el inicio.",

    services: [
      {
        title: "Vivienda Medical Center",
        description:
          "Guía para médicos, enfermeros, fellows, investigadores y otros profesionales médicos que buscan vivienda cerca del Texas Medical Center.",
        href: "/medical-center-housing",
        cta: "Explorar vivienda Medical Center",
      },
      {
        title: "Reubicación a Houston",
        description:
          "Apoyo de renta para clientes que se mudan a Houston y necesitan orientación local sobre vecindarios, trayectos y tiempos.",
        href: "/houston-relocation",
        cta: "Ver guía de reubicación",
      },
      {
        title: "Inquilinos internacionales",
        description:
          "Apoyo estructurado para clientes que utilizan prueba de fondos, patrocinio u otra documentación no tradicional.",
        href: "/intake?type=tenant&segment=international",
        cta: "Iniciar solicitud internacional",
      },
      {
        title: "Solicitud general de renta",
        description:
          "Para inquilinos calificados que desean una búsqueda más organizada, mejor comunicación y un proceso de arrendamiento más claro.",
        href: "/intake?type=tenant&segment=general",
        cta: "Comenzar solicitud de renta",
      },
    ],

    finalTitle: "Mejores decisiones de renta comienzan con mejor información.",
    finalBody:
      "La solicitud ayuda a aclarar tiempos, zonas objetivo, fortaleza de solicitud y necesidades de comunicación para que la búsqueda avance con más precisión y menos esfuerzo desperdiciado.",
    finalPrimary: "Comenzar solicitud de renta",
    finalSecondary: "Contactar la oficina",
    legal:
      "La representación en renta es proporcionada por Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },

  ar: {
    brand: "5th Stream Realty LLC",
    title:
      "إرشاد للإيجار في هيوستن للعملاء الذين يقدرون الوضوح والسرعة وعملية تأجير أكثر تنظيمًا.",
    body:
      "دعم في الإيجار والانتقال للعملاء المؤهلين الذين يبحثون عن تموضع أفضل وتواصل أوضح ومسار أكثر كفاءة من البحث إلى التقديم والانتقال.",
    primaryCta: "ابدأ طلب الإيجار",
    secondaryCta: "اطرح سؤالاً",

    whoTitle: "لمن هذا المسار",
    whoItems: [
      "المهنيون المنتقلون إلى هيوستن",
      "موظفو Texas Medical Center والزملاء والباحثون",
      "الطلاب الذين لديهم دعم مالي موثق ومنظم",
      "العملاء الدوليون الذين لديهم إثبات أموال أو دعم من كفيل",
      "المستأجرون الذين يريدون عملية إيجار أكثر وضوحًا وكفاءة",
    ],

    expectTitle: "ما الذي يمكن توقعه",
    expectItems: [
      "إرشاد واضح بشأن الميزانية والموقع وتوقيت الانتقال",
      "توجيه عملي بشأن الجاهزية للفحص والتقديم",
      "استهداف أكثر كفاءة لخيارات إيجار واقعية",
      "تواصل منظم طوال عملية التأجير",
      "دعم من الاستفسار حتى تنفيذ العقد",
    ],

    situationsEyebrow: "حالات الإيجار",
    situationsTitle: "اختر المسار الأنسب لوضعك.",
    situationsBody:
      "تتطلب حالات الإيجار المختلفة استعدادًا مختلفًا. تم تصميم هذه المسارات لتجعل العملية أوضح من البداية.",

    services: [
      {
        title: "سكن Medical Center",
        description:
          "إرشاد للأطباء والممرضين والزملاء والباحثين وغيرهم من المهنيين الطبيين الباحثين عن سكن قرب Texas Medical Center.",
        href: "/medical-center-housing",
        cta: "استكشف سكن Medical Center",
      },
      {
        title: "الانتقال إلى هيوستن",
        description:
          "دعم إيجاري للعملاء المنتقلين إلى هيوستن الذين يحتاجون إلى إرشاد محلي بشأن الأحياء والتنقل والتوقيت.",
        href: "/houston-relocation",
        cta: "عرض إرشاد الانتقال",
      },
      {
        title: "المستأجرون الدوليون",
        description:
          "دعم منظم للعملاء الذين يستخدمون إثبات أموال أو دعم كفيل أو وثائق غير تقليدية.",
        href: "/intake?type=tenant&segment=international",
        cta: "ابدأ الطلب الدولي",
      },
      {
        title: "طلب إيجار عام",
        description:
          "للمستأجرين المؤهلين الذين يريدون بحثًا أكثر تنظيمًا وتواصلًا أفضل وعملية إيجار أوضح.",
        href: "/intake?type=tenant&segment=general",
        cta: "ابدأ طلب الإيجار",
      },
    ],

    finalTitle: "قرارات إيجار أفضل تبدأ بمعلومات أفضل.",
    finalBody:
      "تساعد عملية الاستقبال على توضيح الجدول الزمني والمناطق المستهدفة وقوة الطلب واحتياجات التواصل حتى يتحرك البحث بدقة أكبر وجهد أقل مهدور.",
    finalPrimary: "ابدأ طلب الإيجار",
    finalSecondary: "اتصل بالمكتب",
    legal:
      "يتم تقديم تمثيل الإيجار من قبل Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },
} as const;

function ServiceCard({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-black/5 bg-white p-6">
      <h3 className="text-xl font-semibold tracking-tight text-neutral-950">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-neutral-600">{description}</p>

      <Link
        href={href}
        className="mt-5 inline-flex items-center text-sm font-medium text-neutral-900 transition hover:text-neutral-600"
      >
        {cta}
      </Link>
    </div>
  );
}

export default async function RentPage({ searchParams }: RentPageProps) {
  const lang: Language = await getPreferredSiteLang(searchParams?.lang);
  const t = copy[lang];
  const isArabic = lang === "ar";

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="mx-auto max-w-6xl px-6 py-20"
    >
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
        {t.brand}
      </p>

      <div className="mt-4 max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
          {t.title}
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-600">
          {t.body}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/intake?type=tenant&segment=general&lang=${lang}`}
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

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
            {t.whoTitle}
          </h2>

          <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-600">
            {t.whoItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
            {t.expectTitle}
          </h2>

          <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-600">
            {t.expectItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            {t.situationsEyebrow}
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
            {t.situationsTitle}
          </h2>

          <p className="mt-4 text-base leading-8 text-neutral-600">
            {t.situationsBody}
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {t.services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              href={`${service.href}${service.href.includes("?") ? "&" : "?"}lang=${lang}`}
              cta={service.cta}
            />
          ))}
        </div>
      </div>

      <div className="mt-12 rounded-[1.75rem] border border-black/5 bg-neutral-50 p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
          {t.finalTitle}
        </h2>

        <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-600">
          {t.finalBody}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/intake?type=tenant&segment=general&lang=${lang}`}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            {t.finalPrimary}
          </Link>

          <Link
            href={`/contact?lang=${lang}`}
            className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-black/20 hover:bg-white"
          >
            {t.finalSecondary}
          </Link>
        </div>
      </div>

      <p className="mt-6 text-sm text-neutral-500">{t.legal}</p>
    </section>
  );
}