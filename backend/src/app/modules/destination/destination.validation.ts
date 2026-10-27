import { z } from "zod";

export const createDestinationSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  slug: z.string().optional(),
  division: z.string().min(1, "Division is required"),
  thumbnail: z.string().optional(),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),
  location: z
    .object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  isActive: z.boolean().optional(),
});

export const updateDestinationSchema = createDestinationSchema.partial();
