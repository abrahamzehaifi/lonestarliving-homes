import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | LonestarLiving.homes",
  description:
    "Learn about Abraham Zehaifi and real estate services in Houston through LonestarLiving.homes.",
};

type Language = "en" | "es" | "ar";

type AboutPageProps = {
  searchParams?: {
    lang?: string;
  };
};

function getLanguage(value?: string): Language {
  if (value === "es" || value === "ar") return value;
  return "en";
}

const copy = {
  en: {
    eyebrow: "About",
    title: "Real estate representation in Houston with a calm, clear approach.",
    bodyOne:
      "I work with clients across Houston who want thoughtful guidance, clear communication, and dependable support throughout the buying, selling, or leasing process.",
    bodyTwo:
      "Arabic, English, and Spanish communication are available when helpful, making it easier for clients and families to move forward with clarity and confidence.",
    legal:
      "Real estate services are provided by Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },
  es: {
    eyebrow: "Acerca de",
    title:
      "Representación inmobiliaria en Houston con un enfoque tranquilo y claro.",
    bodyOne:
      "Trabajo con clientes en todo Houston que desean orientación considerada, comunicación clara y apoyo confiable durante el proceso de compra, venta o arrendamiento.",
    bodyTwo:
      "La comunicación en árabe, inglés y español está disponible cuando sea útil, lo que facilita que los clientes y sus familias avancen con claridad y confianza.",
    legal:
      "Los servicios inmobiliarios son proporcionados por Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },
  ar: {
    eyebrow: "نبذة",
    title: "تمثيل عقاري في هيوستن بأسلوب هادئ وواضح.",
    bodyOne:
      "أعمل مع العملاء في أنحاء هيوستن ممن يريدون إرشادًا مدروسًا، وتواصلًا واضحًا، ودعمًا موثوقًا خلال عملية الشراء أو البيع أو التأجير.",
    bodyTwo:
      "التواصل بالعربية والإنجليزية والإسبانية متاح عند الحاجة، مما يساعد العملاء وعائلاتهم على المضي قدمًا بوضوح وثقة.",
    legal:
      "تُقدَّم الخدمات العقارية من قبل Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },
} as const;

export default function AboutPage({ searchParams }: AboutPageProps) {
  const lang = getLanguage(searchParams?.lang);
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