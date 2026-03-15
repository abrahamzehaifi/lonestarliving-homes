import type { ReactNode } from "react";

type Language = "en" | "es" | "ar";

type ContactPageProps = {
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
    eyebrow: "Contact",
    title: "Contact Abraham Zehaifi",
    body:
      "Reach out to discuss buying, selling, leasing, landlord representation, or relocation in Houston. Clear communication, realistic strategy, and structured execution matter from the start. Initial conversations are focused on goals, timing, budget, and next steps.",
    agent: "Agent",
    email: "Email",
    phone: "Phone",
    brokerage: "Brokerage",
    serviceArea: "Service Area",
    city: "Houston, Texas",
  },

  es: {
    eyebrow: "Contacto",
    title: "Contactar a Abraham Zehaifi",
    body:
      "Comuníquese para hablar sobre compra, venta, renta, representación de propietarios o reubicación en Houston. La comunicación clara, la estrategia realista y la ejecución estructurada son importantes desde el principio. Las conversaciones iniciales se centran en objetivos, tiempo, presupuesto y próximos pasos.",
    agent: "Agente",
    email: "Correo electrónico",
    phone: "Teléfono",
    brokerage: "Correduría",
    serviceArea: "Área de servicio",
    city: "Houston, Texas",
  },

  ar: {
    eyebrow: "اتصال",
    title: "التواصل مع Abraham Zehaifi",
    body:
      "تواصل لمناقشة شراء أو بيع أو استئجار أو تمثيل الملاك أو الانتقال إلى هيوستن. التواصل الواضح والاستراتيجية الواقعية والتنفيذ المنظم مهمان منذ البداية. تركز المحادثات الأولية على الأهداف والتوقيت والميزانية والخطوات التالية.",
    agent: "الوكيل",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    brokerage: "الوساطة العقارية",
    serviceArea: "منطقة الخدمة",
    city: "هيوستن، تكساس",
  },
} as const;

export default async function ContactPage({ searchParams }: ContactPageProps) {
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
        {t.body}
      </p>

      <div className="mt-8 rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm">
        <address className="not-italic">
          <p className="text-sm text-neutral-600">{t.agent}</p>
          <p className="mt-1 text-lg font-medium">
            Abraham Zehaifi, Texas REALTOR®
          </p>

          <p className="mt-6 text-sm text-neutral-600">{t.email}</p>
          <p className="mt-1 text-lg font-medium">
            <a
              href="mailto:zehaifirealty@gmail.com"
              className="transition hover:text-black hover:underline"
            >
              zehaifirealty@gmail.com
            </a>
          </p>

          <p className="mt-6 text-sm text-neutral-600">{t.phone}</p>
          <p className="mt-1 text-lg font-medium">
            <a
              href="tel:+17135053888"
              className="transition hover:text-black hover:underline"
            >
              +1 (713) 505-3888
            </a>
          </p>

          <p className="mt-6 text-sm text-neutral-600">{t.brokerage}</p>
          <p className="mt-1 text-lg font-medium">5th Stream Realty LLC</p>

          <p className="mt-6 text-sm text-neutral-600">{t.serviceArea}</p>
          <p className="mt-1 text-lg font-medium">{t.city}</p>
        </address>
      </div>
    </section>
  );
}