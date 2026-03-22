import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Request Information | LonestarLiving.homes",
  description:
    "Contact LonestarLiving.homes to request guidance for renting, buying, selling, or leasing property in Houston.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function IntakeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}