/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status-codes";
import mongoose from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { getTransactionId } from "../../utils/getTransactionId";

import { PAYMENT_GATEWAY, PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { TOUR_DEPARTURE_STATUS } from "../tour-departure/tour-departure.interface";
import { TourDeparture } from "../tour-departure/tour-departure.model";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";

import { bookingSearchableFields } from "./booking.constant";
import { BOOKING_STATUS, IBooking, ITraveler } from "./booking.interface";
import { Booking } from "./booking.model";

const RESERVATION_DURATION_MS = 15 * 60 * 1000;

/* ============================================================
 *  STATUS TRANSITION RULES
 * ============================================================ */
const ALLOWED_TRANSITIONS: Record<BOOKING_STATUS, BOOKING_STATUS[]> = {
  [BOOKING_STATUS.PENDING]: [
    BOOKING_STATUS.CONFIRMED,
    BOOKING_STATUS.CANCELLED,
    BOOKING_STATUS.EXPIRED,
    BOOKING_STATUS.FAILED,
  ],
  [BOOKING_STATUS.CONFIRMED]: [
    BOOKING_STATUS.COMPLETED,
    BOOKING_STATUS.CANCELLED,
  ],
  [BOOKING_STATUS.CANCELLED]: [],
  [BOOKING_STATUS.COMPLETED]: [],
  [BOOKING_STATUS.FAILED]: [BOOKING_STATUS.PENDING], // retry
  [BOOKING_STATUS.EXPIRED]: [],
};

/* ============================================================
 *  HELPERS
 * ============================================================ */

// Daily sequence-ভিত্তিক atomic booking number
const generateBookingNumber = async (
  session: mongoose.ClientSession,
): Promise<string> => {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const dateKey = `${y}${m}${d}`;

  const counterCollection = mongoose.connection.collection("counters");
  const result = await counterCollection.findOneAndUpdate(
    { _id: `booking-${dateKey}` as any },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: "after", session },
  );

  const seq = (result?.seq as number) ?? 1;
  return `TH-${dateKey}-${String(seq).padStart(4, "0")}`;
};

// travelers থেকে count derive করো — single source of truth
const deriveCounts = (travelers: ITraveler[]) => {
  const adultCount = travelers.filter((t) => t.type === "adult").length;
  const childCount = travelers.filter((t) => t.type === "child").length;
  return { adultCount, childCount, guestCount: travelers.length };
};

/**
 * Seat reserve (atomic, with session support)
 * ✅ availableSeats কমে, bookedSeats বাড়ে — model hook-এর সাথে consistent
 */
const reserveSeatsInSession = async (
  departureId: mongoose.Types.ObjectId | string,
  guestCount: number,
  session: mongoose.ClientSession,
) => {
  const departure = await TourDeparture.findOneAndUpdate(
    {
      _id: departureId,
      status: {
        $in: [TOUR_DEPARTURE_STATUS.OPEN, TOUR_DEPARTURE_STATUS.SCHEDULED],
      },
      availableSeats: { $gte: guestCount },
    },
    {
      $inc: { availableSeats: -guestCount, bookedSeats: guestCount },
    },
    { new: true, session },
  );

  if (!departure) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Departure is unavailable or there are not enough seats.",
    );
  }

  if (departure.availableSeats === 0) {
    departure.status = TOUR_DEPARTURE_STATUS.FULL;
    await departure.save({ session });
  }

  return departure;
};

/**
 * Seat release (atomic, with session support)
 * ✅ availableSeats বাড়ে, bookedSeats কমে — FULL হলে OPEN-এ ফেরত
 */
const releaseSeatsInSession = async (
  departureId: mongoose.Types.ObjectId | string,
  guestCount: number,
  session: mongoose.ClientSession,
) => {
  const departure = await TourDeparture.findByIdAndUpdate(
    departureId,
    {
      $inc: { availableSeats: guestCount, bookedSeats: -guestCount },
    },
    { new: true, session },
  );

  if (
    departure &&
    departure.availableSeats > 0 &&
    departure.status === TOUR_DEPARTURE_STATUS.FULL
  ) {
    departure.status = TOUR_DEPARTURE_STATUS.OPEN;
    await departure.save({ session });
  }
};

/* ============================================================
 *  CREATE BOOKING
 * ============================================================ */
