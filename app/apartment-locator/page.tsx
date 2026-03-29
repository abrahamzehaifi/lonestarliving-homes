import type { Metadata } from "next";
import Link from "next/link";
import { getPreferredSiteLang } from "@/lib/i18n/getLangServer";

export const metadata: Metadata = {
  title: "Houston Apartment Locator | 5th Stream Realty LLC",
  description:
    "Houston apartment guidance for qualified renters seeking a clearer, more efficient rental search process through 5th Stream Realty LLC.",
};

type Language = "en" | "es" | "ar";

type ApartmentLocatorPageProps = {
  searchParams?: {
    lang?: string;
  };
};

function HeroSection({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-12">
      <div className="rounded-[2rem] border border-black/5 bg-white p-8 md:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-600">
          {description}
        </p>
      </div>
    </section>
  );
}

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
    <Link
      href={href}
      className="rounded-[1.5rem] border border-black/5 bg-white p-6 transition hover:border-black/10 hover:bg-neutral-50"
    >
      <h3 className="text-xl font-semibold tracking-tight text-neutral-950">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-neutral-600">{description}</p>
      <p className="mt-5 text-sm font-medium text-neutral-900">{cta}</p>
    </Link>
  );
}

function ProcessStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
        Step {number}
      </p>
      <h3 className="mt-3 text-lg font-semibold tracking-tight text-neutral-950">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-neutral-600">{description}</p>
    </div>
  );
}

