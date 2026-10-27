import { z } from "zod";

const travelerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  age: z.coerce
    .number()
    .int("Age must be a whole number")
    .min(0, "Age cannot be negative")
    .max(120, "Age cannot exceed 120"),
  gender: z.enum(["male", "female", "other"], {
    message: "Please select a valid gender",
  }),
  type: z.enum(["adult", "child"], {
    message: "Please select traveler type",
  }),
  nidOrPassport: z.string().trim().optional(),
});

const contactInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Contact name must be at least 2 characters")
    .max(50, "Contact name cannot exceed 50 characters"),
  phone: z
    .string()
    .trim()
    .regex(
      /^(?:\+8801\d{9}|01\d{9})$/,
      "Phone number must be +8801XXXXXXXXX or 01XXXXXXXXX",
    ),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  emergencyContact: z
    .string()
    .trim()
    .regex(
      /^(?:\+8801\d{9}|01\d{9})$/,
      "Emergency contact must be +8801XXXXXXXXX or 01XXXXXXXXX",
    )
    .optional()
    .or(z.literal("")),
});

export const createBookingSchema = z.object({
  tourDeparture: z.string().min(1, "Tour departure is required"),
  travelers: z
    .array(travelerSchema)
    .min(1, "At least one traveler is required"),
  contactInfo: contactInfoSchema,
  specialRequests: z
    .string()
    .trim()
    .max(1000, "Special requests cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
  couponCode: z.string().trim().optional().or(z.literal("")),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
