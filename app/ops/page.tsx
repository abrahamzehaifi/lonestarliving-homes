import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function OpsPage(): never {
  redirect("/ops/today");
}