import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

/* ============================================================
 *  TOUR TYPE SCHEMA
 * ============================================================ */

const tourTypeSchema = new Schema<ITourType>(
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
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
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
 *  TOUR SCHEMA
 * ============================================================ */

const tourPlanSchema = new Schema(
  {
    day: {
      type: Number,
      required: true,
      min: 1,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    meals: {
      type: [String],
      default: [],
    },
    accommodation: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const tourSchema = new Schema<ITour>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    destinations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Destination",
        required: true,
      },
    ],
    primaryDestination: {
      type: Schema.Types.ObjectId,
      ref: "Destination",
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },
    category: {
      type: String,
      enum: ["group", "family", "honeymoon", "adventure", "corporate"],
    },
    difficulty: {
      type: String,
      enum: ["easy", "moderate", "hard"],
    },
    duration: {
      days: {
        type: Number,
        required: true,
        min: 1,
      },
      nights: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    price: {
      adult: {
        type: Number,
        required: true,
        min: 0,
      },
      child: {
        type: Number,
        min: 0,
      },
      discountPercent: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
    },
    included: {
      type: [String],
      default: [],
    },
    excluded: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    tourPlan: {
      type: [tourPlanSchema],
      default: [],
    },
    minGroupSize: {
      type: Number,
      min: 1,
    },
    maxGuest: {
      type: Number,
      min: 1,
    },
    minAge: {
      type: Number,
      min: 0,
    },
    cancellationPolicy: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
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

// Text search (title + description)
tourSchema.index({ title: "text", description: "text" });

// Filter + sort
tourSchema.index({ tourType: 1, status: 1 });
tourSchema.index({ destinations: 1 });
tourSchema.index({ primaryDestination: 1 });
tourSchema.index({ "price.adult": 1 });
tourSchema.index({ rating: -1 });
tourSchema.index({ createdAt: -1 });

// tourTypeSchema-এর জন্য
tourTypeSchema.index({ isActive: 1 });

/* ============================================================
 *  MODELS
 * ============================================================ */

export const TourType = model<ITourType>("TourType", tourTypeSchema);
export const Tour = model<ITour>("Tour", tourSchema);
