import { NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";

const encoder = new TextEncoder();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    const authSecret = process.env.OPS_AUTH_SECRET;
    const allowedEmail = process.env.OPS_ALLOWED_EMAIL;

    if (!token || !authSecret || !allowedEmail) {
      return NextResponse.redirect(new URL("/ops/login?error=invalid_link", url.origin));
    }

    const secret = encoder.encode(authSecret);

    const { payload } = await jwtVerify(token, secret);

    if (
      payload.purpose !== "ops_login" ||
      typeof payload.email !== "string" ||
      payload.email.toLowerCase() !== allowedEmail.toLowerCase()
    ) {
      return NextResponse.redirect(new URL("/ops/login?error=invalid_token", url.origin));
    }

    const sessionToken = await new SignJWT({
      email: allowedEmail,
      role: "ops",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(secret);

    const response = NextResponse.redirect(
      new URL("/ops/dashboard/crm", url.origin)
    );

    response.cookies.set("ops_session", sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch {
    const url = new URL(request.url);
    return NextResponse.redirect(new URL("/ops/login?error=expired_or_invalid", url.origin));
  }
}