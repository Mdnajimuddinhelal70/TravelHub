import { z } from "zod";

export const RoleEnum = z.enum(["SUPER_ADMIN", "ADMIN", "USER", "GUIDE"]);
export const IsActiveEnum = z.enum(["ACTIVE", "INACTIVE", "BLOCKED"]);

export const registerUserValidationZodSchema = z.object({
  provider: z.enum(["google", "credentials"]),
  providerId: z.string().min(1, "Provider ID is required"),
});

export const UserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  role: RoleEnum.default("USER"),
  phone: z
    .string()
    .regex(/^(\+8801[0-9]{9}|01[0-9]{9})$/, "Invalid Bangladeshi phone number")
    .optional(),
  picture: z.string().url("Invalid picture URL").optional(),
  address: z.string().optional(),
  isDeleted: z.boolean().default(false).optional(),
  isActive: IsActiveEnum.default("ACTIVE").optional(),
  isVerified: z.boolean().default(true).optional(),
  auths: z.array(registerUserValidationZodSchema),
  bookings: z.array(z.string()).optional(),
  guides: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
});

export const loginValidationZodSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email cannot exceed 100 characters"),

  password: z
    .string({ error: "Password is required" })
    .min(6, "Password must be at least 6 characters long"),
});
