"use strict";
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
exports.PaymentService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const cloudinary_config_1 = require("../../config/cloudinary.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const invoice_1 = require("../../utils/invoice");
const sendEmail_1 = require("../../utils/sendEmail");
const booking_interface_1 = require("../booking/booking.interface");
const booking_model_1 = require("../booking/booking.model");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const tour_departure_interface_1 = require("../tour-departure/tour-departure.interface");
const tour_departure_model_1 = require("../tour-departure/tour-departure.model");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
/* ============================================================
 *  INIT PAYMENT
 * ============================================================ */
const initPayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findOne({ booking: bookingId });
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment Not Found. You have not booked this tour");
    }
    // ✅ user populate করুন — নাহলে address/email/phone/name undefined হবে
    const booking = yield booking_model_1.Booking.findById(payment.booking).populate("user", "name email phone address");
    if (!booking) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Booking not found");
    }
    const user = booking.user;
    if (!(user === null || user === void 0 ? void 0 : user.address) || !(user === null || user === void 0 ? void 0 : user.phone)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please update your profile with address and phone before payment.");
    }
    const sslPayload = {
        address: user.address,
        email: user.email,
        phoneNumber: user.phone,
        name: user.name,
        amount: payment.amount,
        transactionId: payment.transactionId,
    };
    const sslPayment = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
    return {
        paymentUrl: sslPayment.GatewayPageURL,
    };
});
/* ============================================================
 *  HELPER — seats release
 * ============================================================ */
const releaseSeatsForBooking = (booking, session) => __awaiter(void 0, void 0, void 0, function* () {
    if (!booking || booking.guestCount <= 0)
        return;
    const dep = yield tour_departure_model_1.TourDeparture.findByIdAndUpdate(booking.tourDeparture, {
        $inc: {
            availableSeats: booking.guestCount,
            bookedSeats: -booking.guestCount,
        },
    }, { new: true, session });
    if (dep &&
        dep.availableSeats > 0 &&
        dep.status === tour_departure_interface_1.TOUR_DEPARTURE_STATUS.FULL) {
        dep.status = tour_departure_interface_1.TOUR_DEPARTURE_STATUS.OPEN;
        yield dep.save({ session });
    }
});
/* ============================================================
 *  SUCCESS PAYMENT
 * ============================================================ */
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.PAID,
            verifiedAt: new Date(),
        }, { new: true, runValidators: true, session });
        if (!updatedPayment) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment not found");
        }
        // ✅ Booking CONFIRMED (COMPLETED না), reservationExpiresAt clear
        const updatedBooking = yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment.booking, {
            status: booking_interface_1.BOOKING_STATUS.CONFIRMED,
            confirmedAt: new Date(),
            $unset: { reservationExpiresAt: 1 },
        }, { new: true, runValidators: true, session })
            .populate({
            path: "tourDeparture",
            populate: {
                path: "tour",
                select: "title slug",
            },
        })
            .populate("user", "name email");
        if (!updatedBooking) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Booking not found");
        }
        const invoiceData = {
            bookingDate: updatedBooking.createdAt,
            guestCount: updatedBooking.guestCount,
            totalAmount: updatedPayment.amount,
            tourTitle: (_c = (_b = (_a = updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.tourDeparture) === null || _a === void 0 ? void 0 : _a.tour) === null || _b === void 0 ? void 0 : _b.title) !== null && _c !== void 0 ? _c : "Tour",
            transactionId: updatedPayment.transactionId,
            userName: updatedBooking.user.name,
        };
        const pdfBuffer = yield (0, invoice_1.generatePdf)(invoiceData);
        const cloudinaryResult = yield (0, cloudinary_config_1.uploadBufferToCloudinary)(pdfBuffer, "invoice");
        if (!cloudinaryResult) {
            throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Error uploading pdf");
        }
        yield payment_model_1.Payment.findByIdAndUpdate(updatedPayment._id, { invoiceUrl: cloudinaryResult.secure_url }, { runValidators: true, session });
        yield session.commitTransaction();
        session.endSession();
        // Email transaction-এর বাইরে (fail হলেও booking/payment ঠিক থাকবে)
        try {
            yield (0, sendEmail_1.sendEmail)({
                to: updatedBooking.user.email,
                subject: "Your Booking Invoice",
                templateName: "invoice",
                templateData: invoiceData,
                attachments: [
                    {
                        filename: "invoice.pdf",
                        content: pdfBuffer,
                        contentType: "application/pdf",
                    },
                ],
            });
        }
        catch (emailErr) {
            console.error("Invoice email failed:", emailErr);
        }
        return { success: true, message: "Payment Completed Successfully" };
    }
    catch (error) {
        if (session.inTransaction())
            yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
/* ============================================================
 *  FAIL PAYMENT
 * ============================================================ */
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.FAILED,
            failureReason: (query === null || query === void 0 ? void 0 : query.failedreason) || "Payment failed",
        }, { new: true, runValidators: true, session });
        if (!updatedPayment) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment not found");
        }
        const booking = yield booking_model_1.Booking.findById(updatedPayment.booking).session(session);
        if (booking) {
            // ✅ seats ফেরত (PENDING/CONFIRMED থেকে fail হলে)
            if (booking.status === booking_interface_1.BOOKING_STATUS.PENDING ||
                booking.status === booking_interface_1.BOOKING_STATUS.CONFIRMED) {
                yield releaseSeatsForBooking(booking, session);
            }
            booking.status = booking_interface_1.BOOKING_STATUS.FAILED;
            yield booking.save({ session });
        }
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment Failed" };
    }
    catch (error) {
        if (session.inTransaction())
            yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
/* ============================================================
 *  CANCEL PAYMENT
 * ============================================================ */
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.CANCELLED }, { new: true, runValidators: true, session });
        if (!updatedPayment) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment not found");
        }
        const booking = yield booking_model_1.Booking.findById(updatedPayment.booking).session(session);
        if (booking) {
            // ✅ seats ফেরত
            if (booking.status === booking_interface_1.BOOKING_STATUS.PENDING ||
                booking.status === booking_interface_1.BOOKING_STATUS.CONFIRMED) {
                yield releaseSeatsForBooking(booking, session);
            }
            // ✅ CANCELLED (COMPLETED না!)
            booking.status = booking_interface_1.BOOKING_STATUS.CANCELLED;
            booking.cancelledAt = new Date();
            yield booking.save({ session });
        }
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment Cancelled" };
    }
    catch (error) {
        if (session.inTransaction())
            yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
/* ============================================================
 *  GET INVOICE
 * ============================================================ */
const getInvoiceDownloadUrl = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findById(paymentId).select("invoiceUrl");
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment not found");
    }
    if (!payment.invoiceUrl) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "No invoice found");
    }
    return payment.invoiceUrl;
});
const getPaymentByTransactionId = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findOne({ transactionId }).populate({
        path: "booking",
        populate: [
            { path: "tour", select: "title slug coverImage duration price" },
            { path: "tourDeparture", select: "startDate endDate pricePerPerson" },
            { path: "user", select: "name email phone" },
        ],
    });
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment not found");
    }
    return payment;
});
exports.PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
    getInvoiceDownloadUrl,
    getPaymentByTransactionId,
};
