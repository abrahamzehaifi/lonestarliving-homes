import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPreferredSiteLang } from "@/lib/i18n/getLangServer";

type Language = "en" | "es" | "ar";

type HomePageProps = {
  searchParams?: Promise<{
    lang?: string;
  }>;
};

const copy = {
  en: {
    brand: "5th Stream Realty LLC",
    eyebrow: "Houston real estate",
    title:
      "Helping clients move forward in Houston real estate with clarity and confidence.",
    body:
      "Whether you are renting, buying, selling, or leasing a property, the focus is simple: clear communication, practical guidance, and steady support from start to finish.",
    primaryCta: "Get started",
    secondaryCta: "View rentals",
    tertiaryCta: "Contact",
    buyerServices: "Buyer services",

    servicesEyebrow: "Services",
    servicesTitle: "Support across the key real estate paths.",
    servicesBody:
      "Each service is designed to help you move forward with better information and fewer unknowns.",

    services: [
      {
        title: "Rent",
        description:
          "Support for clients looking for rental homes and apartments across Houston.",
        href: "/rent",
        cta: "Explore rentals",
      },
      {
        title: "Buy",
        description:
          "Guidance for clients purchasing a home, from search through closing.",
        href: "/buy",
        cta: "View buyer services",
      },
      {
        title: "Sell",
        description:
          "Support for homeowners preparing, pricing, and selling a property.",
        href: "/sell",
        cta: "View seller services",
      },
      {
        title: "Lease",
        description:
          "Support for property owners bringing rental units to market.",
        href: "/landlords",
        cta: "View leasing support",
      },
    ],

    sectionOneEyebrow: "Renting and moving",
    sectionOneTitle: "For clients preparing for their next move.",
    sectionOneBody: [
      "Some clients are moving quickly, while others are planning ahead.",
      "Clear communication and the right information early help make the process smoother.",
      "Each situation is handled based on what is actually needed, not a one-size-fits-all approach.",
    ],
    sectionOneCta: "Start request",

    sectionTwoEyebrow: "Buying and selling",
    sectionTwoTitle: "For higher-value real estate decisions.",
    sectionTwoBody: [
      "Buying or selling a property requires clarity, timing, and careful coordination.",
      "The goal is to keep decisions grounded and the process steady from start to finish.",
      "Each step is handled with attention to detail and clear communication.",
    ],
    sectionTwoCta: "Request consultation",

    finalEyebrow: "Next step",
    finalTitle: "Start with a simple request.",
    finalBody:
      "Share a few details and the next step will be outlined clearly based on your situation.",
    finalPrimary: "Get started",
    finalSecondary: "Email office",
    legal:
      "Brokered by 5th Stream Realty LLC. Representation services are provided in accordance with Texas law and applicable written agreements.",
  },

  es: {
    brand: "5th Stream Realty LLC",
    eyebrow: "Bienes raíces en Houston",
    title:
      "Ayudando a los clientes a avanzar en bienes raíces en Houston con claridad y confianza.",
    body:
      "Ya sea para rentar, comprar, vender o arrendar una propiedad, el enfoque es simple: comunicación clara, orientación práctica y apoyo constante de principio a fin.",
    primaryCta: "Comenzar",
    secondaryCta: "Ver rentas",
    tertiaryCta: "Contacto",
    buyerServices: "Servicios para compradores",

    servicesEyebrow: "Servicios",
    servicesTitle: "Apoyo en los principales caminos inmobiliarios.",
    servicesBody:
      "Cada servicio está diseñado para ayudarle a avanzar con mejor información y menos incertidumbre.",

    services: [
      {
        title: "Rentar",
        description:
          "Apoyo para clientes que buscan casas y apartamentos en renta en Houston.",
        href: "/rent",
        cta: "Explorar rentas",
      },
      {
        title: "Comprar",
        description:
          "Orientación para clientes que desean comprar una vivienda, desde la búsqueda hasta el cierre.",
        href: "/buy",
        cta: "Ver servicios para compradores",
      },
      {
        title: "Vender",
        description:
          "Apoyo para propietarios que se preparan para fijar precio y vender una propiedad.",
        href: "/sell",
        cta: "Ver servicios para vendedores",
      },
      {
        title: "Arrendar",
        description:
          "Apoyo para propietarios que desean llevar una unidad en renta al mercado.",
        href: "/landlords",
        cta: "Ver apoyo de arrendamiento",
      },
    ],

    sectionOneEyebrow: "Rentar y mudarse",
    sectionOneTitle: "Para clientes que se preparan para su próxima mudanza.",
    sectionOneBody: [
      "Algunos clientes se mueven rápidamente, mientras que otros planean con más tiempo.",
      "Una comunicación clara y la información correcta desde el inicio ayudan a que el proceso sea más fluido.",
      "Cada situación se maneja según lo que realmente se necesita, no con un enfoque genérico.",
    ],
    sectionOneCta: "Iniciar solicitud",

    sectionTwoEyebrow: "Comprar y vender",
    sectionTwoTitle: "Para decisiones inmobiliarias de mayor valor.",
    sectionTwoBody: [
      "Comprar o vender una propiedad requiere claridad, buen momento y coordinación cuidadosa.",
      "El objetivo es mantener las decisiones bien fundamentadas y el proceso estable de principio a fin.",
      "Cada paso se maneja con atención al detalle y comunicación clara.",
    ],
    sectionTwoCta: "Solicitar consulta",

    finalEyebrow: "Siguiente paso",
    finalTitle: "Comience con una solicitud simple.",
    finalBody:
      "Comparta algunos detalles y el siguiente paso se definirá claramente según su situación.",
    finalPrimary: "Comenzar",
    finalSecondary: "Correo de la oficina",
    legal:
      "Intermediado por 5th Stream Realty LLC. Los servicios de representación se prestan conforme a la ley de Texas y los acuerdos escritos aplicables.",
  },

  ar: {
    brand: "5th Stream Realty LLC",
    eyebrow: "العقار في هيوستن",
    title: "مساعدة العملاء على التقدم في عقارات هيوستن بوضوح وثقة.",
    body:
      "سواء كنت ترغب في الاستئجار أو الشراء أو البيع أو تأجير عقار، فالفكرة بسيطة: تواصل واضح، وإرشاد عملي، ودعم ثابت من البداية إلى النهاية.",
    primaryCta: "ابدأ",
    secondaryCta: "عرض الإيجارات",
    tertiaryCta: "تواصل",
    buyerServices: "خدمات المشترين",

    servicesEyebrow: "الخدمات",
    servicesTitle: "دعم عبر المسارات العقارية الأساسية.",
    servicesBody:
      "تم تصميم كل خدمة لمساعدتك على التقدم بمعلومات أوضح وحالة أقل من عدم اليقين.",

    services: [
      {
        title: "استئجار",
        description:
          "دعم للعملاء الذين يبحثون عن منازل وشقق للإيجار في هيوستن.",
        href: "/rent",
        cta: "استكشف الإيجارات",
      },
      {
        title: "شراء",
        description:
          "إرشاد للعملاء الراغبين في شراء منزل، من البحث حتى الإغلاق.",
        href: "/buy",
        cta: "عرض خدمات المشترين",
      },
      {
        title: "بيع",
        description:
          "دعم لمالكي المنازل الذين يستعدون لتسعير وبيع عقار.",
        href: "/sell",
        cta: "عرض خدمات البائعين",
      },
      {
        title: "تأجير",
        description:
          "دعم لمالكي العقارات الذين يرغبون في طرح وحداتهم الإيجارية في السوق.",
        href: "/landlords",
        cta: "عرض دعم التأجير",
      },
    ],

    sectionOneEyebrow: "الاستئجار والانتقال",
    sectionOneTitle: "للعملاء الذين يستعدون لخطوتهم القادمة.",
    sectionOneBody: [
      "بعض العملاء يتحركون بسرعة، بينما يخطط آخرون مسبقًا.",
      "التواصل الواضح والمعلومات الصحيحة في البداية يساعدان على جعل العملية أكثر سلاسة.",
      "يتم التعامل مع كل حالة بناءً على ما تحتاجه فعليًا، وليس بأسلوب واحد للجميع.",
    ],
    sectionOneCta: "ابدأ الطلب",

    sectionTwoEyebrow: "الشراء والبيع",
    sectionTwoTitle: "للقرارات العقارية الأعلى قيمة.",
    sectionTwoBody: [
      "شراء أو بيع عقار يتطلب وضوحًا وتوقيتًا وتنسيقًا دقيقًا.",
      "الهدف هو إبقاء القرارات منضبطة والعملية مستقرة من البداية إلى النهاية.",
      "يتم التعامل مع كل خطوة بعناية وبتواصل واضح.",
    ],
    sectionTwoCta: "اطلب استشارة",

    finalEyebrow: "الخطوة التالية",
    finalTitle: "ابدأ بطلب بسيط.",
    finalBody:
      "شارك بعض التفاصيل وسيتم توضيح الخطوة التالية بشكل واضح بناءً على حالتك.",
    finalPrimary: "ابدأ",
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
              <DarkButton href={`/intake?service=tenant&lang=${lang}`}>
                {t.primaryCta}
              </DarkButton>
              <DarkButton href={`/rent?lang=${lang}`} secondary>
                {t.secondaryCta}
              </DarkButton>
              <DarkButton href={`mailto:info@lonestarliving.homes`} secondary>
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

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
            <LightButton href={`/intake?service=tenant&lang=${lang}`}>
              {t.primaryCta}
            </LightButton>
            <LightButton href={`/buy?lang=${lang}`}>
              {t.buyerServices}
            </LightButton>
            <a
              href="mailto:info@lonestarliving.homes"
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
                <LightButton href={`/intake?service=tenant&lang=${lang}`}>
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
                <LightButton href={`/intake?service=buyer&lang=${lang}`}>
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
              <LightButton href={`/intake?service=tenant&lang=${lang}`}>
                {t.finalPrimary}
              </LightButton>
              <a
                href="mailto:info@lonestarliving.homes"
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