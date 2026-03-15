"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
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
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white ring-1 ring-black/5">
      <Image
        src="/broker/5th-stream-logo.png"
        alt="5th Stream Realty LLC"
        width={44}
        height={44}
        className="h-auto w-auto max-h-10 max-w-[44px] object-contain"
        priority
      />
    </div>
  );
}

function LanguageLink({
  lang,
  children,
}: {
  lang: "en" | "es" | "ar";
  children: ReactNode;
}) {
  return (
    <Link
      href={`/?lang=${lang}`}
      className="inline-flex items-center rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white/85 transition hover:border-white/35 hover:bg-white/5 hover:text-white"
    >
      {children}
    </Link>
  );
}

export default function SiteHeader() {
  const searchParams = useSearchParams();
  const lang = getSiteLang(searchParams.get("lang"));
  const copy = siteCopy[lang];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#5f616a]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
        <div className="flex flex-col gap-4">

          {/* Top Row */}
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

            <div className="flex min-w-0 items-center gap-3">
              <BrokerLogo />

              <div className="min-w-0">
                <Link
                  href={`/?lang=${lang}`}
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
                    copy.header.title
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <LanguageLink lang="en">EN</LanguageLink>
              <LanguageLink lang="es">ES</LanguageLink>
              <LanguageLink lang="ar">AR</LanguageLink>
            </div>

          </div>

          {/* Navigation Row */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <nav
              aria-label="Primary navigation"
              className="flex flex-wrap items-center gap-4 lg:gap-6"
            >
              <NavLink href={`/rent?lang=${lang}`}>{copy.nav.rent}</NavLink>

              <NavLink href={`/medical-center-housing?lang=${lang}`}>
                {copy.nav.medical}
              </NavLink>

              <NavLink href={`/rice-student-housing?lang=${lang}`}>
                {copy.nav.rice}
              </NavLink>

              <NavLink href={`/houston-relocation?lang=${lang}`}>
                {copy.nav.relocation}
              </NavLink>

              <NavLink href={`/buy?lang=${lang}`}>{copy.nav.buy}</NavLink>

              <NavLink href={`/sell?lang=${lang}`}>{copy.nav.sell}</NavLink>

              <NavLink href={`/landlords?lang=${lang}`}>
                {copy.nav.landlords}
              </NavLink>

              <NavLink href={`/intake?type=tenant&lang=${lang}`}>
                {copy.nav.apply}
              </NavLink>
            </nav>

            {/* Contact Section */}
            <div className="flex flex-wrap items-center gap-3">

              <div className="hidden text-right md:block">
                <p className="text-sm font-medium leading-tight text-white">
                  {copy.header.name}
                </p>
                <p className="text-xs text-white/70">Texas REALTOR®</p>
              </div>

              <HeaderButton href="tel:+17135053888">
                {copy.header.call}
              </HeaderButton>

              <HeaderButton href="mailto:zehaifirealty@gmail.com" filled>
                {copy.header.email}
              </HeaderButton>

            </div>

          </div>
        </div>
      </div>
    </header>
  );
}