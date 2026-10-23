import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

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
  },
  {
    timestamps: true,
    versionKey: false,
  },
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
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
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
      type: [String],
      default: [],
    },
    maxGuest: {
      type: Number,
      min: 1,
    },
    minAge: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const TourType = model<ITourType>("TourType", tourTypeSchema);
export const Tour = model<ITour>("Tour", tourSchema);
