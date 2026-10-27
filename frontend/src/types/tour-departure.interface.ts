import type { ITour } from "./tour.interface";

export type TourDepartureStatus =
  | "SCHEDULED"
  | "OPEN"
  | "FULL"
  | "CANCELLED"
  | "COMPLETED";

export interface ITourDeparture {
  _id: string;
  tour: ITour | string;
  startDate: string;
  endDate: string;
  pricePerPerson: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: number;
  minGroupSize?: number;
  status: TourDepartureStatus;
  guide?: string;
  meetingPoint?: string;
  cancellationReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
