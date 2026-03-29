"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { getSiteLang } from "@/lib/i18n/getLang";
import { siteCopy } from "@/lib/i18n/siteCopy";

function BrokerLogo() {
  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white ring-1 ring-black/5">
      <Image
        src="/broker/5th-stream-logo.png"
        alt="5th Stream Realty LLC"
        width={44}
        height={44}
        className="h-auto w-auto max-h-10 max-w-[44px] object-contain"
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

function FooterLanguageLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-black/20 hover:text-neutral-950"
    >
      {children}
    </Link>
  );
}

export default function SiteFooter() {
  const pathname = usePathname();
  const rawSearchParams = useSearchParams();
  const lang = getSiteLang(rawSearchParams.get("lang"));
  const copy = siteCopy[lang];

  return (
    <footer className="border-t border-black/5 bg-[#efefec]">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <BrokerLogo />
              <div>
                <h3 className="text-base font-semibold">{copy.header.name}</h3>
                <p className="text-sm text-neutral-600">{copy.header.title}</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-neutral-600">
              {copy.footer.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <FooterLanguageLink
                href={buildHref(pathname, rawSearchParams, "en")}
              >
                {copy.footer.english}
              </FooterLanguageLink>

              <FooterLanguageLink
                href={buildHref(pathname, rawSearchParams, "es")}
              >
                {copy.footer.spanish}
              </FooterLanguageLink>

              <FooterLanguageLink
                href={buildHref(pathname, rawSearchParams, "ar")}
              >
                {copy.footer.arabic}
              </FooterLanguageLink>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold">{copy.footer.contact}</h3>

            <div className="mt-3 space-y-2 text-sm text-neutral-600">
              <p>Abraham Zehaifi, Texas REALTOR®</p>

              <p>
                <a
                  href="tel:+17135053888"
                  className="transition hover:text-black"
                >
                  +1 (713) 505-3888
                </a>
              </p>

              <p>
                <a
                  href="mailto:zehaifirealty@gmail.com"
                  className="transition hover:text-black"
                >
                  zehaifirealty@gmail.com
                </a>
              </p>

              <p>Houston, Texas</p>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold">{copy.footer.notices}</h3>

            <div className="mt-3 space-y-2 text-sm text-neutral-600">
              <a
                href="/legal/IABS.pdf"
                target="_blank"
                rel="noreferrer"
                className="block transition hover:text-black"
              >
                Information About Brokerage Services (IABS)
              </a>

              <a
                href="/legal/consumer-protection-notice.pdf"
                target="_blank"
                rel="noreferrer"
                className="block transition hover:text-black"
              >
                TREC Consumer Protection Notice
              </a>

              <p>Equal Housing Opportunity</p>
            </div>

            <div className="mt-5 border-t border-black/5 pt-4 text-[11px] leading-5 text-neutral-500">
              <p className="font-medium text-neutral-600">
                {copy.footer.brokerInfo}
              </p>

              <p>5th Stream Realty LLC</p>
              <p>(214) 868-0707</p>
              <p>
                <a
                  href="https://5thstream.com"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-black"
                >
                  5thstream.com
                </a>
              </p>
              <p>7941 Katy Fwy #787, Houston, TX 77024</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-black/5 pt-6 text-sm text-neutral-500">
          © 2026 5th Stream Realty LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}