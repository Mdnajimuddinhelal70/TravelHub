import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";

import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { IsActive } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const bearerToken = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

      const accessToken = req.cookies?.accessToken || bearerToken;

      if (!accessToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, "No token provided");
      }

      let verifiedToken: JwtPayload;
      try {
        verifiedToken = jwt.verify(
          accessToken,
          envVars.JWT_ACCESS_SECRET,
        ) as JwtPayload;
      } catch {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Invalid or expired access token",
        );
      }

      const user = await User.findOne({ email: verifiedToken.email });

      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
      }

      if (
        user.isActive === IsActive.BLOCKED ||
        user.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(httpStatus.FORBIDDEN, `User is ${user.isActive}`);
      }

      if (user.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You are not permitted to access this resource",
        );
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
