import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = token.role as "admin" | "project_manager" | "member";
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
    if (!["admin", "project_manager", "member"].includes(role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  if (
    pathname.startsWith("/kelola-proyek") ||
    pathname.startsWith("/proyek") ||
    pathname.startsWith("/team")
  ) {
    if (role !== "project_manager") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/kelola-proyek/:path*",
    "/proyek/:path*",
    "/team/:path*",
    "/profile/:path*",
  ],
};
