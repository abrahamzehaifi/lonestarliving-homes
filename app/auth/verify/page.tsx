import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const encoder = new TextEncoder();

export default async function VerifyPage({
  searchParams,
}: {
  searchParams?: Promise<{ token?: string }> | { token?: string };
}) {
  const resolvedSearchParams =
    searchParams instanceof Promise ? await searchParams : searchParams;

  const token = resolvedSearchParams?.token;
  if (!token) {
    redirect("/ops/login");
  }

  const secret = process.env.OPS_AUTH_SECRET;
  if (!secret) {
    redirect("/ops/login");
  }

  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret));

    if (payload.purpose !== "ops_login") {
      redirect("/ops/login");
    }

    const cookieStore = await cookies();

    cookieStore.set("ops_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    redirect("/ops");
  } catch {
    redirect("/ops/login");
  }
}