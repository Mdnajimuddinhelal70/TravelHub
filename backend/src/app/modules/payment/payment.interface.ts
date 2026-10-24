import { Types } from "mongoose";

export enum PAYMENT_STATUS {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  PAID = "PAID",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum PAYMENT_GATEWAY {
  SSLCOMMERZ = "sslcommerz",
  BKASH = "bkash",
  NAGAD = "nagad",
  STRIPE = "stripe",
  MANUAL = "manual",
}

export interface IPayment {
  booking: Types.ObjectId;
  user: Types.ObjectId; // denormalized for quick lookup
  gateway: PAYMENT_GATEWAY;
  transactionId?: string; // optional initially, unique when set
  amount: number;
  currency: string; // default 'BDT'
  status: PAYMENT_STATUS;
  paymentGatewayData?: Record<string, unknown>;
  failureReason?: string;
  invoiceUrl?: string;
  paidAt?: Date;
  verifiedAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
