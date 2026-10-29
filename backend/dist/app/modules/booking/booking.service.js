"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const getTransactionId_1 = require("../../utils/getTransactionId");
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const tour_departure_interface_1 = require("../tour-departure/tour-departure.interface");
const tour_departure_model_1 = require("../tour-departure/tour-departure.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const booking_constant_1 = require("./booking.constant");
const booking_interface_1 = require("./booking.interface");
const booking_model_1 = require("./booking.model");
const RESERVATION_DURATION_MS = 15 * 60 * 1000;
/* ============================================================
 *  STATUS TRANSITION RULES
 * ============================================================ */
const ALLOWED_TRANSITIONS = {
    [booking_interface_1.BOOKING_STATUS.PENDING]: [
        booking_interface_1.BOOKING_STATUS.CONFIRMED,
        booking_interface_1.BOOKING_STATUS.CANCELLED,
        booking_interface_1.BOOKING_STATUS.EXPIRED,
        booking_interface_1.BOOKING_STATUS.FAILED,
    ],
    [booking_interface_1.BOOKING_STATUS.CONFIRMED]: [
        booking_interface_1.BOOKING_STATUS.COMPLETED,
        booking_interface_1.BOOKING_STATUS.CANCELLED,
    ],
    [booking_interface_1.BOOKING_STATUS.CANCELLED]: [],
    [booking_interface_1.BOOKING_STATUS.COMPLETED]: [],
    [booking_interface_1.BOOKING_STATUS.FAILED]: [booking_interface_1.BOOKING_STATUS.PENDING], // retry
    [booking_interface_1.BOOKING_STATUS.EXPIRED]: [],
};
/* ============================================================
 *  HELPERS
 * ============================================================ */
// Daily sequence-ভিত্তিক atomic booking number
const generateBookingNumber = (session) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    const dateKey = `${y}${m}${d}`;
    const counterCollection = mongoose_1.default.connection.collection("counters");
    const result = yield counterCollection.findOneAndUpdate({ _id: `booking-${dateKey}` }, { $inc: { seq: 1 } }, { upsert: true, returnDocument: "after", session });
    const seq = (_a = result === null || result === void 0 ? void 0 : result.seq) !== null && _a !== void 0 ? _a : 1;
    return `TH-${dateKey}-${String(seq).padStart(4, "0")}`;
});
// travelers থেকে count derive করো — single source of truth
const deriveCounts = (travelers) => {
    const adultCount = travelers.filter((t) => t.type === "adult").length;
    const childCount = travelers.filter((t) => t.type === "child").length;
    return { adultCount, childCount, guestCount: travelers.length };
};
/**
 * Seat reserve (atomic, with session support)
 * ✅ availableSeats কমে, bookedSeats বাড়ে — model hook-এর সাথে consistent
 */
const reserveSeatsInSession = (departureId, guestCount, session) => __awaiter(void 0, void 0, void 0, function* () {
    const departure = yield tour_departure_model_1.TourDeparture.findOneAndUpdate({
        _id: departureId,
        status: {
            $in: [tour_departure_interface_1.TOUR_DEPARTURE_STATUS.OPEN, tour_departure_interface_1.TOUR_DEPARTURE_STATUS.SCHEDULED],
        },
        availableSeats: { $gte: guestCount },
    }, {
        $inc: { availableSeats: -guestCount, bookedSeats: guestCount },
    }, { new: true, session });
    if (!departure) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "Departure is unavailable or there are not enough seats.");
    }
    if (departure.availableSeats === 0) {
        departure.status = tour_departure_interface_1.TOUR_DEPARTURE_STATUS.FULL;
        yield departure.save({ session });
    }
    return departure;
});
/**
 * Seat release (atomic, with session support)
 * ✅ availableSeats বাড়ে, bookedSeats কমে — FULL হলে OPEN-এ ফেরত
 */
const releaseSeatsInSession = (departureId, guestCount, session) => __awaiter(void 0, void 0, void 0, function* () {
    const departure = yield tour_departure_model_1.TourDeparture.findByIdAndUpdate(departureId, {
        $inc: { availableSeats: guestCount, bookedSeats: -guestCount },
    }, { new: true, session });
    if (departure &&
        departure.availableSeats > 0 &&
        departure.status === tour_departure_interface_1.TOUR_DEPARTURE_STATUS.FULL) {
        departure.status = tour_departure_interface_1.TOUR_DEPARTURE_STATUS.OPEN;
        yield departure.save({ session });
    }
});
/* ============================================================
 *  CREATE BOOKING
 * ============================================================ */
