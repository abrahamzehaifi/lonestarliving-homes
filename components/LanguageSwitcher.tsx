"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getLanguage, languages } from "@/lib/i18n/translations";

const LANG_COOKIE = "site_lang";
const ONE_YEAR = 60 * 60 * 24 * 365;

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLang = searchParams.get("lang");
  const activeLang = getLanguage(currentLang);

  function switchLanguage(nextLang: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", nextLang);

    document.cookie = `${LANG_COOKIE}=${nextLang}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;

    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;

    router.replace(nextUrl, { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {languages.map((item) => {
        const isActive = item.code === activeLang;

        return (
          <button
            key={item.code}
            type="button"
            onClick={() => switchLanguage(item.code)}
            className={[
              "inline-flex items-center rounded-full border px-3 py-1.5 transition",
              isActive
                ? "border-neutral-950 bg-neutral-950 text-white"
                : "border-neutral-300 text-neutral-700 hover:border-neutral-500 hover:text-neutral-950",
            ].join(" ")}
          >
            {item.shortLabel}
          </button>
        );
      })}
    </div>
  );
}