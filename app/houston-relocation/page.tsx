import { Suspense } from "react";
import HoustonRelocationClient from "./HoustonRelocationClient";

type Language = "en" | "es" | "ar";

function getLanguage(value?: string): Language {
  if (value === "es" || value === "ar") return value;
  return "en";
}

export default function HoustonRelocationPage({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const lang = getLanguage(searchParams?.lang);

  return (
    <Suspense fallback={null}>
      <HoustonRelocationClient lang={lang} />
    </Suspense>
  );
}