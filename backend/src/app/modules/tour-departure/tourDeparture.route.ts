import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { TourDepartureController } from "./tourDeparture.controller";
import {
  createTourDepartureZodSchema,
  updateTourDepartureZodSchema,
} from "./tourDeparture.validation";

const router = Router();

/* ------------------ PUBLIC ROUTES -------------------- */
router.get("/", TourDepartureController.getAllTourDepartures);

router.get("/tour/:tourId", TourDepartureController.getDeparturesByTour);

router.get("/:id", TourDepartureController.getSingleTourDeparture);

/* ------------------ ADMIN ROUTES --------------------- */
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourDepartureZodSchema),
  TourDepartureController.createTourDeparture,
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateTourDepartureZodSchema),
  TourDepartureController.updateTourDeparture,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourDepartureController.deleteTourDeparture,
);

export const TourDepartureRoutes = router;
