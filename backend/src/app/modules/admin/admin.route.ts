import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AdminController } from "./admin.controller";

const router = express.Router();

router.get(
  "/stats",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getStats,
);

export const AdminRoutes = router;
