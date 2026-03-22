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
      "Reach out to discuss buying, selling, renting, or leasing in Houston. Early conversations focus on your goals, timing, budget, and the next step that makes the most sense for your situation.",
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
      "Comuníquese para hablar sobre compra, venta, renta o arrendamiento en Houston. Las conversaciones iniciales se centran en sus objetivos, tiempo, presupuesto y el siguiente paso más adecuado para su situación.",
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
      "تواصل لمناقشة الشراء أو البيع أو الاستئجار أو التأجير في هيوستن. تركز المحادثات الأولية على الأهداف والتوقيت والميزانية والخطوة التالية الأنسب لحالتك.",
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
              href="mailto:info@lonestarliving.homes"
              className="transition hover:text-black hover:underline"
            >
              info@lonestarliving.homes
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