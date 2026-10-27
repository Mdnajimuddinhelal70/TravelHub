import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
  .regex(/[!@#$%^&*]/, "Password must contain at least 1 special character")
  .regex(/\d/, "Password must contain at least 1 number");

export const loginZodSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  })
  .strict();

export const changePasswordZodSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: passwordSchema,
  })
  .strict();

export const setPasswordZodSchema = z
  .object({
    password: passwordSchema,
  })
  .strict();

export const forgotPasswordZodSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Invalid email format"),
  })
  .strict();

export const resetPasswordZodSchema = z
  .object({
    id: z.string().min(1, "User id is required"),
    token: z.string().min(1, "Reset token is required"),
    newPassword: passwordSchema,
  })
  .strict();
