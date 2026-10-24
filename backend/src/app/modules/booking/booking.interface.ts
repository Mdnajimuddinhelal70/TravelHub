import { Types } from "mongoose";

export enum BOOKING_STATUS {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  EXPIRED = "EXPIRED",
}

export interface ITraveler {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  type: "adult" | "child";
  nidOrPassport?: string;
}

export interface IContactInfo {
  name: string;
  phone: string;
  email: string;
  emergencyContact?: string;
}

export interface IPriceBreakdown {
  adultPrice: number;
  childPrice?: number;
  adultCount: number;
  childCount: number;
  subtotal: number;
  discountAmount: number;
  total: number;
}

export interface IBooking {
  bookingNumber: string; // "TH-20250115-0001"
  user: Types.ObjectId;
  tour: Types.ObjectId; // denormalized for queries
  tourDeparture: Types.ObjectId;
  payment?: Types.ObjectId; // quick access (source of truth: payment.booking)

  travelers: ITraveler[];
  adultCount: number;
  childCount: number;
  guestCount: number; // adultCount + childCount

  contactInfo: IContactInfo;

  priceBreakdown: IPriceBreakdown;
  couponCode?: string;

  status: BOOKING_STATUS;
  reservationExpiresAt?: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;

  specialRequests?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
