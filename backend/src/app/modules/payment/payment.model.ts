// import { model, Schema } from "mongoose";
// import { IPayment, PAYMENT_STATUS } from "./payment.interface";

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

import { model, Schema } from "mongoose";
import { IPayment, PAYMENT_STATUS } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
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
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
      required: true,
    },
    paymentGatewayData: {
      type: Schema.Types.Mixed,
    },
    invoiceUrl: {
      type: String,
      trim: true,
    },
    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

paymentSchema.index({ booking: 1, createdAt: -1 });

export const Payment = model<IPayment>("Payment", paymentSchema);
