import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

const router = Router();

/* ============================================================
 *  ⚠️ SPECIFIC ROUTES FIRST (before /:id)
 * ============================================================ */

// Auth - me
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);

// Admin - list
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers,
);

// Public register
router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser,
);

// Upload profile picture (specific path under /me)
router.patch(
  "/me/profile-picture",
  checkAuth(...Object.values(Role)),
  multerUpload.single("file"),
  UserControllers.uploadProfilePicture,
);

/* ============================================================
 *  PARAMETERIZED ROUTES (/:id)
 * ============================================================ */

// Admin - single user (view)
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getUserById,
);

// Update user
router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser,
);

/* ============================================================
 *  DELETE / RESTORE
 * ============================================================ */

// Soft delete (ADMIN / SUPER_ADMIN)
router.delete(
  "/:id/soft",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.softDeleteUser,
);

// Restore soft-deleted user
router.patch(
  "/:id/restore",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.restoreUser,
);

// Hard delete (SUPER_ADMIN only)
router.delete(
  "/:id/permanent",
  checkAuth(Role.SUPER_ADMIN),
  UserControllers.hardDeleteUser,
);

export const UserRoutes = router;
