import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: {
      type: String,
      enum: ["google", "credentials"],
      required: true,
    },
    providerId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    versionKey: false,
    _id: false,
  },
);

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 100,
    },

    password: {
      type: String,
      select: false,
    },

    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
      required: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    picture: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
      required: true,
    },

    auths: {
      type: [authProviderSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model<IUser>("User", userSchema);
