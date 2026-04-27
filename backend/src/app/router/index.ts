import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { TourRoutes } from "../modules/tour/tour.route";
import { UserRoutes } from "../modules/user/user.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/tour",
    route: TourRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
