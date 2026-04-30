import { NextResponse } from "next/server";

export default function middleware(req: Request & { nextUrl: URL; cookies: { has(name: string): boolean } }) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const hasSessionCookie =
    req.cookies.has("authjs.session-token") || req.cookies.has("__Secure-authjs.session-token");

  if (isAdminRoute && !isLoginPage && !hasSessionCookie) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", `${req.nextUrl.pathname}${req.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
