function isValidLang(value: string | null | undefined): value is SiteLang {
  return value === "en" || value === "es" || value === "ar";
}

export async function getPreferredSiteLang(
  searchParamLang?: string | null
): Promise<SiteLang> {
  if (isValidLang(searchParamLang)) {
    return searchParamLang;
  }

  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("site_lang")?.value;

  return getSiteLang(cookieLang);
}