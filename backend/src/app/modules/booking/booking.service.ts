// /* eslint-disable @typescript-eslint/no-explicit-any */
// import httpStatus from "http-status-codes";
// import AppError from "../../errorHelpers/AppError";
// import { getTransactionId } from "../../utils/getTransactionId";

// import { PAYMENT_STATUS } from "../payment/payment.interface";
// import { Payment } from "../payment/payment.model";
// import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
// import { SSLService } from "../sslCommerz/sslCommerz.service";
// import { Tour } from "../tour/tour.model";
// import { User } from "../user/user.model";
// import { BOOKING_STATUS, IBooking } from "./booking.interface";
// import { Booking } from "./booking.model";

// const createBooking = async (payload: Partial<IBooking>, userId: string) => {
//   const transactionId = getTransactionId();

//   const session = await Booking.startSession();
//   session.startTransaction();

//   try {
//     const user = await User.findById(userId);

//     if (!user?.phone || !user.address) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         "Please Update Your Profile to Book a Tour.",
//       );
//     }

//     const tour = await Tour.findById(payload.tour).select("costFrom");

//     if (!tour?.costFrom) {
//       throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found!");
//     }

//     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//     const amount = Number(tour.costFrom) * Number(payload.guestCount!);

//     const booking = await Booking.create(
//       [
//         {
//           user: userId,
//           status: BOOKING_STATUS.PENDING,
//           ...payload,
//         },
//       ],
//       { session },
//     );

//     const payment = await Payment.create(
//       [
//         {
//           booking: booking[0]._id,
//           status: PAYMENT_STATUS.UNPAID,
//           transactionId: transactionId,
//           amount: amount,
//         },
//       ],
//       { session },
//     );

//     const updatedBooking = await Booking.findByIdAndUpdate(
//       booking[0]._id,
//       { payment: payment[0]._id },
//       { new: true, runValidators: true, session },
//     )
//       .populate("user", "name email phone address")
//       .populate("tour", "title costFrom")
//       .populate("payment");

//     const userAddress = (updatedBooking?.user as any).address;
//     const userEmail = (updatedBooking?.user as any).email;
//     const userPhoneNumber = (updatedBooking?.user as any).phone;
//     const userName = (updatedBooking?.user as any).name;

//     const sslPayload: ISSLCommerz = {
//       address: userAddress,
//       email: userEmail,
//       phoneNumber: userPhoneNumber,
//       name: userName,
//       amount: amount,
//       transactionId: transactionId,
//     };

//     const sslPayment = await SSLService.sslPaymentInit(sslPayload);

//     console.log(sslPayment);

//     await session.commitTransaction(); //transaction
//     session.endSession();
//     return {
//       paymentUrl: sslPayment.GatewayPageURL,
//       booking: updatedBooking,
//     };
//   } catch (error) {
//     await session.abortTransaction(); // rollback
//     session.endSession();
//     throw error;
//   }
// };

// const getUserBookings = async () => {
//   return {};
// };

// const getBookingById = async () => {
//   return {};
// };

// const updateBookingStatus = async () => {
//   return {};
// };

// const getAllBookings = async () => {
//   return {};
// };

// export const BookingService = {
//   createBooking,
//   getUserBookings,
//   getBookingById,
//   updateBookingStatus,
//   getAllBookings,
// };

/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status-codes";
import mongoose from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { getTransactionId } from "../../utils/getTransactionId";

import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import {
  TOUR_DEPARTURE_STATUS as DEPARTURE_STATUS,
  TOUR_DEPARTURE_STATUS,
} from "../tour-departure/tour-departure.interface";
import { TourDeparture } from "../tour-departure/tour-departure.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";

const RESERVATION_DURATION_MS = 15 * 60 * 1000;

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const guestCount = Number(payload.guestCount);
  const departureId = payload.tourDeparture;

  if (!departureId || !mongoose.isValidObjectId(departureId)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A valid tour departure is required.",
    );
  }

  if (!Number.isInteger(guestCount) || guestCount < 1) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Guest count must be at least 1.",
    );
  }

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

  const session = await mongoose.startSession();

  let bookingId: mongoose.Types.ObjectId;
  let transactionId: string;
  let amount: number;

  try {
    session.startTransaction();

    // Atomically reserve seats to prevent overbooking.
    const departure = await TourDeparture.findOneAndUpdate(
      {
        _id: departureId,
        status: DEPARTURE_STATUS.OPEN,
        availableSeats: { $gte: guestCount },
      },
      {
        $inc: { availableSeats: -guestCount },
      },
      {
        new: true,
        runValidators: true,
        session,
      },
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

    const pricePerPerson = departure.pricePerPerson;
    amount = pricePerPerson * guestCount;

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid booking amount.");
    }

    const reservationExpiresAt = new Date(Date.now() + RESERVATION_DURATION_MS);

    const [booking] = await Booking.create(
      [
        {
          user: user._id,
          tourDeparture: departure._id,
          guestCount,
          pricePerPerson,
          totalAmount: amount,
          status: BOOKING_STATUS.PENDING,
          reservationExpiresAt,
        },
      ],
      { session },
    );

    transactionId = getTransactionId();

    const [payment] = await Payment.create(
      [
        {
          booking: booking._id,
          transactionId,
          amount,
          currency: "BDT",
          status: PAYMENT_STATUS.PENDING,
        },
      ],
      { session },
    );

    await Booking.findByIdAndUpdate(
      booking._id,
      { payment: payment._id },
      {
        new: true,
        runValidators: true,
        session,
      },
    );

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

  // Call the external gateway only after the database transaction commits.
  const sslPayload: ISSLCommerz = {
    address: user.address,
    email: user.email,
    phoneNumber: user.phone,
    name: user.name,
    amount,
    transactionId: transactionId!,
  };

  const sslPayment = await SSLService.sslPaymentInit(sslPayload);

  const booking = await Booking.findById(bookingId!)
    .populate("user", "name email phone address")
    .populate({
      path: "tourDeparture",
      populate: {
        path: "tour",
        select: "title slug",
      },
    })
    .populate("payment");

  return {
    paymentUrl: sslPayment.GatewayPageURL,
    booking,
  };
};

const getUserBookings = async () => {
  return {};
};

const getBookingById = async () => {
  return {};
};

const updateBookingStatus = async () => {
  return {};
};

const getAllBookings = async () => {
  return {};
};

export const BookingService = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  getAllBookings,
};
