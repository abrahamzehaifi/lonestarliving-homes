import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPreferredSiteLang } from "@/lib/i18n/getLang";

type Language = "en" | "es" | "ar";

type HomePageProps = {
  searchParams?: Promise<{
    lang?: string;
  }>;
};

const copy = {
  en: {
    brand: "5th Stream Realty LLC",
    eyebrow: "Houston real estate guidance",
    title:
      "Houston housing guidance for renters, relocations, buyers, sellers, and landlords.",
    body:
      "Structured intake and real estate guidance for qualified Houston clients, including rentals, relocation, Texas Medical Center housing, Rice student housing, buyer consultations, seller strategy, and landlord representation.",
    primaryCta: "Start intake",
    secondaryCta: "Explore rentals",
    tertiaryCta: "Medical Center housing",
    buyerServices: "Buyer services",

    servicesEyebrow: "Core paths",
    servicesTitle: "Clear service paths built around real client needs.",
    servicesBody:
      "The site is designed to move visitors into the right path faster, with cleaner intake and clearer next steps.",

    services: [
      {
        title: "Houston Rentals",
        description:
          "Rental and leasing guidance for qualified Houston renters seeking a more organized process.",
        href: "/rent",
        cta: "View rental guidance",
      },
      {
        title: "Texas Medical Center Housing",
        description:
          "Housing guidance for medical professionals, fellows, researchers, and healthcare relocations.",
        href: "/medical-center-housing",
        cta: "Explore medical housing",
      },
      {
        title: "Rice Student Housing",
        description:
          "Housing guidance for Rice students, graduate students, visiting scholars, and international renters.",
        href: "/rice-student-housing",
        cta: "Explore student housing",
      },
      {
        title: "Houston Relocation",
        description:
          "Structured housing support for professionals and families relocating to Houston.",
        href: "/houston-relocation",
        cta: "Start relocation guidance",
      },
      {
        title: "Buyer Representation",
        description:
          "Consultation, search strategy, negotiation support, and closing coordination.",
        href: "/buy",
        cta: "View buyer services",
      },
      {
        title: "Seller Representation",
        description:
          "Pricing strategy, market positioning, offer handling, and transaction execution.",
        href: "/sell",
        cta: "View seller services",
      },
    ],

    sectionOneEyebrow: "Rentals and relocation",
    sectionOneTitle: "Built for high-intent housing moves.",
    sectionOneBody: [
      "Rental and relocation clients often move on tighter timelines and benefit most from cleaner intake and better routing.",
      "This includes Texas Medical Center professionals, Rice students, international renters, and clients moving to Houston for work or training.",
      "The goal is not generic traffic. The goal is qualified inquiries and stronger next-step conversations.",
    ],
    sectionOneCta: "Begin tenant intake",

    sectionTwoEyebrow: "Buyers, sellers, and landlords",
    sectionTwoTitle: "Structured guidance for higher-value real estate decisions.",
    sectionTwoBody: [
      "Buyer, seller, and landlord inquiries are also routed through structured intake so the next step is clearer from the beginning.",
      "That means better information upfront, less friction, and more disciplined follow-through.",
      "Each path is designed to help qualify intent before time is spent on the back end.",
    ],
    sectionTwoCta: "Begin consultation",

    finalEyebrow: "Next step",
    finalTitle: "Start with the intake path that fits your situation.",
    finalBody:
      "Choose the path that matches your need and submit the relevant details so the request can be reviewed efficiently.",
    finalPrimary: "Start intake",
    finalSecondary: "Email office",
    legal:
      "Brokered by 5th Stream Realty LLC. Representation services are provided in accordance with Texas law and applicable written agreements.",
  },

  es: {
    brand: "5th Stream Realty LLC",
    eyebrow: "Guía inmobiliaria en Houston",
    title:
      "Guía de vivienda en Houston para inquilinos, reubicaciones, compradores, vendedores y propietarios.",
    body:
      "Solicitud estructurada y guía inmobiliaria para clientes calificados en Houston, incluyendo rentas, reubicación, vivienda cerca del Texas Medical Center, vivienda para estudiantes de Rice, consultas para compradores, estrategia para vendedores y representación para propietarios.",
    primaryCta: "Comenzar solicitud",
    secondaryCta: "Explorar rentas",
    tertiaryCta: "Vivienda Medical Center",
    buyerServices: "Servicios para compradores",

    servicesEyebrow: "Rutas principales",
    servicesTitle:
      "Rutas de servicio claras construidas alrededor de necesidades reales.",
    servicesBody:
      "El sitio está diseñado para mover a los visitantes hacia la ruta correcta más rápido, con mejor solicitud y pasos siguientes más claros.",

    services: [
      {
        title: "Rentas en Houston",
        description:
          "Guía de renta y arrendamiento para inquilinos calificados en Houston que desean un proceso más organizado.",
        href: "/rent",
        cta: "Ver guía de renta",
      },
      {
        title: "Vivienda Texas Medical Center",
        description:
          "Guía de vivienda para profesionales médicos, fellows, investigadores y reubicaciones del sector salud.",
        href: "/medical-center-housing",
        cta: "Explorar vivienda médica",
      },
      {
        title: "Vivienda para estudiantes de Rice",
        description:
          "Guía de vivienda para estudiantes de Rice, posgrado, investigadores visitantes e inquilinos internacionales.",
        href: "/rice-student-housing",
        cta: "Explorar vivienda estudiantil",
      },
      {
        title: "Reubicación a Houston",
        description:
          "Apoyo estructurado de vivienda para profesionales y familias que se mudan a Houston.",
        href: "/houston-relocation",
        cta: "Iniciar guía de reubicación",
      },
      {
        title: "Representación para compradores",
        description:
          "Consulta, estrategia de búsqueda, apoyo en negociación y coordinación de cierre.",
        href: "/buy",
        cta: "Ver servicios para compradores",
      },
      {
        title: "Representación para vendedores",
        description:
          "Estrategia de precio, posicionamiento, manejo de ofertas y ejecución de la transacción.",
        href: "/sell",
        cta: "Ver servicios para vendedores",
      },
    ],

    sectionOneEyebrow: "Rentas y reubicación",
    sectionOneTitle: "Diseñado para movimientos de vivienda con alta intención.",
    sectionOneBody: [
      "Los clientes de renta y reubicación suelen actuar con plazos más ajustados y se benefician más de una solicitud más clara y mejor clasificación.",
      "Esto incluye profesionales del Texas Medical Center, estudiantes de Rice, inquilinos internacionales y clientes que se mudan a Houston por trabajo o formación.",
      "La meta no es tráfico genérico. La meta es obtener consultas calificadas y mejores conversaciones de siguiente paso.",
    ],
    sectionOneCta: "Comenzar solicitud de inquilino",

    sectionTwoEyebrow: "Compradores, vendedores y propietarios",
    sectionTwoTitle:
      "Guía estructurada para decisiones inmobiliarias de mayor valor.",
    sectionTwoBody: [
      "Las consultas de compradores, vendedores y propietarios también pasan por una solicitud estructurada para que el siguiente paso sea más claro desde el inicio.",
      "Eso significa mejor información desde el principio, menos fricción y seguimiento más disciplinado.",
      "Cada ruta está diseñada para ayudar a calificar la intención antes de invertir tiempo en la gestión posterior.",
    ],
    sectionTwoCta: "Comenzar consulta",

    finalEyebrow: "Siguiente paso",
    finalTitle: "Comience con la ruta de solicitud que se ajuste a su situación.",
    finalBody:
      "Elija la ruta que coincida con su necesidad y envíe los detalles relevantes para que la solicitud sea revisada con eficiencia.",
    finalPrimary: "Comenzar solicitud",
    finalSecondary: "Correo de la oficina",
    legal:
      "Intermediado por 5th Stream Realty LLC. Los servicios de representación se prestan conforme a la ley de Texas y los acuerdos escritos aplicables.",
  },

  ar: {
    brand: "5th Stream Realty LLC",
    eyebrow: "إرشاد عقاري في هيوستن",
    title:
      "إرشاد سكني في هيوستن للمستأجرين والمنتقلين والمشترين والبائعين والملاك.",
    body:
      "استقبال منظم وإرشاد عقاري للعملاء المؤهلين في هيوستن، بما في ذلك الإيجارات والانتقال وسكن Texas Medical Center وسكن طلاب Rice واستشارات المشترين واستراتيجية البائعين وتمثيل الملاك.",
    primaryCta: "ابدأ الطلب",
    secondaryCta: "استكشف الإيجارات",
    tertiaryCta: "سكن Medical Center",
    buyerServices: "خدمات المشترين",

    servicesEyebrow: "المسارات الرئيسية",
    servicesTitle: "مسارات خدمة واضحة مبنية على احتياجات فعلية.",
    servicesBody:
      "تم تصميم الموقع لتوجيه الزوار إلى المسار المناسب بشكل أسرع، مع استقبال أوضح وخطوات تالية أكثر وضوحًا.",

    services: [
      {
        title: "إيجارات هيوستن",
        description:
          "إرشاد الإيجار والتأجير للمستأجرين المؤهلين في هيوستن الذين يريدون عملية أكثر تنظيمًا.",
        href: "/rent",
        cta: "عرض إرشاد الإيجار",
      },
      {
        title: "سكن Texas Medical Center",
        description:
          "إرشاد سكني للمهنيين الطبيين والباحثين وحالات الانتقال في القطاع الصحي.",
        href: "/medical-center-housing",
        cta: "استكشف السكن الطبي",
      },
      {
        title: "سكن طلاب Rice",
        description:
          "إرشاد سكني لطلاب Rice وطلاب الدراسات العليا والباحثين الزائرين والمستأجرين الدوليين.",
        href: "/rice-student-housing",
        cta: "استكشف السكن الطلابي",
      },
      {
        title: "الانتقال إلى هيوستن",
        description:
          "دعم سكني منظم للمهنيين والعائلات المنتقلين إلى هيوستن.",
        href: "/houston-relocation",
        cta: "ابدأ إرشاد الانتقال",
      },
      {
        title: "تمثيل المشترين",
        description:
          "استشارة، واستراتيجية البحث، ودعم التفاوض، وتنسيق الإغلاق.",
        href: "/buy",
        cta: "عرض خدمات المشترين",
      },
      {
        title: "تمثيل البائعين",
        description:
          "استراتيجية التسعير، والتموضع، والتعامل مع العروض، وتنفيذ الصفقة.",
        href: "/sell",
        cta: "عرض خدمات البائعين",
      },
    ],

    sectionOneEyebrow: "الإيجارات والانتقال",
    sectionOneTitle: "مبني لحالات السكن ذات النية العالية.",
    sectionOneBody: [
      "عملاء الإيجار والانتقال غالبًا ما يتحركون ضمن جداول زمنية أسرع ويستفيدون أكثر من استقبال أوضح وتوجيه أفضل.",
      "ويشمل ذلك مهنيي Texas Medical Center وطلاب Rice والمستأجرين الدوليين والعملاء المنتقلين إلى هيوستن للعمل أو التدريب.",
      "الهدف ليس حركة مرور عامة. الهدف هو استفسارات مؤهلة ومحادثات أفضل للخطوة التالية.",
    ],
    sectionOneCta: "ابدأ طلب المستأجر",

    sectionTwoEyebrow: "المشترون والبائعون والملاك",
    sectionTwoTitle: "إرشاد منظم لقرارات عقارية أعلى قيمة.",
    sectionTwoBody: [
      "يتم أيضًا توجيه استفسارات المشترين والبائعين والملاك عبر استقبال منظم حتى تصبح الخطوة التالية أوضح من البداية.",
      "وهذا يعني معلومات أفضل مقدمًا، واحتكاكًا أقل، ومتابعة أكثر انضباطًا.",
      "كل مسار مصمم للمساعدة في تأهيل النية قبل استهلاك الوقت في المراحل الخلفية.",
    ],
    sectionTwoCta: "ابدأ الاستشارة",

    finalEyebrow: "الخطوة التالية",
    finalTitle: "ابدأ بمسار الطلب المناسب لحالتك.",
    finalBody:
      "اختر المسار الذي يطابق احتياجك وأرسل التفاصيل ذات الصلة حتى تتم مراجعة الطلب بكفاءة.",
    finalPrimary: "ابدأ الطلب",
    finalSecondary: "بريد المكتب",
    legal:
      "يتم التوسط من خلال 5th Stream Realty LLC. تُقدَّم خدمات التمثيل وفقًا لقانون تكساس والاتفاقيات الكتابية المعمول بها.",
  },
} as const;

