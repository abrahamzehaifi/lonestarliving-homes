import { getSiteLang, type SiteLang } from "@/lib/i18n/getLang";

function isValidLang(value: string | null | undefined): value is SiteLang {
  return value === "en" || value === "es" || value === "ar";
}

export function getPreferredSiteLang(value?: string | null): SiteLang {
  if (isValidLang(value)) {
    return value;
  }

  return getSiteLang(value);
}