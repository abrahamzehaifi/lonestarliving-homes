"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { getLanguage, languages } from "../lib/i18n/translations";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLang = searchParams.get("lang");
  const activeLang = getLanguage(currentLang);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {languages.map((item) => {
        const isActive = item.code === activeLang;

        const params = new URLSearchParams(searchParams.toString());
        params.set("lang", item.code);

        const href = `${pathname}?${params.toString()}`;

        return (
          <Link
            key={item.code}
            href={href}
            className={[
              "inline-flex items-center rounded-full border px-3 py-1.5 transition",
              isActive
                ? "border-neutral-950 bg-neutral-950 text-white"
                : "border-neutral-300 text-neutral-700 hover:border-neutral-500 hover:text-neutral-950",
            ].join(" ")}
            hrefLang={item.code}
            lang={item.code}
          >
            {item.shortLabel}
          </Link>
        );
      })}
    </div>
  );
}