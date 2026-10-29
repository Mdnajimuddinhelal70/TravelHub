"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatusZodSchema = exports.createBookingZodSchema = void 0;
const zod_1 = require("zod");
const booking_interface_1 = require("./booking.interface");
const travelerZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    age: zod_1.z.coerce.number().int().min(0).max(120),
    gender: zod_1.z.enum(["male", "female", "other"]),
    type: zod_1.z.enum(["adult", "child"]),
    nidOrPassport: zod_1.z.string().optional(),
});
const contactInfoZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    phone: zod_1.z.string().min(6),
    email: zod_1.z.string().email(),
    emergencyContact: zod_1.z.string().optional(),
});
exports.createBookingZodSchema = zod_1.z.object({
    tourDeparture: zod_1.z.string().min(1, "Departure is required"),
    travelers: zod_1.z.array(travelerZodSchema).min(1, "At least one traveler"),
    contactInfo: contactInfoZodSchema,
    couponCode: zod_1.z.string().optional(),
    specialRequests: zod_1.z.string().max(1000).optional(),
    priceBreakdown: zod_1.z
        .object({
        childPrice: zod_1.z.coerce.number().min(0).optional(),
        discountAmount: zod_1.z.coerce.number().min(0).optional(),
    })
        .optional(),
});
exports.updateBookingStatusZodSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(booking_interface_1.BOOKING_STATUS),
    cancellationReason: zod_1.z.string().optional(),
});
