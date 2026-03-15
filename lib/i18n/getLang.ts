export type SiteLang = "en" | "es" | "ar";

export function getSiteLang(value: string | null | undefined): SiteLang {
  if (value === "es") return "es";
  if (value === "ar") return "ar";
  return "en";
}