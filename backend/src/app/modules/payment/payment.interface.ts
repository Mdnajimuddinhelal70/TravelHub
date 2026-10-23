// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Types } from "mongoose";

// export enum PAYMENT_STATUS {
//   PAID = "PAID",
//   UNPAID = "UNPAID",
//   CANCELLED = "CANCELLED",
//   FAILED = "FAILED",
//   REFUNDED = "REFUNDED",
// }

// export interface IPayment {
//   booking: Types.ObjectId;
//   transactionId: string;
//   amount: number;
//   paymentGatewayData?: any;
//   invoiceUrl?: string;
//   status: PAYMENT_STATUS;
// }

import { Types } from "mongoose";

export enum PAYMENT_STATUS {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  PAID = "PAID",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export interface IPayment {
  booking: Types.ObjectId;
  transactionId: string;
  amount: number;
  currency: string;
  status: PAYMENT_STATUS;
  paymentGatewayData?: Record<string, unknown>;
  invoiceUrl?: string;
  verifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
