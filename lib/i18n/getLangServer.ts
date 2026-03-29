import { cookies } from "next/headers";
import type { SiteLang } from "./getLang";

export async function getPreferredSiteLang(
  searchParamLang?: string | null
): Promise<SiteLang> {
  const normalizedParam = searchParamLang?.toLowerCase();

  if (normalizedParam === "es" || normalizedParam === "ar") {
    return normalizedParam;
  }

  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("site_lang")?.value?.toLowerCase();

  if (cookieLang === "es" || cookieLang === "ar") {
    return cookieLang as SiteLang;
  }

  return "en";
}