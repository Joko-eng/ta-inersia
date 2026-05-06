import { isRateLimited } from "@/lib/ratelimit";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

type Role = "admin" | "project_manager" | "member";

const PROTECTED_ROUTES: Record<string, Role[]> = {
  "/dashboard":     ["admin", "project_manager", "member"],
  "/profile":       ["admin", "project_manager", "member"],
  "/kelola-proyek": ["project_manager"],
  "/proyek":        ["project_manager"],
  "/team":          ["project_manager"],
};

function getAllowedRoles(pathname: string): Role[] | null {
  for (const [route, roles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) return roles;
  }
  return null;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/api/auth/signin" && req.method === "POST") {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

    if (await isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Terlalu banyak percobaan login. Coba lagi besok." },
        { status: 429 }
      );
    }
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const allowedRoles = getAllowedRoles(pathname);

  if (allowedRoles) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = token.role as Role;

    if (!allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/api/auth/signin",
    "/dashboard/:path*",
    "/profile/:path*",
    "/kelola-proyek/:path*",
    "/proyek/:path*",
    "/team/:path*",
  ],
};