import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request received | Rental Request",
  description: "Thank you. Next steps for your rental request.",
};

type Language = "en" | "es" | "ar";

type RentThanksPageProps = {
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
    eyebrow: "Request received",
    title: "Thank you.",
    body:
      "Your rental request has been received. I’ll review your criteria and typically follow up the same day based on your budget, timing, and qualification profile.",
    helpTitle: "To help move quickly",
    helpItems: [
      "Have proof of income or employment ready",
      "Keep identification available for applications",
      "Respond promptly when I follow up",
    ],
    call: "Call Abraham",
    text: "Send a Text",
    back: "Return to rentals",
    emailNote: "Prefer email? Use the contact options listed on the site.",
    legal:
      "Real estate services are provided by Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC. This page is informational and does not by itself create an agency relationship.",
  },

  es: {
    eyebrow: "Solicitud recibida",
    title: "Gracias.",
    body:
      "Su solicitud de renta ha sido recibida. Revisaré sus criterios y normalmente daré seguimiento el mismo día según su presupuesto, tiempo y perfil de calificación.",
    helpTitle: "Para avanzar con más rapidez",
    helpItems: [
      "Tenga lista prueba de ingresos o empleo",
      "Mantenga identificación disponible para solicitudes",
      "Responda con rapidez cuando le dé seguimiento",
    ],
    call: "Llamar a Abraham",
    text: "Enviar texto",
    back: "Volver a rentas",
    emailNote: "¿Prefiere correo electrónico? Use las opciones de contacto del sitio.",
    legal:
      "Los servicios inmobiliarios son proporcionados por Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC. Esta página es informativa y no crea por sí sola una relación de agencia.",
  },

  ar: {
    eyebrow: "تم استلام الطلب",
    title: "شكرًا.",
    body:
      "تم استلام طلب الإيجار الخاص بك. سأراجع معاييرك وعادةً أتابع في نفس اليوم بناءً على الميزانية والتوقيت وملف الجاهزية.",
    helpTitle: "للمساعدة في التحرك بسرعة",
    helpItems: [
      "جهّز إثبات الدخل أو العمل",
      "احتفظ بالهوية جاهزة للتقديمات",
      "استجب بسرعة عند المتابعة معك",
    ],
    call: "اتصل بـ Abraham",
    text: "أرسل رسالة",
    back: "العودة إلى الإيجارات",
    emailNote: "تفضل البريد الإلكتروني؟ استخدم خيارات التواصل الموجودة على الموقع.",
    legal:
      "تُقدَّم الخدمات العقارية من قبل Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC. هذه الصفحة معلوماتية ولا تنشئ بحد ذاتها علاقة وكالة.",
  },
} as const;

export default function RentThanksPage({
  searchParams,
}: RentThanksPageProps) {
  const lang = getLanguage(searchParams?.lang);
  const t = copy[lang];
  const isArabic = lang === "ar";

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="mx-auto max-w-2xl px-6 py-16"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          {t.eyebrow}
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          {t.title}
        </h1>

        <p className="mt-3 text-slate-700">{t.body}</p>

        <div className="mt-8 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">
              {t.helpTitle}
            </div>

            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {t.helpItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <a
              href="tel:+17135053888"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {t.call}
            </a>

            <a
              href="sms:+17135053888"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              {t.text}
            </a>

            <Link
              href={`/rentals?lang=${lang}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              {t.back}
            </Link>
          </div>
        </div>

        <div className="mt-6 text-sm text-slate-600">{t.emailNote}</div>

        <p className="mt-8 text-xs text-slate-500">{t.legal}</p>
      </div>
    </main>
  );
}