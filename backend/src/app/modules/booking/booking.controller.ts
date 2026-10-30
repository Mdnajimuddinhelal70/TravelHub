import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BOOKING_STATUS } from "./booking.interface";
import { BookingService } from "./booking.service";

/* ============================================================
 *  CREATE
 * ============================================================ */
const createBooking = catchAsync(async (req: Request, res: Response) => {
  const decodeToken = req.user as JwtPayload;

  const booking = await BookingService.createBooking(
    req.body,
    decodeToken.userId,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});

/* ============================================================
 *  GET MY BOOKINGS
 * ============================================================ */
const getUserBookings = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const result = await BookingService.getUserBookings(
    userId,
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Bookings retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

/* ============================================================
 *  GET SINGLE
 * ============================================================ */
const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const booking = await BookingService.getBookingById(
    req.params.bookingId as string,
    { userId: user.userId, role: user.role },
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking retrieved successfully",
    data: booking,
  });
});

/* ============================================================
 *  GET ALL (admin)
 * ============================================================ */
const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.getAllBookings(
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Bookings retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

/* ============================================================
 *  UPDATE STATUS
 * ============================================================ */
const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const { status, cancellationReason } = req.body as {
    status: BOOKING_STATUS;
    cancellationReason?: string;
  };
  const updated = await BookingService.updateBookingStatus(
    req.params.bookingId as string,
    status,
    { userId: user.userId, role: user.role },
    cancellationReason,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking status updated successfully",
    data: updated,
  });
});

export const BookingController = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  getUserBookings,
  updateBookingStatus,
};
