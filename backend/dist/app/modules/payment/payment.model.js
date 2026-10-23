"use strict";
// import { model, Schema } from "mongoose";
// import { IPayment, PAYMENT_STATUS } from "./payment.interface";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
// const paymentSchema = new Schema<IPayment>(
//   {
//     booking: {
//       type: Schema.Types.ObjectId,
//       ref: "Booking",
//       required: true,
//       unique: true,
//     },
//     transactionId: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     status: {
//       type: String,
//       enum: Object.values(PAYMENT_STATUS),
//       default: PAYMENT_STATUS.UNPAID,
//     },
//     amount: {
//       type: Number,
//       required: true,
//     },
//     paymentGatewayData: {
//       type: Schema.Types.Mixed,
//     },
//     invoiceUrl: {
//       type: String,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );
// export const Payment = model<IPayment>("Payment", paymentSchema);
const mongoose_1 = require("mongoose");
const payment_interface_1 = require("./payment.interface");
const paymentSchema = new mongoose_1.Schema({
    booking: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
        index: true,
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
        min: [0.01, "Payment amount must be greater than zero."],
    },
    currency: {
        type: String,
        required: true,
        default: "BDT",
        uppercase: true,
        trim: true,
    },
    status: {
        type: String,
        enum: Object.values(payment_interface_1.PAYMENT_STATUS),
        default: payment_interface_1.PAYMENT_STATUS.PENDING,
        required: true,
    },
    paymentGatewayData: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    invoiceUrl: {
        type: String,
        trim: true,
    },
    verifiedAt: {
        type: Date,
    },
}, {
    timestamps: true,
    versionKey: false,
});
paymentSchema.index({ booking: 1, createdAt: -1 });
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);
