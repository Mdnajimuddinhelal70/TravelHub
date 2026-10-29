"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DestinationRoutes = void 0;
const express_1 = require("express");
const multer_config_1 = require("../../config/multer.config");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_interface_1 = require("../user/user.interface");
const destination_controller_1 = require("./destination.controller");
const destination_validation_1 = require("./destination.validation");
const router = (0, express_1.Router)();
/* ------------------ PUBLIC -------------------- */
router.get("/", destination_controller_1.DestinationController.getAllDestinations);
router.get("/division/:divisionId", destination_controller_1.DestinationController.getDestinationsByDivision);
router.get("/:slug", destination_controller_1.DestinationController.getSingleDestination);
/* ------------------ ADMIN --------------------- */
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
]), (0, validateRequest_1.validateRequest)(destination_validation_1.createDestinationSchema), destination_controller_1.DestinationController.createDestination);
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
]), (0, validateRequest_1.validateRequest)(destination_validation_1.updateDestinationSchema), destination_controller_1.DestinationController.updateDestination);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), destination_controller_1.DestinationController.deleteDestination);
exports.DestinationRoutes = router;
