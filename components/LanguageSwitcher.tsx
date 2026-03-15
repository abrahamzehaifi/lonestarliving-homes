import Link from "next/link";
import { getLanguage, languages } from "../lib/i18n/translations";

type Props = {
  currentPath: string;
  currentLang?: string | null;
  extraQuery?: Record<string, string | undefined>;
};

export default function LanguageSwitcher({
  currentPath,
  currentLang,
  extraQuery = {},
}: Props) {
  const activeLang = getLanguage(currentLang);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {languages.map((item) => {
        const isActive = item.code === activeLang;

        const params = new URLSearchParams();
        params.set("lang", item.code);

        Object.entries(extraQuery).forEach(([key, value]) => {
          if (typeof value === "string" && value.trim()) {
            params.set(key, value);
          }
        });

        return (
          <Link
            key={item.code}
            href={`${currentPath}?${params.toString()}`}
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