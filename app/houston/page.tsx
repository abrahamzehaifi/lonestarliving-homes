import type { Metadata } from "next";
import Link from "next/link";
import {
  houstonAreaPages,
  pickLocalizedText,
  type SupportedLang,
} from "@/lib/houston-neighborhoods";
import { getSiteLang } from "@/lib/i18n/getLang";

// ---------------------------------------------------------------------------
// Types & helpers
// ---------------------------------------------------------------------------

type SearchParams = Promise<{ lang?: string }>;
type LabelSet = { en: string; es: string; ar: string };

function pickLabel(value: LabelSet, lang: SupportedLang): string {
  return value[lang];
}

async function resolveLang(searchParams?: SearchParams): Promise<SupportedLang> {
  const { lang } = (await searchParams) ?? {};
  return getSiteLang(lang) as SupportedLang;
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const labels = {
  eyebrow: {
    en: "Houston Areas",
    es: "Áreas de Houston",
    ar: "مناطق هيوستن",
  },
  title: {
    en: "Houston neighborhood guidance",
    es: "Guía de vecindarios de Houston",
    ar: "دليل أحياء هيوستن",
  },
  intro: {
    en: "Use these area pages to compare neighborhood fit, commute logic, housing profile, and pricing tradeoffs across Houston.",
    es: "Usa estas páginas para comparar compatibilidad del vecindario, lógica de trayecto, perfil de vivienda y diferencias de precios en Houston.",
    ar: "استخدم هذه الصفحات لمقارنة ملاءمة الأحياء ومنطق التنقل وطبيعة السكن والفروقات السعرية في هيوستن.",
  },
  openArea: {
    en: "Open area",
    es: "Abrir zona",
    ar: "افتح المنطقة",
  },
} satisfies Record<string, LabelSet>;

// ---------------------------------------------------------------------------
// Next.js exports
// ---------------------------------------------------------------------------

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const lang = await resolveLang(searchParams);
  return {
    title: pickLabel(labels.title, lang),
    description: pickLabel(labels.intro, lang),
    alternates: { canonical: "/houston" },
  };
}

export default async function HoustonPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const lang = await resolveLang(searchParams);

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-neutral-950">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          {pickLabel(labels.eyebrow, lang)}
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
          {pickLabel(labels.title, lang)}
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-600">
          {pickLabel(labels.intro, lang)}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {houstonAreaPages.map((page) => (
            <Link
              key={page.slug}
              href={`/houston/${page.slug}?lang=${lang}`}
              className="rounded-[1.5rem] border border-black/5 bg-white p-6 transition hover:border-black/10 hover:shadow-sm"
            >
              <h2 className="text-xl font-semibold tracking-tight">
                {pickLocalizedText(page.title, lang)}
              </h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600">
                {pickLocalizedText(page.intro, lang)}
              </p>
              <div className="mt-5 text-sm font-medium underline underline-offset-4">
                {pickLabel(labels.openArea, lang)}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}