const createBooking = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const departureId = payload.tourDeparture;
    const travelers = (_a = payload.travelers) !== null && _a !== void 0 ? _a : [];
    // ---------- Input validation ----------
    if (!departureId || !mongoose_1.default.isValidObjectId(departureId)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "A valid tour departure is required.");
    }
    if (!Array.isArray(travelers) || travelers.length < 1) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "At least one traveler is required.");
    }
    if (!((_b = payload.contactInfo) === null || _b === void 0 ? void 0 : _b.name) ||
        !((_c = payload.contactInfo) === null || _c === void 0 ? void 0 : _c.phone) ||
        !((_d = payload.contactInfo) === null || _d === void 0 ? void 0 : _d.email)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Contact name, phone, and email are required.");
    }
    const { adultCount, childCount, guestCount } = deriveCounts(travelers);
    if (adultCount < 1) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "At least one adult traveler is required.");
    }
    // ---------- User check ----------
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found.");
    }
    if (!user.phone || !user.address) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please update your profile before booking a tour.");
    }
    // ---------- Transaction ----------
    const session = yield mongoose_1.default.startSession();
    let bookingId;
    let transactionId;
    let amount = 0;
    let reservedGuestCount = 0;
    try {
        session.startTransaction();
        // 1) Atomically reserve seats (available--, booked++)
        const departure = yield reserveSeatsInSession(departureId, guestCount, session);
        reservedGuestCount = guestCount;
        // 2) Price snapshot
        const adultPrice = departure.pricePerPerson;
        const childPrice = (_e = payload.priceBreakdown) === null || _e === void 0 ? void 0 : _e.childPrice;
        const subtotal = adultPrice * adultCount + (childPrice !== null && childPrice !== void 0 ? childPrice : 0) * childCount;
        const discountAmount = (_g = (_f = payload.priceBreakdown) === null || _f === void 0 ? void 0 : _f.discountAmount) !== null && _g !== void 0 ? _g : 0;
        amount = subtotal - discountAmount;
        if (!Number.isFinite(amount) || amount <= 0) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid booking amount.");
        }
        // 3) Booking number
        const bookingNumber = yield generateBookingNumber(session);
        // 4) Create Booking
        const [booking] = yield booking_model_1.Booking.create([
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
                status: booking_interface_1.BOOKING_STATUS.PENDING,
                reservationExpiresAt: new Date(Date.now() + RESERVATION_DURATION_MS),
            },
        ], { session });
        // 5) Create payment
        transactionId = (0, getTransactionId_1.getTransactionId)();
        const [payment] = yield payment_model_1.Payment.create([
            {
                booking: booking._id,
                user: user._id,
                gateway: payment_interface_1.PAYMENT_GATEWAY.SSLCOMMERZ,
                transactionId,
                amount,
                currency: "BDT",
                status: payment_interface_1.PAYMENT_STATUS.PENDING,
            },
        ], { session });
        // 6) Link payment back to booking
        booking.payment = payment._id;
        yield booking.save({ session });
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
    // ---------- External gateway (after DB commit) ----------
    const sslPayload = {
        address: user.address,
        email: user.email,
        phoneNumber: user.phone,
        name: user.name,
        amount,
        transactionId: transactionId,
    };
    let paymentUrl;
    try {
        const sslPayment = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
        paymentUrl = sslPayment.GatewayPageURL;
    }
    catch (err) {
        // ✅ Gateway fail → payment FAILED, booking FAILED, seats ফেরত
        yield payment_model_1.Payment.findOneAndUpdate({ transactionId }, { status: payment_interface_1.PAYMENT_STATUS.FAILED });
        const failSession = yield mongoose_1.default.startSession();
        try {
            failSession.startTransaction();
            const failedBooking = yield booking_model_1.Booking.findByIdAndUpdate(bookingId, { status: booking_interface_1.BOOKING_STATUS.FAILED }, { new: true, session: failSession });
            if (failedBooking && reservedGuestCount > 0) {
                yield releaseSeatsInSession(failedBooking.tourDeparture, reservedGuestCount, failSession);
            }
            yield failSession.commitTransaction();
        }
        catch (releaseErr) {
            if (failSession.inTransaction())
                yield failSession.abortTransaction();
            // release fail হলেও original error-ই throw করি
        }
        finally {
            yield failSession.endSession();
        }
        throw new AppError_1.default(http_status_codes_1.default.BAD_GATEWAY, "Payment gateway initialization failed. Please try again.");
    }
    const booking = yield booking_model_1.Booking.findById(bookingId)
        .populate("user", "name email phone address")
        .populate({
        path: "tourDeparture",
        populate: { path: "tour", select: "title slug" },
    })
        .populate("payment");
    return { paymentUrl, booking };
});
/* ============================================================
 *  GET USER BOOKINGS
 * ============================================================ */
const getUserBookings = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = { user: new mongoose_1.default.Types.ObjectId(userId) };
    const qb = new QueryBuilder_1.QueryBuilder(booking_model_1.Booking.find(filter), query);
    const docsQuery = qb
        .search(booking_constant_1.bookingSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
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
});
/* ============================================================
 *  GET SINGLE BOOKING (ownership checked)
 * ============================================================ */
