"use strict";
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import httpStatus from "http-status-codes";
// import AppError from "../../errorHelpers/AppError";
// import { getTransactionId } from "../../utils/getTransactionId";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
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
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const getTransactionId_1 = require("../../utils/getTransactionId");
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const tour_departure_interface_1 = require("../tour-departure/tour-departure.interface");
const tour_departure_model_1 = require("../tour-departure/tour-departure.model");
const user_model_1 = require("../user/user.model");
const booking_interface_1 = require("./booking.interface");
const booking_model_1 = require("./booking.model");
const RESERVATION_DURATION_MS = 15 * 60 * 1000;
const createBooking = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const guestCount = Number(payload.guestCount);
    const departureId = payload.tourDeparture;
    if (!departureId || !mongoose_1.default.isValidObjectId(departureId)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "A valid tour departure is required.");
    }
    if (!Number.isInteger(guestCount) || guestCount < 1) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Guest count must be at least 1.");
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found.");
    }
    if (!user.phone || !user.address) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please update your profile before booking a tour.");
    }
    const session = yield mongoose_1.default.startSession();
    let bookingId;
    let transactionId;
    let amount;
    try {
        session.startTransaction();
        // Atomically reserve seats to prevent overbooking.
        const departure = yield tour_departure_model_1.TourDeparture.findOneAndUpdate({
            _id: departureId,
            status: tour_departure_interface_1.TOUR_DEPARTURE_STATUS.OPEN,
            availableSeats: { $gte: guestCount },
        }, {
            $inc: { availableSeats: -guestCount },
        }, {
            new: true,
            runValidators: true,
            session,
        });
        if (!departure) {
            throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "Departure is unavailable or there are not enough seats.");
        }
        if (departure.availableSeats === 0) {
            departure.status = tour_departure_interface_1.TOUR_DEPARTURE_STATUS.FULL;
            yield departure.save({ session });
        }
        const pricePerPerson = departure.pricePerPerson;
        amount = pricePerPerson * guestCount;
        if (!Number.isFinite(amount) || amount <= 0) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid booking amount.");
        }
        const reservationExpiresAt = new Date(Date.now() + RESERVATION_DURATION_MS);
        const [booking] = yield booking_model_1.Booking.create([
            {
                user: user._id,
                tourDeparture: departure._id,
                guestCount,
                pricePerPerson,
                totalAmount: amount,
                status: booking_interface_1.BOOKING_STATUS.PENDING,
                reservationExpiresAt,
            },
        ], { session });
        transactionId = (0, getTransactionId_1.getTransactionId)();
        const [payment] = yield payment_model_1.Payment.create([
            {
                booking: booking._id,
                transactionId,
                amount,
                currency: "BDT",
                status: payment_interface_1.PAYMENT_STATUS.PENDING,
            },
        ], { session });
        yield booking_model_1.Booking.findByIdAndUpdate(booking._id, { payment: payment._id }, {
            new: true,
            runValidators: true,
            session,
        });
        bookingId = booking._id;
        yield session.commitTransaction();
    }
    catch (error) {
        if (session.inTransaction()) {
            yield session.abortTransaction();
        }
        throw error;
    }
    finally {
        yield session.endSession();
    }
    // Call the external gateway only after the database transaction commits.
    const sslPayload = {
        address: user.address,
        email: user.email,
        phoneNumber: user.phone,
        name: user.name,
        amount,
        transactionId: transactionId,
    };
    const sslPayment = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
    const booking = yield booking_model_1.Booking.findById(bookingId)
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
});
const getUserBookings = () => __awaiter(void 0, void 0, void 0, function* () {
    return {};
});
const getBookingById = () => __awaiter(void 0, void 0, void 0, function* () {
    return {};
});
const updateBookingStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    return {};
});
const getAllBookings = () => __awaiter(void 0, void 0, void 0, function* () {
    return {};
});
exports.BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    getAllBookings,
};