const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const departureId = payload.tourDeparture;
  const travelers = payload.travelers ?? [];

  // ---------- Input validation ----------
  if (!departureId || !mongoose.isValidObjectId(departureId)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A valid tour departure is required.",
    );
  }

  if (!Array.isArray(travelers) || travelers.length < 1) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "At least one traveler is required.",
    );
  }

  if (
    !payload.contactInfo?.name ||
    !payload.contactInfo?.phone ||
    !payload.contactInfo?.email
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Contact name, phone, and email are required.",
    );
  }

  const { adultCount, childCount, guestCount } = deriveCounts(travelers);

  if (adultCount < 1) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "At least one adult traveler is required.",
    );
  }

  // ---------- User check ----------
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }
  if (!user.phone || !user.address) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please update your profile before booking a tour.",
    );
  }

  // ---------- Transaction ----------
  const session = await mongoose.startSession();

  let bookingId: mongoose.Types.ObjectId | undefined;
  let transactionId: string | undefined;
  let amount = 0;
  let reservedGuestCount = 0;

  try {
    session.startTransaction();

    // 1) Atomically reserve seats (available--, booked++)
    const departure = await reserveSeatsInSession(
      departureId,
      guestCount,
      session,
    );
    reservedGuestCount = guestCount;

    // 2) Price snapshot
    const adultPrice = departure.pricePerPerson;
    const childPrice = payload.priceBreakdown?.childPrice;
    const subtotal = adultPrice * adultCount + (childPrice ?? 0) * childCount;
    const discountAmount = payload.priceBreakdown?.discountAmount ?? 0;
    amount = subtotal - discountAmount;

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid booking amount.");
    }

    // 3) Booking number
    const bookingNumber = await generateBookingNumber(session);

    // 4) Create Booking
    const [booking] = await Booking.create(
      [
        {
          bookingNumber,
          user: user._id,
          tour: departure.tour,
          tourDeparture: departure._id,
          travelers,
          adultCount,
          childCount,
          guestCount,
          contactInfo: payload.contactInfo,
          priceBreakdown: {
            adultPrice,
            childPrice,
            adultCount,
            childCount,
            subtotal,
            discountAmount,
            total: amount,
          },
          couponCode: payload.couponCode,
          specialRequests: payload.specialRequests,
          status: BOOKING_STATUS.PENDING,
          reservationExpiresAt: new Date(Date.now() + RESERVATION_DURATION_MS),
        },
      ],
      { session },
    );

    // 5) Create payment
    transactionId = getTransactionId();
    const [payment] = await Payment.create(
      [
        {
          booking: booking._id,
          user: user._id,
          gateway: PAYMENT_GATEWAY.SSLCOMMERZ,
          transactionId,
          amount,
          currency: "BDT",
          status: PAYMENT_STATUS.PENDING,
        },
      ],
      { session },
    );

    // 6) Link payment back to booking
    booking.payment = payment._id;
    await booking.save({ session });

    bookingId = booking._id;

    await session.commitTransaction();
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    await session.endSession();
  }

  // ---------- External gateway (after DB commit) ----------
  const sslPayload: ISSLCommerz = {
    address: user.address!,
    email: user.email,
    phoneNumber: user.phone!,
    name: user.name,
    amount,
    transactionId: transactionId!,
  };

  let paymentUrl: string | undefined;
  try {
    const sslPayment = await SSLService.sslPaymentInit(sslPayload);
    paymentUrl = sslPayment.GatewayPageURL;
  } catch (err: any) {
    // ✅ Gateway fail → payment FAILED, booking FAILED, seats ফেরত
    await Payment.findOneAndUpdate(
      { transactionId },
      { status: PAYMENT_STATUS.FAILED },
    );

    const failSession = await mongoose.startSession();
    try {
      failSession.startTransaction();

      const failedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: BOOKING_STATUS.FAILED },
        { new: true, session: failSession },
      );

      if (failedBooking && reservedGuestCount > 0) {
        await releaseSeatsInSession(
          failedBooking.tourDeparture,
          reservedGuestCount,
          failSession,
        );
      }

      await failSession.commitTransaction();
    } catch (releaseErr) {
      if (failSession.inTransaction()) await failSession.abortTransaction();
      // release fail হলেও original error-ই throw করি
    } finally {
      await failSession.endSession();
    }

    throw new AppError(
      httpStatus.BAD_GATEWAY,
      "Payment gateway initialization failed. Please try again.",
    );
  }

  const booking = await Booking.findById(bookingId)
    .populate("user", "name email phone address")
    .populate({
      path: "tourDeparture",
      populate: { path: "tour", select: "title slug" },
    })
    .populate("payment");

  return { paymentUrl, booking };
};

/* ============================================================
 *  GET USER BOOKINGS
 * ============================================================ */
const getUserBookings = async (
  userId: string,
  query: Record<string, string>,
) => {
  const filter = { user: new mongoose.Types.ObjectId(userId) };
  const qb = new QueryBuilder(Booking.find(filter), query);

  const docsQuery = qb
    .search(bookingSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    docsQuery
      .build()
      .populate("tour", "title slug coverImage price")
      .populate({
        path: "tourDeparture",
        select: "startDate endDate",
      })
      .populate("payment", "status amount transactionId"),
    qb.getMeta(),
  ]);

  return { data, meta };
};

