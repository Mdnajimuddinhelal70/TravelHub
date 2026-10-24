import { model, Schema } from "mongoose";
import { IPayment, PAYMENT_GATEWAY, PAYMENT_STATUS } from "./payment.interface";

/* ============================================================
 *  PAYMENT SCHEMA
 * ============================================================ */

const paymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gateway: {
      type: String,
      enum: Object.values(PAYMENT_GATEWAY),
      required: true,
    },
    transactionId: {
      type: String,
      trim: true,
      // required নয় — গেটওয়ে redirect-এর আগে থাকে না
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "BDT",
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    paymentGatewayData: {
      type: Schema.Types.Mixed,
    },
    failureReason: {
      type: String,
      trim: true,
    },
    invoiceUrl: {
      type: String,
      trim: true,
    },
    paidAt: {
      type: Date,
    },
    verifiedAt: {
      type: Date,
    },
    refundedAt: {
      type: Date,
    },
    refundAmount: {
      type: Number,
      min: 0,
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

paymentSchema.index({ transactionId: 1 }, { unique: true, sparse: true });
paymentSchema.index({ booking: 1, status: 1 });
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });

/* ============================================================
 *  HOOKS
 * ============================================================ */

// PAID/REFUNDED হলে timestamp সেট
paymentSchema.pre("save", function () {
  if (
    this.isModified("status") &&
    this.status === PAYMENT_STATUS.PAID &&
    !this.paidAt
  ) {
    this.paidAt = new Date();
  }
  if (
    this.isModified("status") &&
    this.status === PAYMENT_STATUS.REFUNDED &&
    !this.refundedAt
  ) {
    this.refundedAt = new Date();
  }
});

/* ============================================================
 *  MODEL
 * ============================================================ */

export const Payment = model<IPayment>("Payment", paymentSchema);
