import { NavSection } from "@/types/dashboard.interface";
import { getDefaultDashboardRoute, UserRole } from "./auth-utils";

export const getCommonNavItems = (role: UserRole): NavSection[] => [
  {
    items: [
      {
        title: "Visit Website",
        href: "/",
        icon: "Home",
        roles: ["SUPER_ADMIN", "ADMIN", "USER", "GUIDE"],
      },
      {
        title: "Dashboard",
        href: getDefaultDashboardRoute(role),
        icon: "LayoutDashboard",
        roles: [role],
      },
      {
        title: "My Profile",
        href: "/dashboard/my-profile",
        icon: "User",
        roles: ["SUPER_ADMIN", "ADMIN", "USER", "GUIDE"],
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Change Password",
        href: "/dashboard/change-password",
        icon: "Settings",
        roles: ["SUPER_ADMIN", "ADMIN", "USER", "GUIDE"],
      },
    ],
  },
];

export const userNavItems: NavSection[] = [
  {
    title: "My Travel",
    items: [
      {
        title: "My Bookings",
        href: "/dashboard/my-bookings",
        icon: "Calendar",
        roles: ["USER"],
      },
      {
        title: "Payment History",
        href: "/dashboard/payment-history",
        icon: "CreditCard",
        roles: ["USER"],
      },
      {
        title: "My Profile",
        href: "/dashboard/my-profile",
        icon: "User",
        roles: ["USER"],
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: "Settings",
        roles: ["USER"],
      },
      {
        title: "Support",
        href: "/dashboard/support",
        icon: "MessageCircle",
        roles: ["USER"],
      },
    ],
  },
];

export const adminNavItems: NavSection[] = [
  {
    title: "Management",
    items: [
      {
        title: "Users",
        href: "/admin/dashboard/user-management",
        icon: "Users",
        roles: ["ADMIN"],
      },
      {
        title: "Tours",
        href: "/admin/dashboard/tour-management",
        icon: "Map",
        roles: ["ADMIN"],
      },
      {
        title: "Bookings",
        href: "/admin/dashboard/booking-management",
        icon: "Calendar",
        roles: ["ADMIN"],
      },
      {
        title: "Divisions",
        href: "/admin/dashboard/add-division",
        icon: "MapPin",
        roles: ["ADMIN"],
      },
      {
        title: "Admin Management",
        href: "/admin/dashboard/admin-management",
        icon: "Shield",
        roles: ["ADMIN"],
      },
    ],
  },
];

export const superAdminNavItems: NavSection[] = [
  {
    title: "Administration",
    items: [
      {
        title: "Admin Management",
        href: "/admin/dashboard/admin-management",
        icon: "Shield",
        roles: ["SUPER_ADMIN"],
      },
      {
        title: "User Management",
        href: "/admin/dashboard/user-management",
        icon: "Users",
        roles: ["SUPER_ADMIN"],
      },
      {
        title: "Tour Management",
        href: "/admin/dashboard/tour-management",
        icon: "Map",
        roles: ["SUPER_ADMIN"],
      },
      {
        title: "Booking Management",
        href: "/admin/dashboard/booking-management",
        icon: "Calendar",
        roles: ["SUPER_ADMIN"],
      },
    ],
  },
];

export const getNavItemsByRole = async (
  role: UserRole,
): Promise<NavSection[]> => {
  const commonItems = getCommonNavItems(role);

  switch (role) {
    case "SUPER_ADMIN":
      return [...commonItems, ...superAdminNavItems];

    case "ADMIN":
      return [...commonItems, ...adminNavItems];

    case "USER":
      return [...commonItems, ...userNavItems];

    case "GUIDE":
      return commonItems;

    default:
      return commonItems;
  }
};
