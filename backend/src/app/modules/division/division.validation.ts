import { z } from "zod";

export const createDivisionSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  slug: z.string().optional(),
  thumbnail: z.string().optional(),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),
  districts: z.array(z.string()).optional(),
  location: z
    .object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  isActive: z.boolean().optional(),
});

export const updateDivisionSchema = createDivisionSchema.partial();
