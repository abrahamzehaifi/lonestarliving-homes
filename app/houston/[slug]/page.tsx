import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllHoustonAreaSlugs,
  getHoustonAreaBySlug,
  pickLocalizedFaqs,
  pickLocalizedList,
  pickLocalizedText,
  type HoustonAreaPage,
  type SupportedLang,
} from "@/lib/houston-neighborhoods";
import { getSiteLang } from "@/lib/i18n/getLang";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ lang?: string }>;

type LabelSet = { en: string; es: string; ar: string };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pickLabel(value: LabelSet, lang: SupportedLang): string {
  return value[lang];
}

async function resolveProps(params: Params, searchParams?: SearchParams) {
  const { slug } = await params;
  const { lang: langParam } = (await searchParams) ?? {};
  return { slug, lang: getSiteLang(langParam) as SupportedLang };
}

function getCompareLinks(currentSlug: string): HoustonAreaPage[] {
  return COMPARE_SLUG_ORDER.filter((slug) => slug !== currentSlug)
    .map((slug) => getHoustonAreaBySlug(slug))
    .filter((item): item is HoustonAreaPage => Boolean(item));
}

function buildFaqJsonLd(faqs: ReturnType<typeof pickLocalizedFaqs>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const COMPARE_SLUG_ORDER = [
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
] as const;

const labels = {
  home:          { en: "Home",                    es: "Inicio",                       ar: "الرئيسية" },
  houstonAreas:  { en: "Houston Areas",           es: "Áreas de Houston",             ar: "مناطق هيوستن" },
  areas:         { en: "Houston areas",           es: "Áreas de Houston",             ar: "مناطق هيوستن" },
  startRequest:  { en: "Start request",           es: "Iniciar solicitud",            ar: "ابدأ الطلب" },
  rentalGuidance:{ en: "Rental guidance",         es: "Guía de renta",                ar: "دليل الاستئجار" },
  buyerGuidance: { en: "Buyer guidance",          es: "Guía para compradores",        ar: "دليل الشراء" },
  compareTitle:  { en: "Compare Houston areas",   es: "Comparar áreas de Houston",    ar: "قارن بين مناطق هيوستن" },
  compareText:   {
    en: "Use these pages to compare commute, housing style, pricing profile, and neighborhood fit more clearly.",
    es: "Usa estas páginas para comparar trayecto, tipo de vivienda, nivel de precios y compatibilidad del vecindario con más claridad.",
    ar: "استخدم هذه الصفحات لمقارنة التنقل ونمط السكن ومستوى الأسعار ومدى ملاءمة الحي بشكل أوضح.",
  },
  areaOverview:  { en: "Area overview",           es: "Resumen del área",             ar: "نظرة عامة على المنطقة" },
  exploreRental: { en: "Explore rentals",         es: "Explorar rentas",              ar: "استكشف الإيجارات" },
  bestFit:       { en: "Best fit for",            es: "Ideal para",                   ar: "الأنسب لـ" },
  startSearch:   { en: "Start search",            es: "Iniciar búsqueda",             ar: "ابدأ البحث" },
  housingProfile:{ en: "Housing profile",         es: "Perfil de vivienda",           ar: "ملف السكن" },
  exploreBuyer:  { en: "Explore buyer services",  es: "Explorar servicios para compradores", ar: "استكشف خدمات الشراء" },
  lifestyle:     { en: "Lifestyle and positioning",es: "Estilo de vida y posicionamiento", ar: "نمط الحياة والتمركز" },
  compareMore:   { en: "Compare more Houston areas", es: "Comparar más áreas de Houston", ar: "قارن المزيد من مناطق هيوستن" },
  pricing:       { en: "Pricing and decision considerations", es: "Precios y consideraciones de decisión", ar: "اعتبارات الأسعار واتخاذ القرار" },
  commute:       { en: "Commute considerations",  es: "Consideraciones de trayecto",  ar: "اعتبارات التنقل" },
  zipCodes:      { en: "Relevant ZIP codes",      es: "Códigos ZIP relevantes",       ar: "الرموز البريدية ذات الصلة" },
} satisfies Record<string, LabelSet>;

// ---------------------------------------------------------------------------
// Next.js exports
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  return getAllHoustonAreaSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const { slug, lang } = await resolveProps(params, searchParams);
  const page = getHoustonAreaBySlug(slug);

  if (!page) return { title: "Houston Areas", description: "Houston area pages." };

  return {
    title: pickLocalizedText(page.metaTitle, lang),
    description: pickLocalizedText(page.metaDescription, lang),
    alternates: { canonical: `/houston/${page.slug}` },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function HoustonAreaPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: SearchParams;
}) {
  const { slug, lang } = await resolveProps(params, searchParams);
  const page = getHoustonAreaBySlug(slug);

  if (!page) notFound();

  const compareLinks = getCompareLinks(page.slug).slice(0, 5);
  const faqs = pickLocalizedFaqs(page.seoFaqs, lang);

  const overview      = pickLocalizedList(page.overview, lang);
  const bestFor       = pickLocalizedList(page.bestFor, lang);
  const housing       = pickLocalizedList(page.housing, lang);
  const lifestyleItems = pickLocalizedList(page.lifestyle, lang);
  const commute       = pickLocalizedList(page.commute, lang);

  const l = (key: keyof typeof labels) => pickLabel(labels[key], lang);

  return (
    <main
      className="min-h-screen bg-[#f5f5f3] text-neutral-950"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="flex flex-wrap gap-3">
          <Link href="/" className={pillClass}>
            {l("home")}
          </Link>
          <Link href={`/houston?lang=${lang}`} className={pillClass}>
            {l("houstonAreas")}
          </Link>
        </div>

        <p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          {l("areas")}
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
          {pickLocalizedText(page.h1, lang)}
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-600">
          {pickLocalizedText(page.intro, lang)}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/intake?type=tenant&area=${page.slug}&lang=${lang}`} className={ctaClass}>
            {l("startRequest")}
          </Link>
          <Link href={`/rent?lang=${lang}`} className={pillClass}>
            {l("rentalGuidance")}
          </Link>
          <Link href={`/buy?lang=${lang}`} className={pillClass}>
            {l("buyerGuidance")}
          </Link>
        </div>
      </section>

      {/* Compare strip */}
      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className={cardClass}>
          <h2 className="text-lg font-semibold tracking-tight">{l("compareTitle")}</h2>
          <p className="mt-2 text-sm leading-7 text-neutral-600">{l("compareText")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {compareLinks.map((item) => (
              <Link
                key={item.slug}
                href={`/houston/${item.slug}?lang=${lang}`}
                className="rounded-full border border-black/10 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-800 transition hover:border-black/20 hover:bg-white"
              >
                {pickLocalizedText(item.title, lang)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Content grid */}
      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 md:grid-cols-2">
        {/* Area overview */}
        <div className={cardClass}>
          <h2 className={cardHeading}>{l("areaOverview")}</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-neutral-600">
            {overview.map((item) => (
              <p key={item}>
                {item}{" "}
                <Link href={`/rent?lang=${lang}`} className={inlineLinkClass}>
                  {l("exploreRental")}
                </Link>
                .
              </p>
            ))}
          </div>
        </div>

        {/* Best fit */}
        <div className={cardClass}>
          <h2 className={cardHeading}>{l("bestFit")}</h2>
          <BulletList items={bestFor} />
          <div className="mt-5">
            <Link href={`/intake?type=tenant&area=${page.slug}&lang=${lang}`} className={inlineLinkClass}>
              {l("startSearch")}
            </Link>
          </div>
        </div>

        {/* Housing profile */}
        <div className={cardClass}>
          <h2 className={cardHeading}>{l("housingProfile")}</h2>
          <BulletList items={housing} />
          <div className="mt-5">
            <Link href={`/buy?lang=${lang}`} className={inlineLinkClass}>
              {l("exploreBuyer")}
            </Link>
          </div>
        </div>

        {/* Lifestyle */}
        <div className={cardClass}>
          <h2 className={cardHeading}>{l("lifestyle")}</h2>
          <BulletList items={lifestyleItems} />
          <div className="mt-5">
            <Link href={`/houston?lang=${lang}`} className={inlineLinkClass}>
              {l("compareMore")}
            </Link>
          </div>
        </div>

        {/* Pricing + commute + ZIP codes */}
        <div className={`${cardClass} md:col-span-2`}>
          <h2 className={cardHeading}>{l("pricing")}</h2>
          <p className="mt-4 text-sm leading-7 text-neutral-600">
            {pickLocalizedText(page.pricingNote, lang)}{" "}
            <Link href={`/intake?type=tenant&area=${page.slug}&lang=${lang}`} className={inlineLinkClass}>
              {l("startSearch")}
            </Link>
            .
          </p>

          <h3 className="mt-6 text-lg font-semibold tracking-tight">{l("commute")}</h3>
          <BulletList items={commute} />

          {page.zipCodes.length > 0 && (
            <>
              <h3 className="mt-6 text-lg font-semibold tracking-tight">{l("zipCodes")}</h3>
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

      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(faqs)) }}
        />
      )}
    </main>
  );
}

// ---------------------------------------------------------------------------
// Shared style tokens
// ---------------------------------------------------------------------------

const pillClass =
  "inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:border-black/20";

const ctaClass =
  "inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800";

const cardClass =
  "rounded-[1.75rem] border border-black/5 bg-white p-6";

const cardHeading =
  "text-xl font-semibold tracking-tight";

const inlineLinkClass =
  "text-sm font-medium underline underline-offset-4 transition hover:text-neutral-900";

// ---------------------------------------------------------------------------
// Small reusable component
// ---------------------------------------------------------------------------

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-600">
      {items.map((item) => (
        <li key={item}>• {item}</li>
      ))}
    </ul>
  );
}
