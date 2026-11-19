export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER" | "GUIDE";

export type RouteConfig = {
  exact: string[];
  patterns: RegExp[];
};

export const isUserRole = (role: unknown): role is UserRole => {
  return (
    role === "SUPER_ADMIN" ||
    role === "ADMIN" ||
    role === "USER" ||
    role === "GUIDE"
  );
};

// Public authentication routes
export const authRoutes = ["/login", "/register", "/reset-password"];

export const commonProtectedRoutes: RouteConfig = {
  exact: ["/my-profile", "/settings", "/change-password"],
  patterns: [],
};

export const superAdminProtectedRoutes: RouteConfig = {
  exact: [],
  patterns: [/^\/super-admin(?:\/|$)/],
};

export const adminProtectedRoutes: RouteConfig = {
  exact: [],
  patterns: [/^\/admin(?:\/|$)/],
};

export const userProtectedRoutes: RouteConfig = {
  exact: [],
  patterns: [/^\/dashboard(?:\/|$)/],
};

export const guideProtectedRoutes: RouteConfig = {
  exact: [],
  patterns: [/^\/guide(?:\/|$)/],
};

export const isAuthRoute = (pathname: string): boolean => {
  return authRoutes.includes(pathname);
};

export const isRouteMatches = (
  pathname: string,
  routes: RouteConfig,
): boolean => {
  if (routes.exact.includes(pathname)) {
    return true;
  }

  return routes.patterns.some((pattern) => pattern.test(pathname));
};

export const getRouteOwner = (pathname: string): UserRole | "COMMON" | null => {
  if (isRouteMatches(pathname, superAdminProtectedRoutes)) {
    return "SUPER_ADMIN";
  }

  if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return "ADMIN";
  }

  if (isRouteMatches(pathname, userProtectedRoutes)) {
    return "USER";
  }

  if (isRouteMatches(pathname, guideProtectedRoutes)) {
    return "GUIDE";
  }

  if (isRouteMatches(pathname, commonProtectedRoutes)) {
    return "COMMON";
  }

  return null;
};

export const getDefaultDashboardRoute = (role: UserRole): string => {
  const dashboardRoutes: Record<UserRole, string> = {
    SUPER_ADMIN: "/super-admin/dashboard",
    ADMIN: "/admin/dashboard",
    USER: "/dashboard",
    GUIDE: "/guide/dashboard",
  };

  return dashboardRoutes[role];
};

export const isValidRedirectForRole = (
  redirectPath: string,
  role: UserRole,
): boolean => {
  if (
    !redirectPath.startsWith("/") ||
    redirectPath.startsWith("//") ||
    redirectPath.includes("\\")
  ) {
    return false;
  }

  if (redirectPath === "/") return true;

  if (isAuthRoute(redirectPath)) return false;

  const routeOwner = getRouteOwner(redirectPath);

  if (routeOwner === null) {
    return (
      redirectPath.startsWith("/tours") ||
      redirectPath.startsWith("/destination") ||
      redirectPath.startsWith("/about") ||
      redirectPath.startsWith("/contact")
    );
  }

  if (routeOwner === "COMMON") return true;

  if (role === "SUPER_ADMIN" && routeOwner === "ADMIN") return true;

  return routeOwner === role;
};
