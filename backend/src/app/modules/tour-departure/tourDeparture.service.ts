import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Booking } from "../booking/booking.model";
import { Tour } from "../tour/tour.model";
import {
  ITourDeparture,
  TOUR_DEPARTURE_STATUS,
} from "./tour-departure.interface";
import { TourDeparture } from "./tour-departure.model";

/* ============================================================
 *  CREATE
 * ============================================================ */
const createTourDeparture = async (payload: ITourDeparture) => {
  // ✅ tour exist করে কি না
  const tour = await Tour.findById(payload.tour);
  if (!tour) {
    throw new Error("Tour not found.");
  }

  // ✅ date validation
  if (new Date(payload.endDate) <= new Date(payload.startDate)) {
    throw new Error("End date must be after start date");
  }

  // ✅ একই tour + startDate-এ duplicate check
  const existing = await TourDeparture.findOne({
    tour: payload.tour,
    startDate: payload.startDate,
  });
  if (existing) {
    throw new Error("A departure already exists for this tour on this date.");
  }

  // ✅ availableSeats না দিলে totalSeats-ই হবে
  if (payload.availableSeats === undefined) {
    payload.availableSeats = payload.totalSeats;
  }
  if (payload.bookedSeats === undefined) {
    payload.bookedSeats = 0;
  }

  // ✅ seat arithmetic validation
  if (payload.availableSeats + payload.bookedSeats !== payload.totalSeats) {
    throw new Error("availableSeats + bookedSeats must equal totalSeats");
  }

  return await TourDeparture.create(payload);
};

const getAllTourDepartures = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(TourDeparture.find(), query);

  const departures = queryBuilder.filter().sort().fields().paginate();

  const [data, meta] = await Promise.all([
    departures
      .build()
      .populate("tour", "title slug coverImage duration price")
      .populate("guide", "name email"),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getDeparturesByTour = async (
  tourId: string,
  query: Record<string, string>,
) => {
  const tour = await Tour.findById(tourId);
  if (!tour) {
    throw new Error("Tour not found.");
  }

  const queryBuilder = new QueryBuilder(
    TourDeparture.find({ tour: tourId }),
    query,
  );

  const departures = queryBuilder.filter().sort().fields().paginate();

  const [data, meta] = await Promise.all([
    departures.build().populate("guide", "name"),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getSingleTourDeparture = async (id: string) => {
  const departure = await TourDeparture.findById(id)
    .populate("tour", "title slug coverImage duration price")
    .populate("guide", "name email");

  if (!departure) {
    throw new Error("Tour departure not found.");
  }

  return departure;
};

const updateTourDeparture = async (
  id: string,
  payload: Partial<ITourDeparture>,
) => {
  const existing = await TourDeparture.findById(id);
  if (!existing) {
    throw new Error("Tour departure not found.");
  }

  // ✅ date validation (একটা বা দুটোই বদলালে)
  const startDate = payload.startDate ?? existing.startDate;
  const endDate = payload.endDate ?? existing.endDate;
  if (new Date(endDate) <= new Date(startDate)) {
    throw new Error("End date must be after start date");
  }

  // ✅ totalSeats বদলালে availableSeats recalculate
  if (payload.totalSeats !== undefined) {
    if (payload.totalSeats < existing.bookedSeats) {
      throw new Error(
        `Cannot reduce total seats below booked seats (${existing.bookedSeats}).`,
      );
    }
    payload.availableSeats = payload.totalSeats - existing.bookedSeats;
  }

  // ✅ tour বা startDate বদলালে duplicate check
  if (payload.tour || payload.startDate) {
    const duplicate = await TourDeparture.findOne({
      _id: { $ne: id },
      tour: payload.tour ?? existing.tour,
      startDate: payload.startDate ?? existing.startDate,
    });
    if (duplicate) {
      throw new Error("A departure already exists for this tour on this date.");
    }
  }

  if (payload.tour) {
    const tour = await Tour.findById(payload.tour);
    if (!tour) {
      throw new Error("Tour not found.");
    }
  }

  const updated = await TourDeparture.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updated;
};

/* ============================================================
 *  DELETE
 * ============================================================ */
const deleteTourDeparture = async (id: string) => {
  const departure = await TourDeparture.findById(id);
  if (!departure) {
    throw new Error("Tour departure not found.");
  }

  // ✅ booking থাকলে delete আটকান
  const bookingCount = await Booking.countDocuments({ tourDeparture: id });
  if (bookingCount > 0) {
    throw new Error(
      `Cannot delete departure. ${bookingCount} booking(s) exist.`,
    );
  }

  await TourDeparture.findByIdAndDelete(id);
  return null;
};

/* ============================================================
 *  HELPER — atomic seat decrement (Booking service-এ ব্যবহার হবে)
 * ============================================================ */
const reserveSeats = async (departureId: string, seatCount: number) => {
  if (seatCount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Seat count must be positive");
  }

  const departure = await TourDeparture.findOneAndUpdate(
    {
      _id: departureId,
      status: {
        $in: [TOUR_DEPARTURE_STATUS.OPEN, TOUR_DEPARTURE_STATUS.SCHEDULED],
      },
      availableSeats: { $gte: seatCount },
    },
    [
      {
        $set: {
          availableSeats: { $subtract: ["$availableSeats", seatCount] },
          bookedSeats: { $add: ["$bookedSeats", seatCount] },
        },
      },
      {
        $set: {
          status: {
            $cond: [
              { $eq: ["$availableSeats", 0] },
              TOUR_DEPARTURE_STATUS.FULL,
              "$status",
            ],
          },
        },
      },
    ],
    { new: true },
  );

  if (!departure) {
    throw new AppError(httpStatus.CONFLICT, "Not enough seats available.");
  }

  return departure;
};
/* ============================================================
 *  HELPER — seat release (booking cancel/expire হলে)
 * ============================================================ */
const releaseSeats = async (departureId: string, seatCount: number) => {
  if (seatCount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Seat count must be positive");
  }

  const departure = await TourDeparture.findByIdAndUpdate(
    departureId,
    [
      {
        $set: {
          availableSeats: { $add: ["$availableSeats", seatCount] },
          bookedSeats: { $subtract: ["$bookedSeats", seatCount] },
        },
      },
      {
        $set: {
          status: {
            $cond: [
              {
                $and: [
                  { $gt: ["$availableSeats", 0] },
                  { $eq: ["$status", TOUR_DEPARTURE_STATUS.FULL] },
                ],
              },
              TOUR_DEPARTURE_STATUS.OPEN,
              "$status",
            ],
          },
        },
      },
    ],
    { new: true },
  );

  if (!departure) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour departure not found.");
  }

  return departure;
};

export const TourDepartureService = {
  createTourDeparture,
  getAllTourDepartures,
  getDeparturesByTour,
  getSingleTourDeparture,
  updateTourDeparture,
  deleteTourDeparture,
  reserveSeats,
  releaseSeats,
};
