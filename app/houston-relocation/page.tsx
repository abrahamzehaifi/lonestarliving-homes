import HoustonRelocationClient from "./HoustonRelocationClient";
import { getPreferredSiteLang } from "@/lib/i18n/getLangServer";

type Language = "en" | "es" | "ar";

export default async function HoustonRelocationPage({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const lang: Language = await getPreferredSiteLang(searchParams?.lang);

  return <HoustonRelocationClient lang={lang} />;
}