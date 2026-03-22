"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { getSiteLang } from "@/lib/i18n/getLang";
import { siteCopy } from "@/lib/i18n/siteCopy";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-white/80 transition hover:text-white"
    >
      {children}
    </Link>
  );
}

function HeaderButton({
  href,
  children,
  filled = false,
}: {
  href: string;
  children: ReactNode;
  filled?: boolean;
}) {
  return (
    <a
      href={href}
      className={
        filled
          ? "inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-medium text-neutral-900 transition hover:bg-white/90"
          : "inline-flex h-10 items-center justify-center rounded-full border border-white/20 px-4 text-sm font-medium text-white transition hover:border-white/35 hover:bg-white/5"
      }
    >
      {children}
    </a>
  );
}

function BrokerLogo() {
  return (
    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white ring-1 ring-black/5">
      <Image
        src="/broker/5th-stream-logo.png"
        alt="5th Stream Realty LLC"
        width={36}
        height={36}
        className="h-auto w-auto max-h-8 max-w-[36px] object-contain"
        priority
      />
    </div>
  );
}

function buildHref(
  pathname: string,
  searchParams: URLSearchParams,
  nextLang: "en" | "es" | "ar"
) {
  const params = new URLSearchParams(searchParams.toString());
  params.set("lang", nextLang);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function withLang(path: string, lang: "en" | "es" | "ar") {
  return `${path}?lang=${lang}`;
}

function LanguageLink({
  lang,
  pathname,
  searchParams,
  children,
}: {
  lang: "en" | "es" | "ar";
  pathname: string;
  searchParams: URLSearchParams;
  children: ReactNode;
}) {
  return (
    <Link
      href={buildHref(pathname, searchParams, lang)}
      className="inline-flex items-center rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white/85 transition hover:border-white/35 hover:bg-white/5 hover:text-white"
    >
      {children}
    </Link>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const rawSearchParams = useSearchParams();
  const searchParams = new URLSearchParams(rawSearchParams.toString());

  const lang = getSiteLang(rawSearchParams.get("lang"));
  const copy = siteCopy[lang];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#5f616a]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <BrokerLogo />

              <div className="min-w-0">
                <Link
                  href={withLang("/", lang)}
                  className="block truncate text-base font-semibold tracking-tight text-white md:text-lg"
                >
                  {copy.header.name}
                </Link>

                <p className="truncate text-xs text-white/70 md:text-sm">
                  {lang === "ar" ? (
                    <>
                      Texas REALTOR® | برعاية{" "}
                      <span dir="ltr">5th Stream Realty LLC</span>
                    </>
                  ) : (
                    "Texas REALTOR®"
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <LanguageLink
                lang="en"
                pathname={pathname}
                searchParams={searchParams}
              >
                EN
              </LanguageLink>

              <LanguageLink
                lang="es"
                pathname={pathname}
                searchParams={searchParams}
              >
                ES
              </LanguageLink>

              <LanguageLink
                lang="ar"
                pathname={pathname}
                searchParams={searchParams}
              >
                AR
              </LanguageLink>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <nav
              aria-label="Primary navigation"
              className="flex flex-wrap items-center gap-4 lg:gap-6"
            >
              <NavLink href={withLang("/rent", lang)}>{copy.nav.rent}</NavLink>
              <NavLink href={withLang("/buy", lang)}>{copy.nav.buy}</NavLink>
              <NavLink href={withLang("/sell", lang)}>{copy.nav.sell}</NavLink>
              <NavLink href={withLang("/landlords", lang)}>
                {copy.nav.landlords}
              </NavLink>
              <NavLink href={withLang("/about", lang)}>About</NavLink>
              <NavLink href={withLang("/intake", lang)}>Get Started</NavLink>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <HeaderButton href="tel:+17135053888">
                {copy.header.call}
              </HeaderButton>

              <HeaderButton href="mailto:info@lonestarliving.homes" filled>
                {copy.header.email}
              </HeaderButton>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}