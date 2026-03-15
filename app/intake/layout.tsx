import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Request Guidance | LonestarLiving.homes",
  description:
    "Submit a structured Houston real estate request for rentals, relocation, buying, selling, or landlord guidance through LonestarLiving.homes.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function IntakeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}