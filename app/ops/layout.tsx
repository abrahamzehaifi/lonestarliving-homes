import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function OpsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}