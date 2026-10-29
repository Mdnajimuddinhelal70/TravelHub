"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourDepartureRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_interface_1 = require("../user/user.interface");
const tourDeparture_controller_1 = require("./tourDeparture.controller");
const tourDeparture_validation_1 = require("./tourDeparture.validation");
const router = (0, express_1.Router)();
/* ------------------ PUBLIC ROUTES -------------------- */
router.get("/", tourDeparture_controller_1.TourDepartureController.getAllTourDepartures);
router.get("/tour/:tourId", tourDeparture_controller_1.TourDepartureController.getDeparturesByTour);
router.get("/:id", tourDeparture_controller_1.TourDepartureController.getSingleTourDeparture);
/* ------------------ ADMIN ROUTES --------------------- */
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(tourDeparture_validation_1.createTourDepartureZodSchema), tourDeparture_controller_1.TourDepartureController.createTourDeparture);
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(tourDeparture_validation_1.updateTourDepartureZodSchema), tourDeparture_controller_1.TourDepartureController.updateTourDeparture);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tourDeparture_controller_1.TourDepartureController.deleteTourDeparture);
exports.TourDepartureRoutes = router;
