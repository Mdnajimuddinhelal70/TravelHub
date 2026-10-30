import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { DestinationController } from "./destination.controller";

const router = Router();

router.get("/", DestinationController.getAllDestinations);
router.get(
  "/division/:divisionId",
  DestinationController.getDestinationsByDivision,
);
router.get("/:slug", DestinationController.getSingleDestination);

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  DestinationController.createDestination,
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  DestinationController.updateDestination,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DestinationController.deleteDestination,
);

export const DestinationRoutes = router;
