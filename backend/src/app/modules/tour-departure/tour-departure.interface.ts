import { Types } from "mongoose";

export enum TOUR_DEPARTURE_STATUS {
  SCHEDULED = "SCHEDULED",
  OPEN = "OPEN",
  FULL = "FULL",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface ITourDeparture {
  tour: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  pricePerPerson: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: number;
  minGroupSize?: number;
  status: TOUR_DEPARTURE_STATUS;
  guide?: Types.ObjectId;
  meetingPoint?: string;
  cancellationReason?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
