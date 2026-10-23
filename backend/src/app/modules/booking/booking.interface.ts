// // User - Booking(Pending) -> Payment (Unpaid) -> SSLCommerz -> Booking update = confirm -> Payment update = Paid

// import { Types } from "mongoose";

// export enum BOOKING_STATUS {
//   PENDING = "PENDING",
//   CANCEL = "CANCEL",
//   COMPLETE = "COMPLETE",
//   FAILED = "FAILED",
// }

// export interface IBooking {
//   user: Types.ObjectId;
//   tour: Types.ObjectId;
//   payment?: Types.ObjectId;
//   guestCount: number;
//   status: BOOKING_STATUS;
//   createdAt?: Date;
// }

import { Types } from "mongoose";

export enum BOOKING_STATUS {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  EXPIRED = "EXPIRED",
}

export interface IBooking {
  user: Types.ObjectId;
  tourDeparture: Types.ObjectId;
  payment?: Types.ObjectId;
  guestCount: number;
  pricePerPerson: number;
  totalAmount: number;
  status: BOOKING_STATUS;
  reservationExpiresAt?: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
