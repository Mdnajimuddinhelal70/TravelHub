import { NextFunction, Request, Response, Router } from "express";
import rateLimit from "express-rate-limit";
import passport from "passport";

import { envVars } from "../../config/env";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { AuthControllers } from "./auth.controller";
import {
  changePasswordZodSchema,
  forgotPasswordZodSchema,
  loginZodSchema,
  resetPasswordZodSchema,
  setPasswordZodSchema,
} from "./auth.validation";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  "/login",
  authLimiter,
  validateRequest(loginZodSchema),
  AuthControllers.credentialsLogin,
);

router.post("/refresh-token", AuthControllers.getNewAccessToken);

router.post("/logout", AuthControllers.logout);

router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  validateRequest(changePasswordZodSchema),
  AuthControllers.changePassword,
);

router.post(
  "/set-password",
  checkAuth(...Object.values(Role)),
  validateRequest(setPasswordZodSchema),
  AuthControllers.setPassword,
);

router.post(
  "/forgot-password",
  authLimiter,
  validateRequest(forgotPasswordZodSchema),
  AuthControllers.forgotPassword,
);

router.post(
  "/reset-password",
  validateRequest(resetPasswordZodSchema),
  AuthControllers.resetPassword,
);

router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  },
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!`,
  }),
  AuthControllers.googleCallbackController,
);

export const AuthRoutes = router;