const copy = {
  en: {
    eyebrow: "Apartment Locator",
    title: "Houston apartment guidance for qualified renters.",
    description:
      "If you are moving to Houston or relocating within the city, submit your criteria and receive more focused apartment guidance based on budget, area, timing, and day-to-day practicality.",
    startHereEyebrow: "Start here",
    startHereTitle:
      "Start your Houston apartment search with clear, useful criteria.",
    startHereBody:
      "The fastest way to receive relevant guidance is to submit your housing criteria directly. That helps the search begin with your actual budget, timeline, and preferred areas instead of broad back-and-forth.",
    cards: [
      {
        title: "Monthly budget",
        body: "Set a realistic monthly target before touring.",
      },
      {
        title: "Move-in date",
        body: "Timing affects pricing, availability, and next steps.",
      },
      {
        title: "Bedrooms",
        body: "Clarify space requirements from the beginning.",
      },
      {
        title: "Preferred areas",
        body: "Focus the search around commute, school, or lifestyle needs.",
      },
      {
        title: "Application readiness",
        body: "Helps identify communities that are more realistic fits.",
      },
      {
        title: "Pets",
        body: "Important for narrowing eligible properties quickly.",
      },
    ],
    intakeCta: "Start Apartment Search",
    focusEyebrow: "Focus areas",
    focusTitle:
      "Houston rental guidance built around real relocation needs.",
    focusBody:
      "Apartment searches become more efficient when they are organized around where you need to be, how you need to commute, and what type of daily routine the property needs to support.",
    services: [
      {
        title: "Texas Medical Center",
        description:
          "Housing guidance for medical professionals, staff, researchers, and clients seeking practical access to the Texas Medical Center.",
        href: "/medical-center-housing",
        cta: "Explore Medical Center housing",
      },
      {
        title: "Rice University Area",
        description:
          "Guidance for students, researchers, and visiting academics seeking housing near Rice University and surrounding neighborhoods.",
        href: "/rice-student-housing",
        cta: "Explore Rice area housing",
      },
      {
        title: "Houston Relocation",
        description:
          "Rental guidance for clients moving from another city, another state, or from outside the United States.",
        href: "/houston-relocation",
        cta: "Explore relocation guidance",
      },
      {
        title: "General Houston Rentals",
        description:
          "Support for qualified renters seeking a more organized apartment search across Houston based on budget, area, and timing.",
        href: "/rent",
        cta: "View rental guidance",
      },
    ],
    processEyebrow: "Process",
    processTitle: "A cleaner apartment search process.",
    processBody:
      "The goal is to move from broad interest to useful next steps as quickly as possible.",
    steps: [
      {
        number: "01",
        title: "Submit your criteria",
        description:
          "Provide your budget, move-in date, target areas, and basic search needs.",
      },
      {
        number: "02",
        title: "Review fit",
        description:
          "Your request is reviewed against location, timing, and practical search priorities.",
      },
      {
        number: "03",
        title: "Receive next-step guidance",
        description:
          "You receive more focused direction for apartment options and search priorities.",
      },
      {
        number: "04",
        title: "Move toward application",
        description:
          "Once a workable fit is identified, the process can move toward tours and application.",
      },
    ],
    finalEyebrow: "Next step",
    finalTitle: "Start your Houston apartment request.",
    finalBody:
      "Submit your criteria through the intake form so the search begins with the facts that actually matter.",
    finalPrimary: "Start Apartment Search",
    finalSecondary: "Review Rental Guidance",
  },
  es: {
    eyebrow: "Localizador de apartamentos",
    title: "Guía de apartamentos en Houston para inquilinos calificados.",
    description:
      "Si se muda a Houston o dentro de la ciudad, envíe sus criterios y reciba una orientación más enfocada según presupuesto, zona, tiempo y necesidades prácticas.",
    startHereEyebrow: "Comenzar",
    startHereTitle:
      "Comience su búsqueda de apartamento en Houston con criterios claros y útiles.",
    startHereBody:
      "La forma más rápida de recibir orientación relevante es enviar directamente sus criterios de vivienda. Así la búsqueda comienza con su presupuesto real, su tiempo y sus zonas preferidas.",
    cards: [
      { title: "Presupuesto mensual", body: "Defina una meta realista antes de visitar propiedades." },
      { title: "Fecha de mudanza", body: "El tiempo afecta precios, disponibilidad y próximos pasos." },
      { title: "Habitaciones", body: "Aclare desde el inicio cuánto espacio necesita." },
      { title: "Zonas preferidas", body: "Enfoque la búsqueda según trayecto, escuela o estilo de vida." },
      { title: "Preparación para aplicar", body: "Ayuda a identificar opciones más realistas." },
      { title: "Mascotas", body: "Importante para reducir opciones rápidamente." },
    ],
    intakeCta: "Comenzar búsqueda",
    focusEyebrow: "Áreas de enfoque",
    focusTitle:
      "Guía de renta en Houston basada en necesidades reales de reubicación.",
    focusBody:
      "Las búsquedas de apartamentos son más eficientes cuando se organizan alrededor de dónde necesita estar, cómo necesita desplazarse y qué tipo de rutina diaria debe soportar la propiedad.",
    services: [
      {
        title: "Texas Medical Center",
        description:
          "Guía de vivienda para profesionales médicos, personal, investigadores y clientes que buscan acceso práctico al Texas Medical Center.",
        href: "/medical-center-housing",
        cta: "Explorar vivienda Medical Center",
      },
      {
        title: "Área de Rice University",
        description:
          "Guía para estudiantes, investigadores y académicos visitantes que buscan vivienda cerca de Rice University y zonas cercanas.",
        href: "/rice-student-housing",
        cta: "Explorar vivienda zona Rice",
      },
      {
        title: "Reubicación a Houston",
        description:
          "Guía de renta para clientes que se mudan desde otra ciudad, otro estado o desde fuera de los Estados Unidos.",
        href: "/houston-relocation",
        cta: "Explorar guía de reubicación",
      },
      {
        title: "Rentas generales en Houston",
        description:
          "Apoyo para inquilinos calificados que buscan una búsqueda más organizada según presupuesto, zona y tiempo.",
        href: "/rent",
        cta: "Ver guía de renta",
      },
    ],
    processEyebrow: "Proceso",
    processTitle: "Un proceso de búsqueda más limpio.",
    processBody:
      "El objetivo es pasar del interés general a pasos útiles lo más rápido posible.",
    steps: [
      {
        number: "01",
        title: "Envíe sus criterios",
        description:
          "Proporcione presupuesto, fecha de mudanza, zonas objetivo y necesidades básicas.",
      },
      {
        number: "02",
        title: "Revisión de ajuste",
        description:
          "Su solicitud se revisa según ubicación, tiempo y prioridades prácticas.",
      },
      {
        number: "03",
        title: "Reciba guía de siguientes pasos",
        description:
          "Recibe una dirección más enfocada para opciones y prioridades de búsqueda.",
      },
      {
        number: "04",
        title: "Avance hacia la solicitud",
        description:
          "Una vez identificada una opción viable, el proceso puede avanzar hacia visitas y solicitud.",
      },
    ],
    finalEyebrow: "Siguiente paso",
    finalTitle: "Comience su solicitud de apartamento en Houston.",
    finalBody:
      "Envíe sus criterios a través del formulario para que la búsqueda comience con los datos que realmente importan.",
    finalPrimary: "Comenzar búsqueda",
    finalSecondary: "Revisar guía de renta",
  },
  ar: {
    eyebrow: "باحث الشقق",
    title: "إرشاد للشقق في هيوستن للمستأجرين المؤهلين.",
    description:
      "إذا كنت تنتقل إلى هيوستن أو داخلها، فأرسل متطلباتك للحصول على إرشاد أكثر تركيزًا بناءً على الميزانية والمنطقة والتوقيت والاحتياجات العملية.",
    startHereEyebrow: "ابدأ هنا",
    startHereTitle:
      "ابدأ بحثك عن شقة في هيوستن بمعايير واضحة ومفيدة.",
    startHereBody:
      "أسرع طريقة للحصول على توجيه مناسب هي إرسال متطلبات السكن مباشرة، حتى يبدأ البحث بميزانيتك الفعلية وتوقيتك ومناطقك المفضلة.",
    cards: [
      { title: "الميزانية الشهرية", body: "حدد رقمًا واقعيًا قبل الجولات." },
      { title: "تاريخ الانتقال", body: "التوقيت يؤثر على الأسعار والتوفر والخطوات التالية." },
      { title: "عدد الغرف", body: "حدد احتياجات المساحة من البداية." },
      { title: "المناطق المفضلة", body: "ركّز البحث حول العمل أو الدراسة أو أسلوب الحياة." },
      { title: "الجاهزية للتقديم", body: "تساعد على تحديد الخيارات الأكثر واقعية." },
      { title: "الحيوانات الأليفة", body: "مهم لتضييق الخيارات بسرعة." },
    ],
    intakeCta: "ابدأ البحث عن شقة",
    focusEyebrow: "مجالات التركيز",
    focusTitle:
      "إرشاد إيجاري في هيوستن مبني على احتياجات انتقال حقيقية.",
    focusBody:
      "تصبح عمليات البحث عن الشقق أكثر كفاءة عندما تُنظم حول المكان الذي تحتاج أن تكون فيه وكيفية تنقلك وما يجب أن يدعمه العقار في حياتك اليومية.",
    services: [
      {
        title: "Texas Medical Center",
        description:
          "إرشاد سكني للمهنيين الطبيين والموظفين والباحثين والعملاء الباحثين عن وصول عملي إلى Texas Medical Center.",
        href: "/medical-center-housing",
        cta: "استكشف سكن Medical Center",
      },
      {
        title: "منطقة Rice University",
        description:
          "إرشاد للطلاب والباحثين والأكاديميين الزائرين الباحثين عن سكن قرب Rice University والمناطق المحيطة.",
        href: "/rice-student-housing",
        cta: "استكشف سكن منطقة Rice",
      },
      {
        title: "الانتقال إلى هيوستن",
        description:
          "إرشاد إيجاري للعملاء المنتقلين من مدينة أخرى أو ولاية أخرى أو من خارج الولايات المتحدة.",
        href: "/houston-relocation",
        cta: "استكشف إرشاد الانتقال",
      },
      {
        title: "إيجارات هيوستن العامة",
        description:
          "دعم للمستأجرين المؤهلين الباحثين عن عملية أكثر تنظيمًا حسب الميزانية والمنطقة والتوقيت.",
        href: "/rent",
        cta: "راجع إرشاد الإيجار",
      },
    ],
    processEyebrow: "العملية",
    processTitle: "عملية بحث أنظف عن الشقق.",
    processBody:
      "الهدف هو الانتقال من الاهتمام العام إلى خطوات مفيدة بأسرع ما يمكن.",
    steps: [
      {
        number: "01",
        title: "أرسل متطلباتك",
        description:
          "قدّم ميزانيتك وتاريخ الانتقال والمناطق المستهدفة واحتياجاتك الأساسية.",
      },
      {
        number: "02",
        title: "مراجعة الملاءمة",
        description:
          "تتم مراجعة طلبك وفق الموقع والتوقيت والأولويات العملية.",
      },
      {
        number: "03",
        title: "احصل على توجيه للخطوة التالية",
        description:
          "تحصل على توجيه أكثر تركيزًا بشأن الخيارات وأولويات البحث.",
      },
      {
        number: "04",
        title: "الانتقال نحو التقديم",
        description:
          "بمجرد تحديد خيار مناسب، يمكن الانتقال إلى الجولات والتقديم.",
      },
    ],
    finalEyebrow: "الخطوة التالية",
    finalTitle: "ابدأ طلب شقتك في هيوستن.",
    finalBody:
      "أرسل متطلباتك عبر نموذج الاستقبال حتى يبدأ البحث بالحقائق التي تهم فعلاً.",
    finalPrimary: "ابدأ البحث عن شقة",
    finalSecondary: "راجع إرشاد الإيجار",
  },
} as const;

