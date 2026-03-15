import Link from "next/link";

type Language = "en" | "es" | "ar";

type LandlordsPageProps = {
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
    eyebrow: "Landlords",
    title: "Leasing support for Houston property owners.",
    bodyOne:
      "Landlord representation is designed for owners who want a cleaner leasing process, stronger tenant positioning, and less vacancy. The focus is on organized marketing, timely communication, and disciplined execution from inquiry through lease signing.",
    bodyTwo:
      "Support may include rental pricing guidance, listing setup, showing coordination, applicant review, and transaction follow-through based on the property and leasing strategy.",
    primaryCta: "Begin Landlord Intake",
    secondaryCta: "Ask a Question",
    legal:
      "Real estate services are provided by Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },

  es: {
    eyebrow: "Propietarios",
    title: "Apoyo de arrendamiento para propietarios en Houston.",
    bodyOne:
      "La representación para propietarios está diseñada para quienes desean un proceso de arrendamiento más organizado, mejor posicionamiento de inquilinos y menos vacantes. El enfoque está en marketing organizado, comunicación oportuna y ejecución disciplinada desde la consulta hasta la firma del contrato.",
    bodyTwo:
      "El apoyo puede incluir orientación sobre precios de renta, preparación de la propiedad para el mercado, coordinación de visitas, revisión de solicitantes y seguimiento de la transacción según la propiedad y la estrategia de arrendamiento.",
    primaryCta: "Comenzar solicitud para propietarios",
    secondaryCta: "Hacer una pregunta",
    legal:
      "Los servicios inmobiliarios son proporcionados por Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },

  ar: {
    eyebrow: "المُلّاك",
    title: "دعم تأجير لأصحاب العقارات في هيوستن.",
    bodyOne:
      "تمثيل المُلّاك مخصص لأصحاب العقارات الذين يريدون عملية تأجير أكثر تنظيمًا وتموضعًا أفضل للمستأجرين وتقليل فترات الشغور. يركز العمل على تسويق منظم وتواصل واضح وتنفيذ منضبط من الاستفسار حتى توقيع عقد الإيجار.",
    bodyTwo:
      "قد يشمل الدعم إرشادات تسعير الإيجار، وتجهيز العقار للتسويق، وتنسيق الجولات، ومراجعة طلبات المستأجرين، ومتابعة الصفقة حتى اكتمالها حسب العقار واستراتيجية التأجير.",
    primaryCta: "ابدأ طلب المالك",
    secondaryCta: "اطرح سؤالاً",
    legal:
      "تُقدَّم الخدمات العقارية من قبل Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },
} as const;

export default async function LandlordsPage({
  searchParams,
}: LandlordsPageProps) {
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

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/intake?type=landlord&segment=general&lang=${lang}`}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          {t.primaryCta}
        </Link>

        <Link
          href={`/contact?lang=${lang}`}
          className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-black/20 hover:bg-neutral-50"
        >
          {t.secondaryCta}
        </Link>
      </div>

      <p className="mt-6 text-sm text-neutral-500">{t.legal}</p>
    </section>
  );
}