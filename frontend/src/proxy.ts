import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  isUserRole,
  UserRole,
} from "./lib/auth-utils";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value ?? null;

  let userRole: UserRole | null = null;
  let invalidToken = false;

  if (accessToken) {
    try {
      const secret = process.env.JWT_ACCESS_SECRET;

      if (!secret) {
        throw new Error("JWT_ACCESS_SECRET is not configured.");
      }

      const decoded = jwt.verify(accessToken, secret) as JwtPayload;

      if (!isUserRole(decoded.role)) {
        invalidToken = true;
      } else {
        userRole = decoded.role;
      }
    } catch {
      invalidToken = true;
    }
  }

  const clearInvalidCookies = (response: NextResponse) => {
    if (invalidToken) {
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
    }

    return response;
  };

  const routeOwner = getRouteOwner(pathname);
  const isAuth = isAuthRoute(pathname);

  // Authenticated users should not return to login/register pages.
  if (userRole && isAuth) {
    return clearInvalidCookies(
      NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole), request.url),
      ),
    );
  }

  // Public routes remain accessible, even if an old token is invalid.
  if (routeOwner === null) {
    return clearInvalidCookies(NextResponse.next());
  }

  // Protected routes require a valid token with a recognized role.
  if (!userRole) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);

    return clearInvalidCookies(NextResponse.redirect(loginUrl));
  }

  // Common protected routes are available to every authenticated role.
  if (routeOwner === "COMMON") {
    return NextResponse.next();
  }

  // Users can access only the routes assigned to their role.
  if (routeOwner !== userRole) {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(userRole), request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
