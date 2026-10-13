import { z } from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long.")
      .max(50, "Name cannot exceed 50 characters."),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email address format.")
      .min(5, "Email must be at least 5 characters long.")
      .max(100, "Email cannot exceed 100 characters."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter.")
      .regex(
        /[!@#$%^&*]/,
        "Password must contain at least 1 special character.",
      )
      .regex(/\d/, "Password must contain at least 1 number."),

    phone: z
      .string()
      .trim()
      .regex(
        /^(?:\+8801\d{9}|01\d{9})$/,
        "Phone number must be +8801XXXXXXXXX or 01XXXXXXXXX.",
      )
      .optional(),

    address: z
      .string()
      .trim()
      .max(200, "Address cannot exceed 200 characters.")
      .optional(),
  })
  .strict();

export const updateUserZodSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long.")
      .max(50, "Name cannot exceed 50 characters.")
      .optional(),

    phone: z
      .string()
      .trim()
      .regex(
        /^(?:\+8801\d{9}|01\d{9})$/,
        "Phone number must be +8801XXXXXXXXX or 01XXXXXXXXX.",
      )
      .optional(),

    address: z
      .string()
      .trim()
      .max(200, "Address cannot exceed 200 characters.")
      .optional(),

    role: z.nativeEnum(Role).optional(),

    isActive: z.nativeEnum(IsActive).optional(),

    isDeleted: z.boolean().optional(),
  })
  .strict();

export type CreateUserInput = z.infer<typeof createUserZodSchema>;

export type UpdateUserInput = z.infer<typeof updateUserZodSchema>;
