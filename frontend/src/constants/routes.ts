export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  DESTINATION: "/destination",

  TOURS: "/tours",
  TOUR_DETAIL: (slug: string) => `/tours/${slug}`,
  TOUR_BOOK: (slug: string) => `/tours/${slug}/book`,

  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  PAYMENT_SUCCESS: "/payment/success",
  PAYMENT_FAIL: "/payment/fail",
  PAYMENT_CANCEL: "/payment/cancel",

  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  MY_BOOKINGS: "/my-bookings",
  BOOKING_DETAIL: (id: string) => `/my-bookings/${id}`,

  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_TOURS: "/admin/tours",
  ADMIN_TOUR_CREATE: "/admin/tours/create",
  ADMIN_TOUR_EDIT: (id: string) => `/admin/tours/${id}/edit`,
  ADMIN_DIVISIONS: "/admin/divisions",
  ADMIN_DESTINATIONS: "/admin/destinations",
  ADMIN_DEPARTURES: "/admin/departures",
  ADMIN_BOOKINGS: "/admin/bookings",
} as const;
