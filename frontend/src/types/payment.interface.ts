export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentGateway =
  | "sslcommerz"
  | "bkash"
  | "nagad"
  | "stripe"
  | "manual";

export interface IPayment {
  _id: string;
  booking: string;
  user: string;
  gateway: PaymentGateway;
  transactionId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  invoiceUrl?: string;
  failureReason?: string;
  paidAt?: string;
  verifiedAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt: string;
}
