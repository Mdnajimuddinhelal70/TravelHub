import type { IBooking } from "@/types";

export interface UserDashboardStats {
  totalBookings: number;
  activeBookings: number;
  completedTrips: number;
  totalSpent: number;
  pendingBookings: number;
  cancelledBookings: number;
}

export const calculateUserStats = (
  bookings: IBooking[],
): UserDashboardStats => {
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED");
  const completed = bookings.filter((b) => b.status === "COMPLETED");
  const pending = bookings.filter((b) => b.status === "PENDING");
  const cancelled = bookings.filter((b) => b.status === "CANCELLED");

  const totalSpent = [...confirmed, ...completed].reduce(
    (sum, b) => sum + b.priceBreakdown.total,
    0,
  );

  return {
    totalBookings: bookings.length,
    activeBookings: confirmed.length,
    completedTrips: completed.length,
    totalSpent,
    pendingBookings: pending.length,
    cancelledBookings: cancelled.length,
  };
};

export const getUpcomingTrip = (bookings: IBooking[]): IBooking | null => {
  const now = new Date();
  const upcoming = bookings
    .filter((b) => b.status === "CONFIRMED")
    .filter((b) => {
      const dep =
        typeof b.tourDeparture === "object" && b.tourDeparture !== null
          ? b.tourDeparture
          : null;
      return dep && new Date(dep.startDate) > now;
    })
    .sort((a, b) => {
      const aDep =
        typeof a.tourDeparture === "object" && a.tourDeparture !== null
          ? a.tourDeparture
          : null;
      const bDep =
        typeof b.tourDeparture === "object" && b.tourDeparture !== null
          ? b.tourDeparture
          : null;
      if (!aDep || !bDep) return 0;
      return (
        new Date(aDep.startDate).getTime() - new Date(bDep.startDate).getTime()
      );
    });

  return upcoming[0] ?? null;
};

export const getDaysUntil = (date: string): number => {
  const now = new Date();
  const target = new Date(date);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
