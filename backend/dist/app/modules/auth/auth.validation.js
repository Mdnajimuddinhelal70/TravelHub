"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordZodSchema = exports.forgotPasswordZodSchema = exports.setPasswordZodSchema = exports.changePasswordZodSchema = exports.loginZodSchema = void 0;
const zod_1 = require("zod");
const passwordSchema = zod_1.z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[!@#$%^&*]/, "Password must contain at least 1 special character")
    .regex(/\d/, "Password must contain at least 1 number");
exports.loginZodSchema = zod_1.z
    .object({
    email: zod_1.z.string().trim().toLowerCase().email("Invalid email format"),
    password: zod_1.z.string().min(1, "Password is required"),
})
    .strict();
exports.changePasswordZodSchema = zod_1.z
    .object({
    oldPassword: zod_1.z.string().min(1, "Old password is required"),
    newPassword: passwordSchema,
})
    .strict();
exports.setPasswordZodSchema = zod_1.z
    .object({
    password: passwordSchema,
})
    .strict();
exports.forgotPasswordZodSchema = zod_1.z
    .object({
    email: zod_1.z.string().trim().toLowerCase().email("Invalid email format"),
})
    .strict();
exports.resetPasswordZodSchema = zod_1.z
    .object({
    id: zod_1.z.string().min(1, "User id is required"),
    token: zod_1.z.string().min(1, "Reset token is required"),
    newPassword: passwordSchema,
})
    .strict();
