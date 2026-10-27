import { z } from "zod";

/* ============================================================
 *  TOUR DEPARTURE — CREATE
 * ============================================================ */

export const createTourDepartureZodSchema = z.object({
  tour: z.string().min(1, "Tour is required"),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid start date"),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid end date"),
  pricePerPerson: z.number().min(0, "Price cannot be negative"),
  totalSeats: z.number().int().min(1, "Total seats must be at least 1"),
  availableSeats: z.number().int().min(0).optional(),
  bookedSeats: z.number().int().min(0).optional(),
  minGroupSize: z.number().int().min(1).optional(),
  status: z
    .enum(["SCHEDULED", "OPEN", "FULL", "CANCELLED", "COMPLETED"])
    .optional(),
  guide: z.string().optional(),
  meetingPoint: z.string().optional(),
  notes: z.string().optional(),
});

/* ============================================================
 *  TOUR DEPARTURE — UPDATE
 * ============================================================ */

export const updateTourDepartureZodSchema = createTourDepartureZodSchema
  .partial()
  .extend({
    cancellationReason: z.string().optional(),
  });
