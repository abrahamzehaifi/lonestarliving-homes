import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getHoustonAreaBySlug,
  houstonAreaPages,
} from "@/lib/houston-neighborhoods";
import { getSiteLang, type SiteLang } from "@/lib/i18n/getLang";

type Params = { slug: string };
type SearchParams = { lang?: string };

function t(value: unknown, lang: SiteLang) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value;

  if (typeof value === "object") {
    const localized = value as Record<string, unknown>;
    return localized[lang] ?? localized.en ?? "";
  }

  return "";
}

export async function generateStaticParams() {
  return houstonAreaPages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Promise<SearchParams> | SearchParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const sp =
    searchParams instanceof Promise ? await searchParams : searchParams;
  const lang = getSiteLang(sp?.lang);

  const page = getHoustonAreaBySlug(slug);

  if (!page) {
    return {
      title: "Houston Neighborhood Guidance",
      description: "Houston neighborhood guidance.",
    };
  }

  return {
    title: String(t(page.metaTitle, lang)),
    description: String(t(page.metaDescription, lang)),
    alternates: {
      canonical: `/houston/${page.slug}`,
    },
  };
}

function getCompareLinks(currentSlug: string) {
  const priorityOrder = [
    "katy",
    "cypress",
    "the-heights",
    "spring-branch",
    "memorial-energy-corridor",
    "river-oaks-upper-kirby",
    "west-university-rice-museum-district",
    "galleria-tanglewood",
    "bellaire",
    "downtown-midtown-montrose-river-oaks-adjacent",
    "spring",
    "the-woodlands",
    "clear-lake-webster",
    "baytown-east-houston-corridor",
  ];

  return priorityOrder
    .filter((slug) => slug !== currentSlug)
    .map((slug) => getHoustonAreaBySlug(slug))
    .filter(Boolean);
}

