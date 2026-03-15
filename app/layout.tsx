import type { Metadata } from "next";
import type { ReactNode } from "react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import VisitTracker from "@/components/site/VisitTracker";
import "./globals.css";

export const metadata: Metadata = {
  title: "Houston Real Estate | Abraham Zehaifi | 5th Stream Realty LLC",
  description:
    "Houston real estate guidance for rentals, relocation, buyers, sellers, landlords, Texas Medical Center housing, and Rice University student housing. Abraham Zehaifi, Texas REALTOR®, brokered by 5th Stream Realty LLC.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f5f5f3] text-neutral-900 antialiased">
        <div className="min-h-screen">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>

        <VisitTracker />
      </body>
    </html>
  );
}