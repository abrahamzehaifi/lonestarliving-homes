export function buildHref(
  pathname: string,
  query: Record<string, string | null | undefined> = {},
  lang = "en"
) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (typeof value === "string" && value.trim()) {
      params.set(key, value.trim().toLowerCase());
    }
  });

  if (!params.has("lang")) {
    params.set("lang", lang);
  }

  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}