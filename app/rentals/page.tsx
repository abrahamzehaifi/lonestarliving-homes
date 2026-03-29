import Link from "next/link";
import { getPreferredSiteLang } from "@/lib/i18n/getLangServer";

type Language = "en" | "es" | "ar";

type RentalsPageProps = {
  searchParams?: {
    lang?: string;
  };
};

const copy = {
  en: {
    eyebrow: "Rentals & Relocation",
    title:
      "Houston rental guidance with a more disciplined, better organized process.",
    body:
      "Rental and relocation support for clients who want clarity, stronger positioning, and a smoother path from search to application and move-in. The focus is practical guidance, structured communication, and realistic execution in the Houston market.",
    primaryCta: "Begin Rental Intake",
    secondaryCta: "Ask a Question",

    whoTitle: "Who this service is built for",
    whoItems: [
      "Professionals relocating to Houston",
      "Medical Center staff, researchers, and fellows",
      "Students with organized financial support documentation",
      "International clients with proof of funds or sponsor support",
      "Renters who want a cleaner and more informed leasing process",
    ],

    expectTitle: "What to expect",
    expectItems: [
      "Clear guidance on budget, area, and move timeline",
      "Practical direction on screening and application readiness",
      "More efficient targeting of realistic rental options",
      "Organized communication throughout the leasing process",
      "Support from inquiry through lease execution and move-in planning",
    ],

    focusEyebrow: "Focus areas",
    focusTitle: "Choose the path that best fits your situation.",
    focusBody:
      "Different rental situations require different strategy. These entry points are designed to make the process clearer and more efficient from the start.",

    services: [
      {
        title: "Medical Center Rentals",
        description:
          "Guidance for physicians, nurses, fellows, researchers, and medical professionals seeking housing near the Texas Medical Center.",
        href: "/medical-center-housing",
        cta: "Explore Medical Center housing",
      },
      {
        title: "Houston Relocation",
        description:
          "Structured rental support for clients moving to Houston who need local guidance on areas, commute patterns, and timing.",
        href: "/houston-relocation",
        cta: "View relocation guidance",
      },
      {
        title: "International Clients",
        description:
          "A more organized leasing process for clients using proof of funds, sponsor support, or other nontraditional documentation.",
        href: "/intake?type=tenant&segment=international",
        cta: "Start international intake",
      },
      {
        title: "Organized Leasing Support",
        description:
          "For clients who want a disciplined application process, stronger communication, and better operational follow-through.",
        href: "/intake?type=tenant&segment=general",
        cta: "Begin leasing intake",
      },
    ],

    finalTitle: "Stronger rental outcomes begin with better information.",
    finalBody:
      "The intake process helps clarify your timeline, target areas, application position, and communication needs so the search can move forward with more precision and less wasted effort.",
    finalPrimary: "Begin Rental Intake",
    finalSecondary: "Contact the Office",
    legal:
      "Rental representation is provided by Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },

  es: {
    eyebrow: "Rentas y Reubicación",
    title:
      "Guía de renta en Houston con un proceso más disciplinado y mejor organizado.",
    body:
      "Apoyo en renta y reubicación para clientes que desean claridad, mejor posicionamiento y un camino más fluido desde la búsqueda hasta la solicitud y la mudanza. El enfoque es orientación práctica, comunicación estructurada y ejecución realista en el mercado de Houston.",
    primaryCta: "Comenzar solicitud de renta",
    secondaryCta: "Hacer una pregunta",

    whoTitle: "Para quién está construido este servicio",
    whoItems: [
      "Profesionales que se mudan a Houston",
      "Personal del Medical Center, investigadores y fellows",
      "Estudiantes con documentación financiera organizada",
      "Clientes internacionales con prueba de fondos o apoyo de patrocinador",
      "Inquilinos que desean un proceso de arrendamiento más claro e informado",
    ],

    expectTitle: "Qué esperar",
    expectItems: [
      "Guía clara sobre presupuesto, zona y tiempo de mudanza",
      "Orientación práctica sobre perfil de evaluación y preparación de solicitud",
      "Selección más eficiente de opciones de renta realistas",
      "Comunicación organizada durante todo el proceso de arrendamiento",
      "Apoyo desde la consulta hasta la firma del contrato y la planificación de mudanza",
    ],

    focusEyebrow: "Áreas de enfoque",
    focusTitle: "Elija la ruta que mejor se ajuste a su situación.",
    focusBody:
      "Diferentes situaciones de renta requieren diferente estrategia. Estos puntos de entrada están diseñados para hacer el proceso más claro y más eficiente desde el inicio.",

    services: [
      {
        title: "Rentas Medical Center",
        description:
          "Guía para médicos, enfermeros, fellows, investigadores y profesionales médicos que buscan vivienda cerca del Texas Medical Center.",
        href: "/medical-center-housing",
        cta: "Explorar vivienda Medical Center",
      },
      {
        title: "Reubicación a Houston",
        description:
          "Apoyo estructurado de renta para clientes que se mudan a Houston y necesitan orientación local sobre zonas, trayectos y tiempos.",
        href: "/houston-relocation",
        cta: "Ver guía de reubicación",
      },
      {
        title: "Clientes internacionales",
        description:
          "Un proceso de arrendamiento más organizado para clientes que usan prueba de fondos, apoyo de patrocinador u otra documentación no tradicional.",
        href: "/intake?type=tenant&segment=international",
        cta: "Iniciar solicitud internacional",
      },
      {
        title: "Apoyo organizado de arrendamiento",
        description:
          "Para clientes que desean un proceso de solicitud disciplinado, mejor comunicación y mejor seguimiento operativo.",
        href: "/intake?type=tenant&segment=general",
        cta: "Comenzar solicitud de arrendamiento",
      },
    ],

    finalTitle: "Mejores resultados de renta comienzan con mejor información.",
    finalBody:
      "La solicitud ayuda a aclarar su tiempo, zonas objetivo, posición de solicitud y necesidades de comunicación para que la búsqueda avance con más precisión y menos esfuerzo desperdiciado.",
    finalPrimary: "Comenzar solicitud de renta",
    finalSecondary: "Contactar la oficina",
    legal:
      "La representación en renta es proporcionada por Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },

  ar: {
    eyebrow: "الإيجارات والانتقال",
    title: "إرشاد للإيجار في هيوستن بعملية أكثر انضباطًا وتنظيمًا.",
    body:
      "دعم في الإيجار والانتقال للعملاء الذين يريدون وضوحًا وتموضعًا أقوى ومسارًا أكثر سلاسة من البحث إلى التقديم والانتقال. يركز العمل على الإرشاد العملي والتواصل المنظم والتنفيذ الواقعي في سوق هيوستن.",
    primaryCta: "ابدأ طلب الإيجار",
    secondaryCta: "اطرح سؤالاً",

    whoTitle: "لمن صُممت هذه الخدمة",
    whoItems: [
      "المهنيون المنتقلون إلى هيوستن",
      "موظفو Medical Center والباحثون والزملاء",
      "الطلاب الذين لديهم وثائق دعم مالي منظمة",
      "العملاء الدوليون الذين لديهم إثبات أموال أو دعم من كفيل",
      "المستأجرون الذين يريدون عملية تأجير أوضح وأكثر وعيًا",
    ],

    expectTitle: "ما الذي يمكن توقعه",
    expectItems: [
      "إرشاد واضح بشأن الميزانية والمنطقة والجدول الزمني للانتقال",
      "توجيه عملي بشأن الجاهزية للفحص والتقديم",
      "استهداف أكثر كفاءة لخيارات إيجار واقعية",
      "تواصل منظم طوال عملية التأجير",
      "دعم من الاستفسار حتى تنفيذ العقد والتخطيط للانتقال",
    ],

    focusEyebrow: "مجالات التركيز",
    focusTitle: "اختر المسار الأنسب لوضعك.",
    focusBody:
      "تتطلب حالات الإيجار المختلفة استراتيجيات مختلفة. تم تصميم هذه المسارات لتجعل العملية أوضح وأكثر كفاءة من البداية.",

    services: [
      {
        title: "إيجارات Medical Center",
        description:
          "إرشاد للأطباء والممرضين والزملاء والباحثين والمهنيين الطبيين الباحثين عن سكن بالقرب من Texas Medical Center.",
        href: "/medical-center-housing",
        cta: "استكشف سكن Medical Center",
      },
      {
        title: "الانتقال إلى هيوستن",
        description:
          "دعم إيجاري منظم للعملاء المنتقلين إلى هيوستن الذين يحتاجون إلى إرشاد محلي بشأن المناطق وأنماط التنقل والتوقيت.",
        href: "/houston-relocation",
        cta: "عرض إرشاد الانتقال",
      },
      {
        title: "العملاء الدوليون",
        description:
          "عملية تأجير أكثر تنظيمًا للعملاء الذين يستخدمون إثبات أموال أو دعم كفيل أو وثائق غير تقليدية.",
        href: "/intake?type=tenant&segment=international",
        cta: "ابدأ الطلب الدولي",
      },
      {
        title: "دعم تأجير منظم",
        description:
          "للعملاء الذين يريدون عملية تقديم منضبطة وتواصلًا أقوى ومتابعة تشغيلية أفضل.",
        href: "/intake?type=tenant&segment=general",
        cta: "ابدأ طلب التأجير",
      },
    ],

    finalTitle: "نتائج إيجارية أقوى تبدأ بمعلومات أفضل.",
    finalBody:
      "تساعد عملية الاستقبال على توضيح الجدول الزمني والمناطق المستهدفة ووضع الطلب واحتياجات التواصل حتى يتحرك البحث بدقة أكبر وجهد أقل مهدور.",
    finalPrimary: "ابدأ طلب الإيجار",
    finalSecondary: "تواصل مع المكتب",
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

export default async function RentalsPage({
  searchParams,
}: RentalsPageProps) {
  const lang: Language = await getPreferredSiteLang(searchParams?.lang);
  const t = copy[lang];
  const isArabic = lang === "ar";

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="mx-auto max-w-6xl px-6 py-20"
    >
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
        {t.eyebrow}
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
            {t.focusEyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
            {t.focusTitle}
          </h2>
          <p className="mt-4 text-base leading-8 text-neutral-600">
            {t.focusBody}
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