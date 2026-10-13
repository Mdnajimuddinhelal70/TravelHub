import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { IsActive, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { verifyToken } from "../utils/jwt";

const isValidRole = (role: unknown): role is Role => {
  return Object.values(Role).some((validRole) => validRole === role);
};

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorization = req.headers.authorization;

      const accessToken = authorization?.replace(/^Bearer\s+/i, "").trim();

      if (!accessToken) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Access token is required.",
        );
      }

      let decoded: string | JwtPayload;

      try {
        decoded = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as
          | string
          | JwtPayload;
      } catch {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Invalid or expired access token.",
        );
      }

      if (
        typeof decoded !== "object" ||
        decoded === null ||
        typeof decoded.email !== "string" ||
        !isValidRole(decoded.role)
      ) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Invalid access token payload.",
        );
      }

      const user = await User.findOne({ email: decoded.email });

      if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User does not exist.");
      }

      if (user.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "This account is deleted.");
      }

      if (
        user.isActive === IsActive.BLOCKED ||
        user.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(httpStatus.FORBIDDEN, `User is ${user.isActive}.`);
      }

      // Always authorize using the current database role.
      if (!authRoles.includes(user.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You are not permitted to access this resource.",
        );
      }

      req.user = {
        ...decoded,
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      } as JwtPayload;

      next();
    } catch (error) {
      next(error);
    }
  };
