import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { DestinationController } from "./destination.controller";
import {
  createDestinationSchema,
  updateDestinationSchema,
} from "./destination.validation";

const router = Router();

/* ------------------ PUBLIC -------------------- */
router.get("/", DestinationController.getAllDestinations);

router.get(
  "/division/:divisionId",
  DestinationController.getDestinationsByDivision,
);

router.get("/:slug", DestinationController.getSingleDestination);

/* ------------------ ADMIN --------------------- */
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  validateRequest(createDestinationSchema),
  DestinationController.createDestination,
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  validateRequest(updateDestinationSchema),
  DestinationController.updateDestination,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DestinationController.deleteDestination,
);

export const DestinationRoutes = router;
