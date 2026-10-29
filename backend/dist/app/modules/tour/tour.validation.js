"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTourTypeZodSchema = exports.createTourTypeZodSchema = exports.updateTourZodSchema = exports.createTourZodSchema = void 0;
const zod_1 = require("zod");
/* ============================================================
 *  REUSABLE SUB-SCHEMAS
 * ============================================================ */
const tourPlanItemSchema = zod_1.z.object({
    day: zod_1.z.number().int().min(1, "Day must be at least 1"),
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().optional(),
    meals: zod_1.z.array(zod_1.z.string()).optional(),
    accommodation: zod_1.z.string().optional(),
});
const priceSchema = zod_1.z.object({
    adult: zod_1.z.number().min(0, "Adult price cannot be negative"),
    child: zod_1.z.number().min(0).optional(),
    discountPercent: zod_1.z.number().min(0).max(100).optional(),
});
const durationSchema = zod_1.z.object({
    days: zod_1.z.number().int().min(1, "Days must be at least 1"),
    nights: zod_1.z.number().int().min(0, "Nights cannot be negative"),
});
/* ============================================================
 *  TOUR — CREATE
 * ============================================================ */
exports.createTourZodSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title must be at least 3 characters"),
    slug: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    coverImage: zod_1.z.string().optional(),
    images: zod_1.z.array(zod_1.z.string()).optional(),
    destinations: zod_1.z
        .array(zod_1.z.string())
        .min(1, "At least one destination is required"),
    primaryDestination: zod_1.z.string().optional(),
    tourType: zod_1.z.string().min(1, "Tour type is required"),
    category: zod_1.z
        .enum(["group", "family", "honeymoon", "adventure", "corporate"])
        .optional(),
    difficulty: zod_1.z.enum(["easy", "moderate", "hard"]).optional(),
    duration: durationSchema,
    price: priceSchema,
    included: zod_1.z.array(zod_1.z.string()).optional(),
    excluded: zod_1.z.array(zod_1.z.string()).optional(),
    amenities: zod_1.z.array(zod_1.z.string()).optional(),
    tourPlan: zod_1.z.array(tourPlanItemSchema).optional(),
    minGroupSize: zod_1.z.number().int().min(1).optional(),
    maxGuest: zod_1.z.number().int().min(1).optional(),
    minAge: zod_1.z.number().int().min(0).optional(),
    cancellationPolicy: zod_1.z.string().optional(),
    status: zod_1.z.enum(["draft", "published", "archived"]).optional(),
});
/* ============================================================
 *  TOUR — UPDATE
 * ============================================================ */
exports.updateTourZodSchema = exports.createTourZodSchema.partial().extend({
    deleteImages: zod_1.z.array(zod_1.z.string()).optional(),
});
/* ============================================================
 *  TOUR TYPE — CREATE
 * ============================================================ */
exports.createTourTypeZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
    description: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
});
/* ============================================================
 *  TOUR TYPE — UPDATE
 * ============================================================ */
exports.updateTourTypeZodSchema = exports.createTourTypeZodSchema.partial();