const getBookingById = (bookingId, requester) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.isValidObjectId(bookingId)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid booking id.");
    }
    const booking = yield booking_model_1.Booking.findById(bookingId)
        .populate("user", "name email phone address")
        .populate({
        path: "tourDeparture",
        populate: { path: "tour", select: "title slug coverImage" },
    })
        .populate("payment");
    if (!booking) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Booking not found.");
    }
    const isOwner = booking.user._id.toString() === requester.userId;
    const isAdmin = requester.role === user_interface_1.Role.ADMIN || requester.role === user_interface_1.Role.SUPER_ADMIN;
    if (!isOwner && !isAdmin) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not allowed to view this booking.");
    }
    return booking;
});
/* ============================================================
 *  UPDATE BOOKING STATUS
 * ============================================================ */
const updateBookingStatus = (bookingId, newStatus, requester, cancellationReason) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!mongoose_1.default.isValidObjectId(bookingId)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid booking id.");
    }
    const session = yield mongoose_1.default.startSession();
    let updated;
    try {
        session.startTransaction();
        const booking = yield booking_model_1.Booking.findById(bookingId).session(session);
        if (!booking) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Booking not found.");
        }
        const isOwner = booking.user.toString() === requester.userId;
        const isAdmin = requester.role === user_interface_1.Role.ADMIN || requester.role === user_interface_1.Role.SUPER_ADMIN;
        // Permission rules
        if (!isAdmin) {
            if (!isOwner) {
                throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Access denied.");
            }
            if (newStatus !== booking_interface_1.BOOKING_STATUS.CANCELLED) {
                throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You can only cancel your own booking.");
            }
        }
        // Transition validation
        const allowed = (_a = ALLOWED_TRANSITIONS[booking.status]) !== null && _a !== void 0 ? _a : [];
        if (!allowed.includes(newStatus)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Cannot change status from ${booking.status} to ${newStatus}.`);
        }
        const wasActive = booking.status === booking_interface_1.BOOKING_STATUS.PENDING ||
            booking.status === booking_interface_1.BOOKING_STATUS.CONFIRMED;
        const wasFailed = booking.status === booking_interface_1.BOOKING_STATUS.FAILED;
        // Cancel/Expire/Fail → seats ফেরত
        if (wasActive &&
            (newStatus === booking_interface_1.BOOKING_STATUS.CANCELLED ||
                newStatus === booking_interface_1.BOOKING_STATUS.EXPIRED ||
                newStatus === booking_interface_1.BOOKING_STATUS.FAILED)) {
            yield releaseSeatsInSession(booking.tourDeparture, booking.guestCount, session);
        }
        // FAILED → PENDING (retry) → seats আবার reserve
        if (wasFailed && newStatus === booking_interface_1.BOOKING_STATUS.PENDING) {
            yield reserveSeatsInSession(booking.tourDeparture, booking.guestCount, session);
        }
        booking.status = newStatus;
        if (newStatus === booking_interface_1.BOOKING_STATUS.CANCELLED && cancellationReason) {
            booking.cancellationReason = cancellationReason;
        }
        yield booking.save({ session });
        updated = booking;
        yield session.commitTransaction();
    }
    catch (err) {
        if (session.inTransaction())
            yield session.abortTransaction();
        throw err;
    }
    finally {
        yield session.endSession();
    }
    return updated;
});
/* ============================================================
 *  GET ALL BOOKINGS (admin)
 * ============================================================ */
const getAllBookings = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const qb = new QueryBuilder_1.QueryBuilder(booking_model_1.Booking.find(), query);
    const docsQuery = qb
        .search(booking_constant_1.bookingSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        docsQuery
            .build()
            .populate("user", "name email phone")
            .populate("tour", "title slug")
            .populate({ path: "tourDeparture", select: "startDate endDate" })
            .populate("payment", "status amount transactionId"),
        qb.getMeta(),
    ]);
    return { data, meta };
});
/* ============================================================
 *  EXPIRE STALE RESERVATIONS (cron-friendly)
 * ============================================================ */
const expireStaleReservations = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const staleBookings = yield booking_model_1.Booking.find({
        status: booking_interface_1.BOOKING_STATUS.PENDING,
        reservationExpiresAt: { $lte: now },
    }).select("_id");
    const results = yield Promise.allSettled(staleBookings.map((b) => updateBookingStatus(b._id.toString(), booking_interface_1.BOOKING_STATUS.EXPIRED, {
        userId: "system",
        role: user_interface_1.Role.SUPER_ADMIN,
    })));
    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    return { processed: staleBookings.length, succeeded };
});
exports.BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    getAllBookings,
    expireStaleReservations,
};
