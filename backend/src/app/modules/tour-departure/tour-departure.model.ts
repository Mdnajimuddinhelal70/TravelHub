import { model, Schema } from "mongoose";
import {
  ITourDeparture,
  TOUR_DEPARTURE_STATUS,
} from "./tour-departure.interface";

/* ============================================================
 *  TOUR DEPARTURE SCHEMA
 * ============================================================ */

const tourDepartureSchema = new Schema<ITourDeparture>(
  {
    tour: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
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
      min: 0,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    bookedSeats: {
      type: Number,
      default: 0,
      min: 0,
    },
    minGroupSize: {
      type: Number,
      min: 1,
    },
    status: {
      type: String,
      enum: Object.values(TOUR_DEPARTURE_STATUS),
      default: TOUR_DEPARTURE_STATUS.SCHEDULED,
    },
    guide: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    meetingPoint: {
      type: String,
      trim: true,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
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

tourDepartureSchema.index({ tour: 1, startDate: 1 }, { unique: true });
tourDepartureSchema.index({ status: 1, startDate: 1 });
tourDepartureSchema.index({ tour: 1, status: 1 });

/* ============================================================
 *  HOOKS
 * ============================================================ */

// endDate > startDate
tourDepartureSchema.pre("validate", function () {
  if (this.startDate && this.endDate && this.endDate <= this.startDate) {
    throw new Error("End date must be after start date");
  }
});

// availableSeats + bookedSeats = totalSeats
tourDepartureSchema.pre("validate", function () {
  if (this.availableSeats + this.bookedSeats !== this.totalSeats) {
    throw new Error("availableSeats + bookedSeats must equal totalSeats");
  }
});

// availableSeats 0 হলে FULL, ফিরে এলে OPEN
tourDepartureSchema.pre("save", function () {
  if (
    this.isModified("availableSeats") &&
    this.availableSeats === 0 &&
    this.status === TOUR_DEPARTURE_STATUS.OPEN
  ) {
    this.status = TOUR_DEPARTURE_STATUS.FULL;
  }
  if (
    this.isModified("availableSeats") &&
    this.availableSeats > 0 &&
    this.status === TOUR_DEPARTURE_STATUS.FULL
  ) {
    this.status = TOUR_DEPARTURE_STATUS.OPEN;
  }
});

/* ============================================================
 *  MODEL
 * ============================================================ */

export const TourDeparture = model<ITourDeparture>(
  "TourDeparture",
  tourDepartureSchema,
);
