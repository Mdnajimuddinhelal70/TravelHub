import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { TOUR_DEPARTURE_STATUS } from "../tour-departure/tour-departure.interface";
import { TourDeparture } from "../tour-departure/tour-departure.model";
import { Tour } from "../tour/tour.model";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";

const getStats = async () => {
  const [
    totalBookings,
    pendingBookings,
    confirmedBookings,
    totalRevenue,
    totalUsers,
    totalAdmins,
    totalTours,
    publishedTours,
    totalDepartures,
    openDepartures,
    recentBookings,
  ] = await Promise.all([
    // Bookings
    Booking.countDocuments(),
    Booking.countDocuments({ status: BOOKING_STATUS.PENDING }),
    Booking.countDocuments({ status: BOOKING_STATUS.CONFIRMED }),

    // Revenue (sum of PAID payments)
    Payment.aggregate([
      { $match: { status: PAYMENT_STATUS.PAID } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),

    // Users
    User.countDocuments({ isDeleted: false }),
    User.countDocuments({
      role: { $in: [Role.ADMIN, Role.SUPER_ADMIN] },
      isDeleted: false,
    }),

    // Tours
    Tour.countDocuments({ isDeleted: false }),
    Tour.countDocuments({ status: "published", isDeleted: false }),

    // Departures
    TourDeparture.countDocuments(),
    TourDeparture.countDocuments({ status: TOUR_DEPARTURE_STATUS.OPEN }),

    // Recent bookings
    Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("tour", "title slug")
      .populate("user", "name email")
      .select("bookingNumber status priceBreakdown.total createdAt tour user"),
  ]);

  return {
    bookings: {
      total: totalBookings,
      pending: pendingBookings,
      confirmed: confirmedBookings,
    },
    revenue: {
      total: totalRevenue[0]?.total ?? 0,
    },
    users: {
      total: totalUsers,
      admins: totalAdmins,
    },
    tours: {
      total: totalTours,
      published: publishedTours,
    },
    departures: {
      total: totalDepartures,
      open: openDepartures,
    },
    recentBookings,
  };
};

export const AdminService = {
  getStats,
};
