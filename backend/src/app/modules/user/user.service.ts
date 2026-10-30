import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Booking } from "../booking/booking.model";
import { userSearchableFields } from "./user.constant";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import { CreateUserInput } from "./user.validation";

const createUser = async (payload: CreateUserInput) => {
  const email = payload.email.trim().toLowerCase();

  const isUserExist = await User.exists({ email });

  if (isUserExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "An account with this email already exists.",
    );
  }

  const saltRounds = Number(envVars.BCRYPT_SALT_ROUND);

  if (!Number.isInteger(saltRounds) || saltRounds < 1) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Password hashing configuration is invalid.",
    );
  }

  const hashedPassword = await bcryptjs.hash(payload.password, saltRounds);

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email,
  };

  try {
    const user = await User.create({
      name: payload.name.trim(),
      email,
      password: hashedPassword,
      phone: payload.phone,
      address: payload.address,

      // Public registration must never choose its own role.
      role: Role.USER,

      auths: [authProvider],
    });

    // Explicitly return only safe fields.
    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      picture: user.picture,
      address: user.address,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error: unknown) {
    // MongoDB duplicate-key error.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      throw new AppError(
        httpStatus.CONFLICT,
        "An account with this email already exists.",
      );
    }

    throw error;
  }
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
) => {
  if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
    if (userId !== decodedToken.userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }
  }

  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (
    decodedToken.role === Role.ADMIN &&
    ifUserExist.role === Role.SUPER_ADMIN
  ) {
    throw new AppError(401, "You are not authorized");
  }
  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
    if (decodedToken.role === Role.ADMIN && payload.role === Role.SUPER_ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Only SUPER_ADMIN can assign SUPER_ADMIN role",
      );
    }
  }

  if (payload.isActive !== undefined || payload.isDeleted !== undefined) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (
    decodedToken.role === Role.ADMIN &&
    ifUserExist.role === Role.SUPER_ADMIN
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You cannot modify a SUPER_ADMIN account",
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};
const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);
  const usersData = queryBuilder
    .filter()
    .search(userSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    usersData.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};
const getSingleUser = async (id: string) => {
  const user = await User.findOne({ _id: id, isDeleted: false }).select(
    "-password -auths",
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }
  return {
    data: user,
  };
};
const getUserById = async (id: string) => {
  const user = await User.findById(id).select("-password -refreshToken -auths");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

const getMe = async (userId: string) => {
  const user = await User.findOne({ _id: userId, isDeleted: false }).select(
    "-password -auths",
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }
  return user;
};

const hardDeleteUser = async (userId: string, requester: JwtPayload) => {
  // Only SUPER_ADMIN can hard-delete
  if (requester.role !== Role.SUPER_ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only SUPER_ADMIN can permanently delete users",
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user._id.toString() === requester.userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You cannot delete your own account",
    );
  }
  if (user.role === Role.SUPER_ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Cannot delete a SUPER_ADMIN account",
    );
  }
  const bookingCount = await Booking.countDocuments({ user: userId });
  if (bookingCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot permanently delete: this user has ${bookingCount} booking(s). Use soft delete instead.`,
    );
  }
  if (user.picture) {
    deleteImageFromCLoudinary(user.picture).catch((err) =>
      console.error("Failed to delete picture:", err),
    );
  }
  await User.findByIdAndDelete(userId);

  return null;
};
/* ============================================================
 *  SOFT DELETE
 * ============================================================ */
const softDeleteUser = async (userId: string, requester: JwtPayload) => {
  const user = await User.findById(userId);
  if (!user || user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Cannot delete yourself
  if (user._id.toString() === requester.userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You cannot delete your own account",
    );
  }

  // Cannot soft-delete a SUPER_ADMIN
  if (user.role === Role.SUPER_ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Cannot delete a SUPER_ADMIN account",
    );
  }

  // ADMIN cannot delete another ADMIN
  if (requester.role === Role.ADMIN && user.role === Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Admins cannot delete other admins",
    );
  }

  await User.findByIdAndUpdate(userId, {
    isDeleted: true,
    isActive: IsActive.INACTIVE,
    refreshToken: undefined,
  });

  return { message: "User soft-deleted" };
};

/* ============================================================
 *  RESTORE
 * ============================================================ */
const restoreUser = async (userId: string, requester: JwtPayload) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (!user.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not deleted");
  }

  if (requester.role === Role.ADMIN && user.role === Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Admins cannot restore other admins",
    );
  }

  const restored = await User.findByIdAndUpdate(
    userId,
    { isDeleted: false, isActive: IsActive.ACTIVE },
    { new: true, runValidators: true },
  ).select("-password -auths -refreshToken");

  return { user: restored };
};

export const UserServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  getMe,
  hardDeleteUser,
  getUserById,
  softDeleteUser,
  restoreUser,
};
