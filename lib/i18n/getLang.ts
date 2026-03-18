import { cookies } from "next/headers";

export type SiteLang = "en" | "es" | "ar";

export function getSiteLang(value?: string | null): SiteLang {
  if (value === "es" || value === "ar") return value;
  return "en";
}

export async function getPreferredSiteLang(
  searchParamLang?: string | null
): Promise<SiteLang> {
  if (searchParamLang === "es" || searchParamLang === "ar") {
    return searchParamLang;
  }

  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("site_lang")?.value;

  if (cookieLang === "es" || cookieLang === "ar") {
    return cookieLang;
  }

  return "en";
}