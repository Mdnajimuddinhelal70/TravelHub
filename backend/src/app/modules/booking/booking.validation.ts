import { z } from "zod";
import { BOOKING_STATUS } from "./booking.interface";

const travelerZodSchema = z.object({
  name: z.string().min(2),
  age: z.coerce.number().int().min(0).max(120),
  gender: z.enum(["male", "female", "other"]),
  type: z.enum(["adult", "child"]),
  nidOrPassport: z.string().optional(),
});

const contactInfoZodSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  emergencyContact: z.string().optional(),
});

export const createBookingZodSchema = z.object({
  tourDeparture: z.string().min(1, "Departure is required"),
  travelers: z.array(travelerZodSchema).min(1, "At least one traveler"),
  contactInfo: contactInfoZodSchema,
  couponCode: z.string().optional(),
  specialRequests: z.string().max(1000).optional(),
  priceBreakdown: z
    .object({
      childPrice: z.coerce.number().min(0).optional(),
      discountAmount: z.coerce.number().min(0).optional(),
    })
    .optional(),
});

export const updateBookingStatusZodSchema = z.object({
  status: z.nativeEnum(BOOKING_STATUS),
  cancellationReason: z.string().optional(),
});
