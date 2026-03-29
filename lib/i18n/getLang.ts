export function getSiteLang(value?: string | null): SiteLang {
  const v = value?.trim().toLowerCase();
  if (v === "es" || v === "ar") return v;
  return "en";
}