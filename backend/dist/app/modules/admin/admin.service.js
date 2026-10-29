"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const booking_interface_1 = require("../booking/booking.interface");
const booking_model_1 = require("../booking/booking.model");
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const tour_departure_interface_1 = require("../tour-departure/tour-departure.interface");
const tour_departure_model_1 = require("../tour-departure/tour-departure.model");
const tour_model_1 = require("../tour/tour.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const getStats = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const [totalBookings, pendingBookings, confirmedBookings, totalRevenue, totalUsers, totalAdmins, totalTours, publishedTours, totalDepartures, openDepartures, recentBookings,] = yield Promise.all([
        // Bookings
        booking_model_1.Booking.countDocuments(),
        booking_model_1.Booking.countDocuments({ status: booking_interface_1.BOOKING_STATUS.PENDING }),
        booking_model_1.Booking.countDocuments({ status: booking_interface_1.BOOKING_STATUS.CONFIRMED }),
        // Revenue (sum of PAID payments)
        payment_model_1.Payment.aggregate([
            { $match: { status: payment_interface_1.PAYMENT_STATUS.PAID } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        // Users
        user_model_1.User.countDocuments({ isDeleted: false }),
        user_model_1.User.countDocuments({
            role: { $in: [user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN] },
            isDeleted: false,
        }),
        // Tours
        tour_model_1.Tour.countDocuments({ isDeleted: false }),
        tour_model_1.Tour.countDocuments({ status: "published", isDeleted: false }),
        // Departures
        tour_departure_model_1.TourDeparture.countDocuments(),
        tour_departure_model_1.TourDeparture.countDocuments({ status: tour_departure_interface_1.TOUR_DEPARTURE_STATUS.OPEN }),
        // Recent bookings
        booking_model_1.Booking.find()
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
            total: (_b = (_a = totalRevenue[0]) === null || _a === void 0 ? void 0 : _a.total) !== null && _b !== void 0 ? _b : 0,
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
});
exports.AdminService = {
    getStats,
};
