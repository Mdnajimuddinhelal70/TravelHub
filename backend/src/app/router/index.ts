import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BookingRoutes } from "../modules/booking/booking.route";
import { DestinationRoutes } from "../modules/destination/destination.route";
import { DivisionRoutes } from "../modules/division/division.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { TourDepartureRoutes } from "../modules/tour-departure/tourDeparture.route";
import { TourRoutes } from "../modules/tour/tour.route";
import { UserRoutes } from "../modules/user/user.route";

export const router = Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/user", route: UserRoutes },
  { path: "/tour", route: TourRoutes },
  { path: "/division", route: DivisionRoutes },
  { path: "/destination", route: DestinationRoutes },
  { path: "/booking", route: BookingRoutes },
  { path: "/payment", route: PaymentRoutes },
  { path: "/tour-departure", route: TourDepartureRoutes },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