function DarkButton({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        secondary
          ? "inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/10"
          : "inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-white/90"
      }
    >
      {children}
    </Link>
  );
}

function LightButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-black/20 hover:bg-neutral-50"
    >
      {children}
    </Link>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const lang: Language = await getPreferredSiteLang(resolvedSearchParams.lang);
  const t = copy[lang];
  const isArabic = lang === "ar";

  return (
    <div dir={isArabic ? "rtl" : "ltr"}>
      <section className="relative isolate overflow-hidden bg-[#03081b] text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-houston-v2.jpg"
            alt="Houston skyline"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.68] saturate-[0.9]"
          />
        </div>

        <div className="absolute inset-0 bg-[#03081b]/52" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/88 via-[#03081b]/66 to-[#03081b]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/8 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-24 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/85 md:text-sm">
              {t.eyebrow}
            </p>

            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.35)] md:text-6xl lg:text-[4.15rem] lg:leading-[1.03]">
              {t.title}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/95 [text-shadow:0_1px_10px_rgba(0,0,0,0.28)] md:text-lg">
              {t.body}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <DarkButton href={`/intake?type=tenant&segment=general&lang=${lang}`}>
                {t.primaryCta}
              </DarkButton>
              <DarkButton href={`/rent?lang=${lang}`} secondary>
                {t.secondaryCta}
              </DarkButton>
              <DarkButton
                href={`/medical-center-housing?lang=${lang}`}
                secondary
              >
                {t.tertiaryCta}
              </DarkButton>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f3]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              {t.servicesEyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              {t.servicesTitle}
            </h2>
            <p className="mt-5 text-base leading-8 text-neutral-600">
              {t.servicesBody}
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {t.services.map((service) => (
              <Link
                key={service.title}
                href={`${service.href}?lang=${lang}`}
                className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-xl font-semibold text-neutral-950">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  {service.description}
                </p>
                <p className="mt-5 text-sm font-medium text-black">
                  {service.cta} →
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <LightButton href={`/intake?type=tenant&segment=general&lang=${lang}`}>
              {t.primaryCta}
            </LightButton>
            <LightButton href={`/buy?lang=${lang}`}>
              {t.buyerServices}
            </LightButton>
            <a
              href="mailto:zehaifirealty@gmail.com"
              className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-black/20 hover:bg-neutral-50"
            >
              {t.finalSecondary}
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-[2rem] border border-black/5 p-8">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
                {t.sectionOneEyebrow}
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                {t.sectionOneTitle}
              </h2>
              <div className="mt-5 space-y-3 text-sm leading-7 text-neutral-700">
                {t.sectionOneBody.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
              <div className="mt-6">
                <LightButton href={`/intake?type=tenant&segment=general&lang=${lang}`}>
                  {t.sectionOneCta}
                </LightButton>
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/5 p-8">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
                {t.sectionTwoEyebrow}
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                {t.sectionTwoTitle}
              </h2>
              <div className="mt-5 space-y-3 text-sm leading-7 text-neutral-700">
                {t.sectionTwoBody.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
              <div className="mt-6">
                <LightButton href={`/intake?type=buyer&segment=general&lang=${lang}`}>
                  {t.sectionTwoCta}
                </LightButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f3]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="rounded-[2rem] bg-white p-8 ring-1 ring-black/5 md:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              {t.finalEyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              {t.finalTitle}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-600">
              {t.finalBody}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <LightButton href={`/intake?type=tenant&segment=general&lang=${lang}`}>
                {t.finalPrimary}
              </LightButton>
              <a
                href="mailto:zehaifirealty@gmail.com"
                className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-black/20 hover:bg-neutral-50"
              >
                {t.finalSecondary}
              </a>
            </div>

            <p className="mt-8 text-sm text-neutral-500">{t.legal}</p>
          </div>
        </div>
      </section>
    </div>
  );
}