export default async function ApartmentLocatorPage({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const lang: Language = await getPreferredSiteLang(searchParams?.lang);
  const t = copy[lang];
  const isArabic = lang === "ar";

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="pb-20">
      <HeroSection
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      />

      <section className="mx-auto max-w-5xl px-6">
        <div className="rounded-[2rem] border border-black/5 bg-white p-8 md:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              {t.startHereEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
              {t.startHereTitle}
            </h2>
            <p className="mt-4 text-base leading-8 text-neutral-600">
              {t.startHereBody}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.cards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-black/5 bg-neutral-50 p-5"
              >
                <p className="text-sm font-medium text-neutral-900">
                  {card.title}
                </p>
                <p className="mt-2 text-sm leading-7 text-neutral-600">
                  {card.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href={`/intake?type=tenant&lang=${lang}`}
              className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              {t.intakeCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-5xl px-6">
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

        <div className="mt-8 grid gap-6 md:grid-cols-2">
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
      </section>

      <section className="mx-auto mt-20 max-w-5xl px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            {t.processEyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
            {t.processTitle}
          </h2>
          <p className="mt-4 text-base leading-8 text-neutral-600">
            {t.processBody}
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {t.steps.map((step) => (
            <ProcessStep
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-5xl px-6">
        <div className="rounded-[2rem] border border-black/5 bg-[#efefec] p-8 md:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              {t.finalEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
              {t.finalTitle}
            </h2>
            <p className="mt-4 text-base leading-8 text-neutral-600">
              {t.finalBody}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/intake?type=tenant&lang=${lang}`}
              className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              {t.finalPrimary}
            </Link>

            <Link
              href={`/rent?lang=${lang}`}
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-6 text-sm font-medium text-neutral-900 transition hover:border-black/20 hover:bg-white"
            >
              {t.finalSecondary}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}