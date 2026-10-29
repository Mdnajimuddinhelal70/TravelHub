"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDestinationSchema = exports.createDestinationSchema = void 0;
const zod_1 = require("zod");
exports.createDestinationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required").trim(),
    slug: zod_1.z.string().optional(),
    division: zod_1.z.string().min(1, "Division is required"),
    thumbnail: zod_1.z.string().optional(),
    images: zod_1.z.array(zod_1.z.string()).optional(),
    description: zod_1.z.string().optional(),
    location: zod_1.z
        .object({
        type: zod_1.z.literal("Point"),
        coordinates: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number()]),
    })
        .optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.updateDestinationSchema = exports.createDestinationSchema.partial();
