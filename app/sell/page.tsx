import Link from "next/link";
import type { Metadata } from "next";
import { getPreferredSiteLang } from "@/lib/i18n/getLangServer";

export const metadata: Metadata = {
  title: "Sell Your Houston Home | Abraham Zehaifi | 5th Stream Realty LLC",
  description:
    "Houston home selling guidance with pricing discipline, clear positioning, and structured execution. Brokered by 5th Stream Realty LLC.",
};

type Language = "en" | "es" | "ar";

type SellPageProps = {
  searchParams?: Promise<{
    lang?: string;
  }>;
};

const copy = {
  en: {
    eyebrow: "Sell",
    title: "Sell with pricing discipline and clear market positioning.",
    p1:
      "Serious sellers need realistic pricing, strong presentation, and a negotiation strategy grounded in actual buyer behavior. Vanity pricing wastes time, weakens momentum, and can damage the final outcome.",
    p2:
      "My role is to help structure the process from the beginning: review the market, evaluate competitive inventory, identify the right pricing band, position the property clearly, and manage the transaction through contract and closing with discipline.",
    p3:
      "Every property and seller situation is different. The right strategy depends on condition, timing, location, competition, and the level of urgency behind the sale.",
    primary: "Begin Seller Intake",
    secondary: "Ask a Question",
    legal:
      "Real estate services are provided by Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },

  es: {
    eyebrow: "Vender",
    title: "Venda con disciplina de precio y posicionamiento claro en el mercado.",
    p1:
      "Los vendedores serios necesitan precios realistas, buena presentación y una estrategia de negociación basada en el comportamiento real de los compradores. Los precios inflados desperdician tiempo y debilitan el resultado final.",
    p2:
      "Mi función es estructurar el proceso desde el inicio: analizar el mercado, evaluar inventario competitivo, identificar el rango de precio correcto, posicionar la propiedad y gestionar la transacción hasta el cierre.",
    p3:
      "Cada propiedad y cada vendedor es diferente. La estrategia correcta depende de la condición, el tiempo, la ubicación, la competencia y el nivel de urgencia de la venta.",
    primary: "Comenzar solicitud de venta",
    secondary: "Hacer una pregunta",
    legal:
      "Los servicios inmobiliarios son proporcionados por Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },

  ar: {
    eyebrow: "بيع",
    title: "بعقارك بانضباط في التسعير وتموضع واضح في السوق.",
    p1:
      "البائعون الجادون يحتاجون إلى تسعير واقعي وعرض قوي واستراتيجية تفاوض مبنية على سلوك المشترين الحقيقي. التسعير غير الواقعي يضيع الوقت ويضعف النتيجة النهائية.",
    p2:
      "دوري هو تنظيم العملية منذ البداية: تحليل السوق، تقييم المنافسة، تحديد نطاق السعر المناسب، وضع العقار في موقع واضح في السوق، وإدارة الصفقة حتى الإغلاق.",
    p3:
      "كل عقار وكل حالة بيع مختلفة. الاستراتيجية الصحيحة تعتمد على حالة العقار والتوقيت والموقع والمنافسة ومدى الاستعجال في البيع.",
    primary: "ابدأ طلب البيع",
    secondary: "اطرح سؤالاً",
    legal:
      "تُقدَّم الخدمات العقارية من قبل Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
  },
} as const;

export default async function SellPage({ searchParams }: SellPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const lang: Language = await getPreferredSiteLang(resolvedSearchParams.lang);
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
        {t.p1}
      </p>

      <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-600">
        {t.p2}
      </p>

      <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-600">
        {t.p3}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/intake?type=seller&lang=${lang}`}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          {t.primary}
        </Link>

        <Link
          href={`/contact?lang=${lang}`}
          className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-black/20 hover:bg-neutral-50"
        >
          {t.secondary}
        </Link>
      </div>

      <p className="mt-6 text-sm text-neutral-500">{t.legal}</p>
    </section>
  );
}