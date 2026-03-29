import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const encoder = new TextEncoder();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    const secret = process.env.OPS_AUTH_SECRET;
    const allowedEmail = process.env.OPS_ALLOWED_EMAIL;

    if (!token || !secret || !allowedEmail) {
      return NextResponse.redirect(new URL("/ops/login", req.url));
    }

    const { payload } = await jwtVerify(token, encoder.encode(secret), {
      issuer: "lonestarliving.ops",
      audience: "ops-dashboard",
    });

    if (
      payload.role !== "ops" ||
      typeof payload.email !== "string" ||
      payload.email.toLowerCase() !== allowedEmail.toLowerCase()
    ) {
      return NextResponse.redirect(new URL("/ops/login", req.url));
    }

    const res = NextResponse.redirect(
      new URL("/ops/dashboard/crm", req.url)
    );

    res.cookies.set("ops_session", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return NextResponse.redirect(new URL("/ops/login", req.url));
  }
}