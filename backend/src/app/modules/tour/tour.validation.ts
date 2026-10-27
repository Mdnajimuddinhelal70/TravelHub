import { z } from "zod";

/* ============================================================
 *  REUSABLE SUB-SCHEMAS
 * ============================================================ */

const tourPlanItemSchema = z.object({
  day: z.number().int().min(1, "Day must be at least 1"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  meals: z.array(z.string()).optional(),
  accommodation: z.string().optional(),
});

const priceSchema = z.object({
  adult: z.number().min(0, "Adult price cannot be negative"),
  child: z.number().min(0).optional(),
  discountPercent: z.number().min(0).max(100).optional(),
});

const durationSchema = z.object({
  days: z.number().int().min(1, "Days must be at least 1"),
  nights: z.number().int().min(0, "Nights cannot be negative"),
});

/* ============================================================
 *  TOUR — CREATE
 * ============================================================ */

export const createTourZodSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  images: z.array(z.string()).optional(),

  destinations: z
    .array(z.string())
    .min(1, "At least one destination is required"),
  primaryDestination: z.string().optional(),

  tourType: z.string().min(1, "Tour type is required"),

  category: z
    .enum(["group", "family", "honeymoon", "adventure", "corporate"])
    .optional(),
  difficulty: z.enum(["easy", "moderate", "hard"]).optional(),

  duration: durationSchema,
  price: priceSchema,

  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  tourPlan: z.array(tourPlanItemSchema).optional(),

  minGroupSize: z.number().int().min(1).optional(),
  maxGuest: z.number().int().min(1).optional(),
  minAge: z.number().int().min(0).optional(),
  cancellationPolicy: z.string().optional(),

  status: z.enum(["draft", "published", "archived"]).optional(),
});

/* ============================================================
 *  TOUR — UPDATE
 * ============================================================ */

export const updateTourZodSchema = createTourZodSchema.partial().extend({
  deleteImages: z.array(z.string()).optional(),
});

/* ============================================================
 *  TOUR TYPE — CREATE
 * ============================================================ */

export const createTourTypeZodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().optional(),
});

/* ============================================================
 *  TOUR TYPE — UPDATE
 * ============================================================ */

export const updateTourTypeZodSchema = createTourTypeZodSchema.partial();