export default async function HoustonAreaPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Promise<SearchParams> | SearchParams;
}) {
  const { slug } = await params;
  const sp =
    searchParams instanceof Promise ? await searchParams : searchParams;
  const lang = getSiteLang(sp?.lang);

  const page = getHoustonAreaBySlug(slug);

  if (!page) {
    notFound();
  }

  const compareLinks = getCompareLinks(page.slug).slice(0, 5);

  const localizedFaqs =
    (t(page.seoFaqs, lang) as Array<{ question: string; answer: string }>) || [];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: localizedFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const overview = (t(page.overview, lang) as string[]) || [];
  const bestFor = (t(page.bestFor, lang) as string[]) || [];
  const housing = (t(page.housing, lang) as string[]) || [];
  const lifestyle = (t(page.lifestyle, lang) as string[]) || [];
  const commute = (t(page.commute, lang) as string[]) || [];

  const labels = {
    home: {
      en: "Home",
      es: "Inicio",
      ar: "الرئيسية",
    },
    houstonAreas: {
      en: "Houston Areas",
      es: "Áreas de Houston",
      ar: "مناطق هيوستن",
    },
    guidance: {
      en: "Houston neighborhood guidance",
      es: "Guía de vecindarios de Houston",
      ar: "دليل أحياء هيوستن",
    },
    beginIntake: {
      en: "Begin intake",
      es: "Iniciar solicitud",
      ar: "ابدأ الطلب",
    },
    rentalGuidance: {
      en: "Rental guidance",
      es: "Guía de renta",
      ar: "دليل الاستئجار",
    },
    buyerGuidance: {
      en: "Buyer guidance",
      es: "Guía de شراء",
      ar: "دليل الشراء",
    },
    compareTitle: {
      en: "Compare Houston areas",
      es: "Comparar áreas de Houston",
      ar: "قارن بين مناطق هيوستن",
    },
    compareText: {
      en: "Clients rarely compare just one location. Use these area pages to compare commute, housing style, pricing profile, and neighborhood fit more efficiently.",
      es: "Rara vez los clientes comparan una sola ubicación. Usa estas páginas para comparar trayecto, tipo de vivienda, nivel de precios y compatibilidad del vecindario con más claridad.",
      ar: "نادرًا ما يقارن العملاء منطقة واحدة فقط. استخدم هذه الصفحات لمقارنة التنقل ونمط السكن ومستوى الأسعار ومدى ملاءمة الحي بشكل أوضح.",
    },
    areaOverview: {
      en: "Area overview",
      es: "Resumen del área",
      ar: "نظرة عامة على المنطقة",
    },
    exploreRental: {
      en: "Explore rental strategy",
      es: "Explorar estrategia de renta",
      ar: "استكشف استراتيجية الاستئجار",
    },
    bestFit: {
      en: "Best fit for",
      es: "Ideal para",
      ar: "الأنسب لـ",
    },
    startGuidedSearch: {
      en: "Start a guided search",
      es: "Iniciar búsqueda guiada",
      ar: "ابدأ بحثًا موجهًا",
    },
    housingProfile: {
      en: "Housing profile",
      es: "Perfil de vivienda",
      ar: "ملف السكن",
    },
    exploreBuyer: {
      en: "Explore buyer guidance",
      es: "Explorar guía para compradores",
      ar: "استكشف دليل الشراء",
    },
    lifestyle: {
      en: "Lifestyle and positioning",
      es: "Estilo de vida y posicionamiento",
      ar: "نمط الحياة والتمركز",
    },
    compareMore: {
      en: "Compare more Houston neighborhoods",
      es: "Comparar más vecindarios de Houston",
      ar: "قارن المزيد من أحياء هيوستن",
    },
    pricing: {
      en: "Pricing and decision considerations",
      es: "Precios y consideraciones de decisión",
      ar: "اعتبارات الأسعار واتخاذ القرار",
    },
    commute: {
      en: "Commute considerations",
      es: "Consideraciones de trayecto",
      ar: "اعتبارات التنقل",
    },
    zipCodes: {
      en: "Relevant ZIP codes",
      es: "Códigos ZIP relevantes",
      ar: "الرموز البريدية ذات الصلة",
    },
  } as const;

  return (
    <main
      className="min-h-screen bg-[#f5f5f3] text-neutral-950"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:border-black/20"
          >
            {labels.home[lang]}
          </Link>

          <Link
            href="/houston"
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:border-black/20"
          >
            {labels.houstonAreas[lang]}
          </Link>
        </div>

        <p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          {labels.guidance[lang]}
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
          {String(t(page.h1, lang))}
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-600">
          {String(t(page.intro, lang))}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/intake?type=tenant&segment=general&area=${page.slug}&lang=${lang}`}
            className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            {labels.beginIntake[lang]}
          </Link>

          <Link
            href={`/rent?lang=${lang}`}
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:border-black/20"
          >
            {labels.rentalGuidance[lang]}
          </Link>

          <Link
            href={`/buy?lang=${lang}`}
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:border-black/20"
          >
            {labels.buyerGuidance[lang]}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6">
          <h2 className="text-lg font-semibold tracking-tight">
            {labels.compareTitle[lang]}
          </h2>

          <p className="mt-2 text-sm leading-7 text-neutral-600">
            {labels.compareText[lang]}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {compareLinks.map((item) => (
              <Link
                key={item!.slug}
                href={`/houston/${item!.slug}?lang=${lang}`}
                className="rounded-full border border-black/10 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-800 transition hover:border-black/20 hover:bg-white"
              >
                {String(t(item!.title, lang))}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 md:grid-cols-2">
        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6">
          <h2 className="text-xl font-semibold tracking-tight">
            {labels.areaOverview[lang]}
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-neutral-600">
            {overview.map((item) => (
              <p key={item}>
                {item}{" "}
                <Link
                  href={`/rent?lang=${lang}`}
                  className="underline underline-offset-4 transition hover:text-neutral-900"
                >
                  {labels.exploreRental[lang]}
                </Link>
                .
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6">
          <h2 className="text-xl font-semibold tracking-tight">
            {labels.bestFit[lang]}
          </h2>

          <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-600">
            {bestFor.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>

          <div className="mt-5">
            <Link
              href={`/intake?type=tenant&segment=general&area=${page.slug}&lang=${lang}`}
              className="text-sm font-medium underline underline-offset-4 transition hover:text-neutral-900"
            >
              {labels.startGuidedSearch[lang]}
            </Link>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6">
          <h2 className="text-xl font-semibold tracking-tight">
            {labels.housingProfile[lang]}
          </h2>

          <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-600">
            {housing.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>

          <div className="mt-5">
            <Link
              href={`/buy?lang=${lang}`}
              className="text-sm font-medium underline underline-offset-4 transition hover:text-neutral-900"
            >
              {labels.exploreBuyer[lang]}
            </Link>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6">
          <h2 className="text-xl font-semibold tracking-tight">
            {labels.lifestyle[lang]}
          </h2>

          <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-600">
            {lifestyle.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>

          <div className="mt-5">
            <Link
              href={`/houston?lang=${lang}`}
              className="text-sm font-medium underline underline-offset-4 transition hover:text-neutral-900"
            >
              {labels.compareMore[lang]}
            </Link>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 md:col-span-2">
          <h2 className="text-xl font-semibold tracking-tight">
            {labels.pricing[lang]}
          </h2>

          <p className="mt-4 text-sm leading-7 text-neutral-600">
            {String(t(page.pricingNote, lang))}{" "}
            <Link
              href={`/intake?type=tenant&segment=general&area=${page.slug}&lang=${lang}`}
              className="underline underline-offset-4 transition hover:text-neutral-900"
            >
              {labels.startGuidedSearch[lang]}
            </Link>
            .
          </p>

          <h3 className="mt-6 text-lg font-semibold tracking-tight">
            {labels.commute[lang]}
          </h3>

          <ul className="mt-3 space-y-3 text-sm leading-7 text-neutral-600">
            {commute.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>

          {page.zipCodes.length > 0 && (
            <>
              <h3 className="mt-6 text-lg font-semibold tracking-tight">
                {labels.zipCodes[lang]}
              </h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {page.zipCodes.map((zip) => (
                  <span
                    key={zip}
                    className="rounded-full border border-black/10 bg-neutral-50 px-3 py-1 text-xs font-medium tracking-[0.12em] text-neutral-700"
                  >
                    {zip}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  );
}