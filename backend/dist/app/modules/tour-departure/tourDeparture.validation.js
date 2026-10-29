"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTourDepartureZodSchema = exports.createTourDepartureZodSchema = void 0;
const zod_1 = require("zod");
/* ============================================================
 *  TOUR DEPARTURE — CREATE
 * ============================================================ */
exports.createTourDepartureZodSchema = zod_1.z.object({
    tour: zod_1.z.string().min(1, "Tour is required"),
    startDate: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), "Invalid start date"),
    endDate: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), "Invalid end date"),
    pricePerPerson: zod_1.z.number().min(0, "Price cannot be negative"),
    totalSeats: zod_1.z.number().int().min(1, "Total seats must be at least 1"),
    availableSeats: zod_1.z.number().int().min(0).optional(),
    bookedSeats: zod_1.z.number().int().min(0).optional(),
    minGroupSize: zod_1.z.number().int().min(1).optional(),
    status: zod_1.z
        .enum(["SCHEDULED", "OPEN", "FULL", "CANCELLED", "COMPLETED"])
        .optional(),
    guide: zod_1.z.string().optional(),
    meetingPoint: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
/* ============================================================
 *  TOUR DEPARTURE — UPDATE
 * ============================================================ */
exports.updateTourDepartureZodSchema = exports.createTourDepartureZodSchema
    .partial()
    .extend({
    cancellationReason: zod_1.z.string().optional(),
});
