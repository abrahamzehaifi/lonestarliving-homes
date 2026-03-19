export type SiteLang = "en" | "es" | "ar";

export function getSiteLang(value?: string | null): SiteLang {
  if (value === "es" || value === "ar") return value;
  return "en";
}