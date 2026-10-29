"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const payment_interface_1 = require("./payment.interface");
/* ============================================================
 *  PAYMENT SCHEMA
 * ============================================================ */
const paymentSchema = new mongoose_1.Schema({
    booking: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    gateway: {
        type: String,
        enum: Object.values(payment_interface_1.PAYMENT_GATEWAY),
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
        enum: Object.values(payment_interface_1.PAYMENT_STATUS),
        default: payment_interface_1.PAYMENT_STATUS.PENDING,
    },
    paymentGatewayData: {
        type: mongoose_1.Schema.Types.Mixed,
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
}, {
    timestamps: true,
    versionKey: false,
});
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
    if (this.isModified("status") &&
        this.status === payment_interface_1.PAYMENT_STATUS.PAID &&
        !this.paidAt) {
        this.paidAt = new Date();
    }
    if (this.isModified("status") &&
        this.status === payment_interface_1.PAYMENT_STATUS.REFUNDED &&
        !this.refundedAt) {
        this.refundedAt = new Date();
    }
});
/* ============================================================
 *  MODEL
 * ============================================================ */
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);
