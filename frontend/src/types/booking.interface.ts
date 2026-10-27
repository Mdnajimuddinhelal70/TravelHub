import { IPayment } from "./payment.interface";
import type { ITourDeparture } from "./tour-departure.interface";
import type { ITour } from "./tour.interface";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "FAILED"
  | "EXPIRED";

export type TravelerGender = "male" | "female" | "other";
export type TravelerType = "adult" | "child";

export interface ITraveler {
  name: string;
  age: number;
  gender: TravelerGender;
  type: TravelerType;
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
  _id: string;
  bookingNumber: string;
  user: { _id: string; name: string; email: string; phone?: string } | string;
  tour: ITour | string;
  tourDeparture: ITourDeparture | string;
  payment?: IPayment | string;
  travelers: ITraveler[];
  adultCount: number;
  childCount: number;
  guestCount: number;
  contactInfo: IContactInfo;
  priceBreakdown: IPriceBreakdown;
  couponCode?: string;
  status: BookingStatus;
  reservationExpiresAt?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateBookingPayload {
  tourDeparture: string;
  travelers: ITraveler[];
  contactInfo: IContactInfo;
  specialRequests?: string;
  couponCode?: string;
  priceBreakdown?: {
    childPrice?: number;
    discountAmount?: number;
  };
}

export interface ICreateBookingResponse {
  paymentUrl?: string;
  booking: IBooking;
}
