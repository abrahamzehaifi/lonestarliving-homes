import IntakeClient from "./IntakeClient";
import { getPreferredSiteLang } from "@/lib/i18n/getLang";

type Language = "en" | "es" | "ar";
type Intent = "tenant" | "buyer" | "seller" | "landlord" | "other";
type Segment =
  | "medical_center"
  | "rice_student"
  | "relocation"
  | "apartment_locator"
  | "general"
  | "other";

function coerceIntent(v?: string): Intent {
  const x = (v ?? "").toLowerCase();
  if (
    x === "tenant" ||
    x === "buyer" ||
    x === "seller" ||
    x === "landlord"
  ) {
    return x;
  }
  return "other";
}

function coerceSegment(v?: string): Segment {
  const x = (v ?? "").toLowerCase();

  if (
    x === "medical_center" ||
    x === "rice_student" ||
    x === "relocation" ||
    x === "apartment_locator" ||
    x === "general"
  ) {
    return x;
  }

  return "other";
}

export default async function IntakePage({
  searchParams,
}: {
  searchParams?: Promise<{
    lang?: string;
    type?: string;
    segment?: string;
  }>;
}) {
  const sp = (await searchParams) ?? {};
  const lang: Language = await getPreferredSiteLang(sp.lang);
  const intent = coerceIntent(sp.type);
  const segment = coerceSegment(sp.segment);

  return <IntakeClient lang={lang} intent={intent} segment={segment} />;
}