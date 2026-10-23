// import { model, Schema } from "mongoose";
// import { BOOKING_STATUS, IBooking } from "./booking.interface";

// const bookingSchema = new Schema<IBooking>(
//   {
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     tour: {
//       type: Schema.Types.ObjectId,
//       ref: "Tour",
//       required: true,
//     },
//     payment: {
//       type: Schema.Types.ObjectId,
//       ref: "Payment",
//     },
//     status: {
//       type: String,
//       enum: Object.values(BOOKING_STATUS),
//       default: BOOKING_STATUS.PENDING,
//     },
//     guestCount: {
//       type: Number,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// export const Booking = model<IBooking>("Booking", bookingSchema);

import { model, Schema } from "mongoose";
import { BOOKING_STATUS, IBooking } from "./booking.interface";

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tourDeparture: {
      type: Schema.Types.ObjectId,
      ref: "TourDeparture",
      required: true,
      index: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    guestCount: {
      type: Number,
      required: true,
      min: [1, "Guest count must be at least 1."],
      validate: {
        validator: Number.isInteger,
        message: "Guest count must be an integer.",
      },
    },
    pricePerPerson: {
      type: Number,
      required: true,
      min: [0.01, "Price must be greater than zero."],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0.01, "Total amount must be greater than zero."],
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
      required: true,
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

bookingSchema.index({ status: 1, reservationExpiresAt: 1 });

export const Booking = model<IBooking>("Booking", bookingSchema);
