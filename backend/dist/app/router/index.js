"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const admin_route_1 = require("../modules/admin/admin.route");
const auth_route_1 = require("../modules/auth/auth.route");
const booking_route_1 = require("../modules/booking/booking.route");
const destination_route_1 = require("../modules/destination/destination.route");
const division_route_1 = require("../modules/division/division.route");
const payment_route_1 = require("../modules/payment/payment.route");
const tourDeparture_route_1 = require("../modules/tour-departure/tourDeparture.route");
const tour_route_1 = require("../modules/tour/tour.route");
const user_route_1 = require("../modules/user/user.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    { path: "/auth", route: auth_route_1.AuthRoutes },
    { path: "/user", route: user_route_1.UserRoutes },
    { path: "/tour", route: tour_route_1.TourRoutes },
    { path: "/division", route: division_route_1.DivisionRoutes },
    { path: "/destination", route: destination_route_1.DestinationRoutes },
    { path: "/booking", route: booking_route_1.BookingRoutes },
    { path: "/payment", route: payment_route_1.PaymentRoutes },
    { path: "/tour-departure", route: tourDeparture_route_1.TourDepartureRoutes },
    { path: "/admin", route: admin_route_1.AdminRoutes },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
