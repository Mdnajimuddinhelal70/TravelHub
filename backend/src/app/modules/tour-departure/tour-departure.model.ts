import { model, Schema } from "mongoose";
import {
  ITourDeparture,
  TOUR_DEPARTURE_STATUS,
} from "./tour-departure.interface";

const tourDepartureSchema = new Schema<ITourDeparture>(
  {
    tour: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    pricePerPerson: {
      type: Number,
      required: true,
      min: [0.01, "Price must be greater than zero."],
    },
    totalSeats: {
      type: Number,
      required: true,
      min: [1, "Total seats must be at least 1."],
      validate: {
        validator: Number.isInteger,
        message: "Total seats must be an integer.",
      },
    },
    availableSeats: {
      type: Number,
      required: true,
      min: [0, "Available seats cannot be negative."],
      validate: {
        validator: Number.isInteger,
        message: "Available seats must be an integer.",
      },
    },
    status: {
      type: String,
      enum: Object.values(TOUR_DEPARTURE_STATUS),
      default: TOUR_DEPARTURE_STATUS.SCHEDULED,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

tourDepartureSchema.index({ tour: 1, startDate: 1 });

tourDepartureSchema.pre("validate", function () {
  const departure = this as typeof this & {
    availableSeats: number;
    totalSeats: number;
  };

  if (departure.availableSeats > departure.totalSeats) {
    departure.invalidate(
      "availableSeats",
      "Available seats cannot exceed total seats.",
    );
  }
});

export const TourDeparture = model<ITourDeparture>(
  "TourDeparture",
  tourDepartureSchema,
);
