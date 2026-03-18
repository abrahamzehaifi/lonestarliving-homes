import HoustonRelocationClient from "./HoustonRelocationClient";
import { getPreferredSiteLang } from "@/lib/i18n/getLang";

type Language = "en" | "es" | "ar";

export default async function HoustonRelocationPage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const lang: Language = await getPreferredSiteLang(sp.lang);

  return <HoustonRelocationClient lang={lang} />;
}