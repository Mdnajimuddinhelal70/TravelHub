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

export const authRoutes = ["/login", "/register", "/forgot-password"];

export const commonProtectedRoutes: RouteConfig = {
  exact: ["/my-profile", "/settings", "/change-password", "/reset-password"],
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
  // Allow only safe, local paths.
  if (
    !redirectPath.startsWith("/") ||
    redirectPath.startsWith("//") ||
    redirectPath.includes("\\")
  ) {
    return false;
  }

  // Allow the public homepage.
  if (redirectPath === "/") {
    return true;
  }

  const routeOwner = getRouteOwner(redirectPath);

  // Unknown paths and authentication pages are not accepted.
  if (routeOwner === null) {
    return false;
  }

  // Common protected routes are available to authenticated roles.
  if (routeOwner === "COMMON") {
    return true;
  }

  // Role-specific paths are allowed only for their owner.
  return routeOwner === role;
};
