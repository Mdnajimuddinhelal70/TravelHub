"use strict";
// import { model, Schema } from "mongoose";
// import { BOOKING_STATUS, IBooking } from "./booking.interface";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
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
const mongoose_1 = require("mongoose");
const booking_interface_1 = require("./booking.interface");
const bookingSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    tourDeparture: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "TourDeparture",
        required: true,
        index: true,
    },
    payment: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        enum: Object.values(booking_interface_1.BOOKING_STATUS),
        default: booking_interface_1.BOOKING_STATUS.PENDING,
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
}, {
    timestamps: true,
    versionKey: false,
});
bookingSchema.index({ status: 1, reservationExpiresAt: 1 });
exports.Booking = (0, mongoose_1.model)("Booking", bookingSchema);
