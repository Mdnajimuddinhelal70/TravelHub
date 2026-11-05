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

const getSuperAdminStats = async () => {
  const [
    totalBookings,
    pendingBookings,
    confirmedBookings,
    totalRevenue,
    revenueThisMonth,
    totalUsers,
    totalAdmins,
    totalSuperAdmins,
    totalGuides,
    totalTours,
    publishedTours,
    totalDepartures,
    openDepartures,
    recentBookings,
    adminsList,
    recentUsers,
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ status: BOOKING_STATUS.PENDING }),
    Booking.countDocuments({ status: BOOKING_STATUS.CONFIRMED }),

    // Total revenue
    Payment.aggregate([
      { $match: { status: PAYMENT_STATUS.PAID } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),

    // Revenue this month
    Payment.aggregate([
      {
        $match: {
          status: PAYMENT_STATUS.PAID,
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),

    // User counts by role
    User.countDocuments({ isDeleted: false }),
    User.countDocuments({ role: Role.ADMIN, isDeleted: false }),
    User.countDocuments({ role: Role.SUPER_ADMIN, isDeleted: false }),
    User.countDocuments({ role: Role.GUIDE, isDeleted: false }),

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

    // Admins list (with profile info)
    User.find({
      role: { $in: [Role.ADMIN, Role.SUPER_ADMIN] },
      isDeleted: false,
    })
      .select("name email role picture isActive createdAt")
      .sort({ role: 1, createdAt: -1 })
      .limit(10),

    // Recent users
    User.find({ isDeleted: false, role: Role.USER })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email picture createdAt"),
  ]);

  return {
    bookings: {
      total: totalBookings,
      pending: pendingBookings,
      confirmed: confirmedBookings,
    },
    revenue: {
      total: totalRevenue[0]?.total ?? 0,
      thisMonth: revenueThisMonth[0]?.total ?? 0,
    },
    users: {
      total: totalUsers,
      admins: totalAdmins,
      superAdmins: totalSuperAdmins,
      guides: totalGuides,
      regularUsers: totalUsers - totalAdmins - totalSuperAdmins - totalGuides,
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
    adminsList,
    recentUsers,
  };
};

export const AdminService = {
  getStats,
  getSuperAdminStats,
};
