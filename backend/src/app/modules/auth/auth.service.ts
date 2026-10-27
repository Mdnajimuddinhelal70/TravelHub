import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { sendEmail } from "../../utils/sendEmail";
import { createUserTokens } from "../../utils/userTokens";
import { IAuthProvider, IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const getNewAccessToken = async (refreshToken: string) => {
  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(
      refreshToken,
      envVars.JWT_REFRESH_SECRET,
    ) as JwtPayload;
  } catch {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired refresh token",
    );
  }

  const user = await User.findOne({ email: decoded.email }).select(
    "+refreshToken",
  );

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
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

  // Refresh token rotation: DB-তে থাকা token-এর সাথে match করতে হবে
  if (user.refreshToken !== refreshToken) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Refresh token has been revoked or rotated",
    );
  }

  const tokens = createUserTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return tokens;
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload,
) => {
  const user = await User.findById(decodedToken.userId).select("+password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!user.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have not set a password yet. Use set-password instead.",
    );
  }

  const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user.password);

  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match");
  }

  const isSamePassword = await bcryptjs.compare(newPassword, user.password);
  if (isSamePassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password must be different from old password",
    );
  }

  user.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND),
  );

  // পুরনো session invalidate করো
  user.refreshToken = undefined;
  await user.save();
};

const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password already set. Use change-password instead.",
    );
  }

  const hasCredentials = user.auths.some((a) => a.provider === "credentials");

  if (hasCredentials) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Credentials already linked to this account",
    );
  }

  const hashedPassword = await bcryptjs.hash(
    plainPassword,
    Number(envVars.BCRYPT_SALT_ROUND),
  );

  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };

  user.password = hashedPassword;
  user.auths = [...user.auths, credentialProvider];
  await user.save();
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }

  if (
    user.isActive === IsActive.BLOCKED ||
    user.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, `User is ${user.isActive}`);
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
  }

  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const resetToken = jwt.sign(jwtPayload, envVars.JWT_RESET_PASSWORD_SECRET, {
    expiresIn: envVars.JWT_RESET_PASSWORD_EXPIRES,
  } as SignOptions);

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${user._id}&token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    templateName: "forgetPassword",
    templateData: {
      name: user.name,
      resetUILink,
    },
  });
};

const resetPassword = async (payload: {
  id: string;
  token: string;
  newPassword: string;
}) => {
  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(
      payload.token,
      envVars.JWT_RESET_PASSWORD_SECRET,
    ) as JwtPayload;
  } catch {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired reset token",
    );
  }

  if (decoded.userId !== payload.id) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid reset token");
  }

  const user = await User.findById(decoded.userId).select("+password");

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

  user.password = await bcryptjs.hash(
    payload.newPassword,
    Number(envVars.BCRYPT_SALT_ROUND),
  );

  // পুরনো session invalidate করো
  user.refreshToken = undefined;
  await user.save();
};

export const AuthServices = {
  getNewAccessToken,
  changePassword,
  setPassword,
  forgotPassword,
  resetPassword,
};
