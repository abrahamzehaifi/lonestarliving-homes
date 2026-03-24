import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const encoder = new TextEncoder();

async function hasValidOpsSession(req: NextRequest) {
  try {
    const token = req.cookies.get("ops_session")?.value;
    const secret = process.env.OPS_AUTH_SECRET;
    const allowedEmail = process.env.OPS_ALLOWED_EMAIL;

    if (!token || !secret || !allowedEmail) return false;

    const { payload } = await jwtVerify(token, encoder.encode(secret));

    return (
      payload.role === "ops" &&
      typeof payload.email === "string" &&
      payload.email.toLowerCase() === allowedEmail.toLowerCase()
    );
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/ops")) {
    return NextResponse.next();
  }

  if (pathname === "/ops/login") {
    const valid = await hasValidOpsSession(req);
    if (valid) {
      return NextResponse.redirect(
        new URL("/ops/dashboard/crm", req.url)
      );
    }
    return NextResponse.next();
  }

  const valid = await hasValidOpsSession(req);

  if (!valid) {
    return NextResponse.redirect(
      new URL("/ops/login", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ops/:path*"],
};
