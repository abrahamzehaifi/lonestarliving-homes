import IntakeClient from "./IntakeClient";
import { getPreferredSiteLang } from "@/lib/i18n/getLangServer";

type Language = "en" | "es" | "ar";
type Intent = "tenant" | "buyer" | "seller" | "landlord" | "other";

function coerceIntent(v?: string): Intent {
  const x = (v ?? "").trim().toLowerCase();

  if (
    x === "tenant" ||
    x === "buyer" ||
    x === "seller" ||
    x === "landlord"
  ) {
    return x;
  }

  return "other";
}

function cleanArea(v?: string) {
  const value = (v ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-\s]/g, "")
    .replace(/\s+/g, "-");

  return value || "";
}

function cleanSource(v?: string) {
  const value = (v ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");

  return value || "";
}

function cleanChannel(v?: string) {
  const value = (v ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");

  return value || "";
}

export default async function IntakePage({
  searchParams,
}: {
  searchParams?: Promise<{
    lang?: string;
    service?: string;
    type?: string;
    area?: string;
    src?: string;
    channel?: string;
  }>;
}) {
  const sp = (await searchParams) ?? {};

  const lang: Language = await getPreferredSiteLang(sp.lang);
  const intent = coerceIntent(sp.service ?? sp.type);
  const area = cleanArea(sp.area);
  const src = cleanSource(sp.src);
  const channel = cleanChannel(sp.channel);

  return (
    <IntakeClient
      lang={lang}
      intent={intent}
      area={area}
      src={src}
      channel={channel}
    />
  );
}