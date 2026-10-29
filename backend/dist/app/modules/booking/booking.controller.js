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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const booking_service_1 = require("./booking.service");
/* ============================================================
 *  CREATE
 * ============================================================ */
const createBooking = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodeToken = req.user;
    const booking = yield booking_service_1.BookingService.createBooking(req.body, decodeToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Booking created successfully",
        data: booking,
    });
}));
/* ============================================================
 *  GET MY BOOKINGS
 * ============================================================ */
const getUserBookings = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield booking_service_1.BookingService.getUserBookings(userId, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Bookings retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
/* ============================================================
 *  GET SINGLE
 * ============================================================ */
const getSingleBooking = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const booking = yield booking_service_1.BookingService.getBookingById(req.params.bookingId, { userId: user.userId, role: user.role });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Booking retrieved successfully",
        data: booking,
    });
}));
/* ============================================================
 *  GET ALL (admin)
 * ============================================================ */
const getAllBookings = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.BookingService.getAllBookings(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Bookings retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
/* ============================================================
 *  UPDATE STATUS
 * ============================================================ */
const updateBookingStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { status, cancellationReason } = req.body;
    const updated = yield booking_service_1.BookingService.updateBookingStatus(req.params.bookingId, status, { userId: user.userId, role: user.role }, cancellationReason);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Booking status updated successfully",
        data: updated,
    });
}));
exports.BookingController = {
    createBooking,
    getAllBookings,
    getSingleBooking,
    getUserBookings,
    updateBookingStatus,
};
