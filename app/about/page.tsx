import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Abraham Zehaifi | 5th Stream Realty LLC",
  description:
    "Learn about Abraham Zehaifi, Houston real estate guidance, and multilingual support through 5th Stream Realty LLC.",
};

type Language = "en" | "es" | "ar";

type AboutPageProps = {
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
    eyebrow: "About",
    title:
      "Houston real estate guidance with clear strategy and steady execution.",
    bodyOne:
      "I work with buyers, sellers, landlords, and renters across Houston who want clear communication, realistic strategy, and a structured transaction process. The goal is straightforward: fewer surprises, stronger positioning, and a cleaner path to closing.",
    bodyTwo:
      "Many clients navigating Houston real estate prefer to communicate in the language they know best. Arabic, English, and Spanish communication are available when helpful for the transaction.",
    legal:
      "Real estate services are provided by Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },
  es: {
    eyebrow: "Acerca de",
    title:
      "Guía inmobiliaria en Houston con estrategia clara y ejecución constante.",
    bodyOne:
      "Trabajo con compradores, vendedores, propietarios e inquilinos en Houston que desean comunicación clara, estrategia realista y un proceso de transacción estructurado. El objetivo es directo: menos sorpresas, mejor posicionamiento y un camino más limpio hacia el cierre.",
    bodyTwo:
      "Muchos clientes que navegan el mercado inmobiliario de Houston prefieren comunicarse en el idioma que mejor dominan. La comunicación en árabe, inglés y español está disponible cuando sea útil para la transacción.",
    legal:
      "Los servicios inmobiliarios son proporcionados por Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },
  ar: {
    eyebrow: "نبذة",
    title: "إرشاد عقاري في هيوستن باستراتيجية واضحة وتنفيذ ثابت.",
    bodyOne:
      "أعمل مع المشترين والبائعين والمُلّاك والمستأجرين في هيوستن ممن يريدون تواصلًا واضحًا واستراتيجية واقعية وعملية صفقة منظمة. الهدف مباشر: مفاجآت أقل، وتموضع أقوى، ومسار أوضح نحو الإغلاق.",
    bodyTwo:
      "يفضل كثير من العملاء الذين يتعاملون مع سوق هيوستن العقاري التواصل باللغة التي يعرفونها بشكل أفضل. التواصل بالعربية والإنجليزية والإسبانية متاح عندما يكون ذلك مفيدًا للصفقة.",
    legal:
      "تُقدَّم الخدمات العقارية من قبل Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },
} as const;

export default async function AboutPage({ searchParams }: AboutPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const lang = getLanguage(resolvedSearchParams.lang);
  const t = copy[lang];
  const isArabic = lang === "ar";

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="mx-auto max-w-5xl px-6 py-20"
    >
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
        {t.eyebrow}
      </p>

      <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
        {t.title}
      </h1>

      <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-600">
        {t.bodyOne}
      </p>

      <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-600">
        {t.bodyTwo}
      </p>

      <p className="mt-6 text-sm text-neutral-500">{t.legal}</p>
    </section>
  );
}