/* ============================================================
 *  GET SINGLE BOOKING (ownership checked)
 * ============================================================ */
const getBookingById = async (
  bookingId: string,
  requester: { userId: string; role: Role },
) => {
  if (!mongoose.isValidObjectId(bookingId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid booking id.");
  }

  const booking = await Booking.findById(bookingId)
    .populate("user", "name email phone address")
    .populate({
      path: "tourDeparture",
      populate: { path: "tour", select: "title slug coverImage" },
    })
    .populate("payment");

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found.");
  }

  const isOwner = booking.user._id.toString() === requester.userId;
  const isAdmin =
    requester.role === Role.ADMIN || requester.role === Role.SUPER_ADMIN;

  if (!isOwner && !isAdmin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to view this booking.",
    );
  }

  return booking;
};

/* ============================================================
 *  UPDATE BOOKING STATUS
 * ============================================================ */
const updateBookingStatus = async (
  bookingId: string,
  newStatus: BOOKING_STATUS,
  requester: { userId: string; role: Role },
  cancellationReason?: string,
) => {
  if (!mongoose.isValidObjectId(bookingId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid booking id.");
  }

  const session = await mongoose.startSession();
  let updated: any;

  try {
    session.startTransaction();

    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, "Booking not found.");
    }

    const isOwner = booking.user.toString() === requester.userId;
    const isAdmin =
      requester.role === Role.ADMIN || requester.role === Role.SUPER_ADMIN;

    // Permission rules
    if (!isAdmin) {
      if (!isOwner) {
        throw new AppError(httpStatus.FORBIDDEN, "Access denied.");
      }
      if (newStatus !== BOOKING_STATUS.CANCELLED) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You can only cancel your own booking.",
        );
      }
    }

    // Transition validation
    const allowed = ALLOWED_TRANSITIONS[booking.status] ?? [];
    if (!allowed.includes(newStatus)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Cannot change status from ${booking.status} to ${newStatus}.`,
      );
    }

    const wasActive =
      booking.status === BOOKING_STATUS.PENDING ||
      booking.status === BOOKING_STATUS.CONFIRMED;

    const wasFailed = booking.status === BOOKING_STATUS.FAILED;

    // Cancel/Expire/Fail → seats ফেরত
    if (
      wasActive &&
      (newStatus === BOOKING_STATUS.CANCELLED ||
        newStatus === BOOKING_STATUS.EXPIRED ||
        newStatus === BOOKING_STATUS.FAILED)
    ) {
      await releaseSeatsInSession(
        booking.tourDeparture,
        booking.guestCount,
        session,
      );
    }

    // FAILED → PENDING (retry) → seats আবার reserve
    if (wasFailed && newStatus === BOOKING_STATUS.PENDING) {
      await reserveSeatsInSession(
        booking.tourDeparture,
        booking.guestCount,
        session,
      );
    }

    booking.status = newStatus;
    if (newStatus === BOOKING_STATUS.CANCELLED && cancellationReason) {
      booking.cancellationReason = cancellationReason;
    }
    await booking.save({ session });

    updated = booking;

    await session.commitTransaction();
  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }

  return updated;
};

/* ============================================================
 *  GET ALL BOOKINGS (admin)
 * ============================================================ */
const getAllBookings = async (query: Record<string, string>) => {
  const qb = new QueryBuilder(Booking.find(), query);

  const docsQuery = qb
    .search(bookingSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    docsQuery
      .build()
      .populate("user", "name email phone")
      .populate("tour", "title slug")
      .populate({ path: "tourDeparture", select: "startDate endDate" })
      .populate("payment", "status amount transactionId"),
    qb.getMeta(),
  ]);

  return { data, meta };
};

/* ============================================================
 *  EXPIRE STALE RESERVATIONS (cron-friendly)
 * ============================================================ */
const expireStaleReservations = async () => {
  const now = new Date();

  const staleBookings = await Booking.find({
    status: BOOKING_STATUS.PENDING,
    reservationExpiresAt: { $lte: now },
  }).select("_id");

  const results = await Promise.allSettled(
    staleBookings.map((b) =>
      updateBookingStatus(b._id.toString(), BOOKING_STATUS.EXPIRED, {
        userId: "system",
        role: Role.SUPER_ADMIN,
      }),
    ),
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  return { processed: staleBookings.length, succeeded };
};

export const BookingService = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  getAllBookings,
  expireStaleReservations,
};
