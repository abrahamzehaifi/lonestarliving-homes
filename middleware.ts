import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login page
  if (pathname.startsWith("/ops/login")) {
    return NextResponse.next();
  }

  // Protect ops workspace
  if (pathname.startsWith("/ops")) {
    const cookie = req.cookies.get("sb-access-token");

    if (!cookie) {
      return NextResponse.redirect(new URL("/ops/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ops/:path*"],
};