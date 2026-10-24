import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
    districts: {
      type: [String],
      default: [],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: undefined,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/* ============================================================
 *  INDEXES
 * ============================================================ */

// Geo query (near me, map)
divisionSchema.index({ location: "2dsphere" });

// Filter
divisionSchema.index({ isActive: 1 });
divisionSchema.index({ name: "text", description: "text" });

/* ============================================================
 *  MODEL
 * ============================================================ */

export const Division = model<IDivision>("Division", divisionSchema);
