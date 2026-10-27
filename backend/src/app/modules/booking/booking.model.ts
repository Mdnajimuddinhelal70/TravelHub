import { model, Schema } from "mongoose";
import {
  BOOKING_STATUS,
  IBooking,
  IContactInfo,
  IPriceBreakdown,
  ITraveler,
} from "./booking.interface";

const travelerSchema = new Schema<ITraveler>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
      max: 120,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    type: {
      type: String,
      enum: ["adult", "child"],
      required: true,
    },
    nidOrPassport: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const contactInfoSchema = new Schema<IContactInfo>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    emergencyContact: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const priceBreakdownSchema = new Schema<IPriceBreakdown>(
  {
    adultPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    childPrice: {
      type: Number,
      min: 0,
    },
    adultCount: {
      type: Number,
      required: true,
      min: 1,
    },
    childCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

/* ============================================================
 *  BOOKING SCHEMA
 * ============================================================ */

const bookingSchema = new Schema<IBooking>(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tour: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    tourDeparture: {
      type: Schema.Types.ObjectId,
      ref: "TourDeparture",
      required: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },

    travelers: {
      type: [travelerSchema],
      required: true,
      validate: {
        validator: (v: ITraveler[]) => v.length > 0,
        message: "At least one traveler is required",
      },
    },
    adultCount: {
      type: Number,
      required: true,
      min: 1,
    },
    childCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    guestCount: {
      type: Number,
      required: true,
      min: 1,
    },

    contactInfo: {
      type: contactInfoSchema,
      required: true,
    },

    priceBreakdown: {
      type: priceBreakdownSchema,
      required: true,
    },
    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
    },

    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
    reservationExpiresAt: {
      type: Date,
    },
    confirmedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },

    specialRequests: {
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

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ tourDeparture: 1, status: 1 });
bookingSchema.index({ status: 1, reservationExpiresAt: 1 });
bookingSchema.index({ tour: 1, status: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });

/* ============================================================
 *  HOOKS
 * ============================================================ */

// guestCount = adultCount + childCount — auto sync
bookingSchema.pre("save", function () {
  if (this.isModified("adultCount") || this.isModified("childCount")) {
    this.guestCount = this.adultCount + this.childCount;
  }
});

// Confirmed/Cancelled হলে timestamp সেট
bookingSchema.pre("save", function () {
  if (
    this.isModified("status") &&
    this.status === BOOKING_STATUS.CONFIRMED &&
    !this.confirmedAt
  ) {
    this.confirmedAt = new Date();
  }
  if (
    this.isModified("status") &&
    this.status === BOOKING_STATUS.CANCELLED &&
    !this.cancelledAt
  ) {
    this.cancelledAt = new Date();
  }
});

/* ============================================================
 *  MODEL
 * ============================================================ */

export const Booking = model<IBooking>("Booking", bookingSchema);
