import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import VisitTracker from "@/components/site/VisitTracker";
import "./globals.css";

export const metadata: Metadata = {
  title: "Houston Real Estate | Abraham Zehaifi | 5th Stream Realty LLC",
  description:
    "Houston real estate guidance for rentals, relocation, buyers, sellers, landlords, Texas Medical Center housing, and Rice University student housing. Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
};

function HeaderFallback() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#5f616a]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
        <div className="flex min-h-[72px] items-center justify-between">
          <div className="text-sm font-medium text-white">Abraham Zehaifi</div>
          <div className="text-xs text-white/70">Loading...</div>
        </div>
      </div>
    </header>
  );
}

function FooterFallback() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-neutral-500">
        Loading footer...
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f5f5f3] text-neutral-900 antialiased">
        <div className="min-h-screen">
          <Suspense fallback={<HeaderFallback />}>
            <SiteHeader />
          </Suspense>

          <main>{children}</main>

          <Suspense fallback={<FooterFallback />}>
            <SiteFooter />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <VisitTracker />
        </Suspense>
      </body>
    </html>
  );
}