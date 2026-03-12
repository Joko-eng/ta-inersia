import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  const role = token.role;

  if (
    pathname.startsWith("/dashboard") ||
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
  ],
};
