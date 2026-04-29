import { NavSection } from "@/types/dashboard.interface";
import { getDefaultDashboardRoute, UserRole } from "./auth-utils";

// Common Nav Items
export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);

  return [
    {
      items: [
        {
          title: "Home",
          href: "/",
          icon: "Home",
          roles: ["SUPER_ADMIN", "ADMIN", "USER", "GUIDE"],
        },
        {
          title: "Dashboard",
          href: defaultDashboard,
          icon: "LayoutDashboard",
          roles: ["SUPER_ADMIN", "ADMIN", "USER", "GUIDE"],
        },
        {
          title: "My Profile",
          href: "/my-profile",
          icon: "User",
          roles: ["SUPER_ADMIN", "ADMIN", "USER", "GUIDE"],
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Change Password",
          href: "/change-password",
          icon: "Settings",
          roles: ["SUPER_ADMIN", "ADMIN", "USER", "GUIDE"],
        },
      ],
    },
  ];
};

// Guide/Doctor Nav Items
export const guideNavItems: NavSection[] = [
  {
    title: "Guide Dashboard",
    items: [
      {
        title: "Tours",
        href: "/guide/dashboard/tours",
        icon: "Map",
        roles: ["GUIDE"],
      },
      {
        title: "Schedules",
        href: "/guide/dashboard/schedules",
        icon: "Clock",
        roles: ["GUIDE"],
      },
      {
        title: "Earnings",
        href: "/guide/dashboard/earnings",
        icon: "DollarSign",
        roles: ["GUIDE"],
      },
    ],
  },
];

// Patient/User Nav Items
export const userNavItems: NavSection[] = [
  {
    title: "Bookings",
    items: [
      {
        title: "My Bookings",
        href: "/dashboard/my-bookings",
        icon: "Calendar",
        roles: ["USER"],
      },
      {
        title: "New Booking",
        href: "/dashboard/book-trip",
        icon: "ClipboardList",
        roles: ["USER"],
      },
    ],
  },
  {
    title: "Records",
    items: [
      {
        title: "My Reviews",
        href: "/dashboard/my-reviews",
        icon: "Star",
        roles: ["USER"],
      },
    ],
  },
];

// Admin Nav Items
export const adminNavItems: NavSection[] = [
  {
    title: "User Management",
    items: [
      {
        title: "Admins",
        href: "/admin/dashboard/admins-management",
        icon: "Shield",
        roles: ["ADMIN"],
      },
      {
        title: "Guides",
        href: "/admin/dashboard/guides-management",
        icon: "Stethoscope",
        roles: ["ADMIN"],
      },
      {
        title: "Users",
        href: "/admin/dashboard/users-management",
        icon: "Users",
        roles: ["ADMIN"],
      },
    ],
  },
  {
    title: "System Management",
    items: [
      {
        title: "Trips",
        href: "/admin/dashboard/trips-management",
        icon: "Map",
        roles: ["ADMIN"],
      },
      {
        title: "Payments",
        href: "/admin/dashboard/payments-management",
        icon: "CreditCard",
        roles: ["ADMIN"],
      },
    ],
  },
];

// Role-based Nav Items
export const getNavItemsByRole = async (
  role: UserRole,
): Promise<NavSection[]> => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case "SUPER_ADMIN":
      return [...commonNavItems, ...adminNavItems];
    case "ADMIN":
      return [...commonNavItems, ...adminNavItems];
    case "GUIDE":
      return [...commonNavItems, ...guideNavItems];
    case "USER":
      return [...commonNavItems, ...userNavItems];
    default:
      return commonNavItems;
  }
};
