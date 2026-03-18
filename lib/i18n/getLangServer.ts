import { cookies } from "next/headers";
import type { SiteLang } from "./getLang";

export async function getPreferredSiteLang(
  searchParamLang?: string | null
): Promise<SiteLang> {
  if (searchParamLang === "es" || searchParamLang === "ar") {
    return searchParamLang;
  }

  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("site_lang")?.value;

  if (cookieLang === "es" || cookieLang === "ar") {
    return cookieLang as SiteLang;
  }

  return "en";
}
