"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters long.")
        .max(50, "Name cannot exceed 50 characters."),
    email: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email address format.")
        .min(5, "Email must be at least 5 characters long.")
        .max(100, "Email cannot exceed 100 characters."),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter.")
        .regex(/[!@#$%^&*]/, "Password must contain at least 1 special character.")
        .regex(/\d/, "Password must contain at least 1 number."),
    phone: zod_1.z
        .string()
        .trim()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, "Phone number must be +8801XXXXXXXXX or 01XXXXXXXXX.")
        .optional(),
    address: zod_1.z
        .string()
        .trim()
        .max(200, "Address cannot exceed 200 characters.")
        .optional(),
})
    .strict();
exports.updateUserZodSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters long.")
        .max(50, "Name cannot exceed 50 characters.")
        .optional(),
    phone: zod_1.z
        .string()
        .trim()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, "Phone number must be +8801XXXXXXXXX or 01XXXXXXXXX.")
        .optional(),
    address: zod_1.z
        .string()
        .trim()
        .max(200, "Address cannot exceed 200 characters.")
        .optional(),
    role: zod_1.z.nativeEnum(user_interface_1.Role).optional(),
    isActive: zod_1.z.nativeEnum(user_interface_1.IsActive).optional(),
    isDeleted: zod_1.z.boolean().optional(),
})
    .strict();
