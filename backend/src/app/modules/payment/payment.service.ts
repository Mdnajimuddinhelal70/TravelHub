/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";

import { generatePdf, IInvoiceData } from "../../utils/invoice";
import { sendEmail } from "../../utils/sendEmail";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { TOUR_DEPARTURE_STATUS } from "../tour-departure/tour-departure.interface";
import { TourDeparture } from "../tour-departure/tour-departure.model";
import { IUser } from "../user/user.interface";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

/* ============================================================
 *  INIT PAYMENT
 * ============================================================ */
const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });

  if (!payment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Payment Not Found. You have not booked this tour",
    );
  }

  // ✅ user populate করুন — নাহলে address/email/phone/name undefined হবে
  const booking = await Booking.findById(payment.booking).populate(
    "user",
    "name email phone address",
  );

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  const user = booking.user as unknown as IUser;

  if (!user?.address || !user?.phone) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please update your profile with address and phone before payment.",
    );
  }

  const sslPayload: ISSLCommerz = {
    address: user.address,
    email: user.email,
    phoneNumber: user.phone,
    name: user.name,
    amount: payment.amount,
    transactionId: payment.transactionId!,
  };

  const sslPayment = await SSLService.sslPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};

/* ============================================================
 *  HELPER — seats release
 * ============================================================ */
const releaseSeatsForBooking = async (booking: any, session: any) => {
  if (!booking || booking.guestCount <= 0) return;

  const dep = await TourDeparture.findByIdAndUpdate(
    booking.tourDeparture,
    {
      $inc: {
        availableSeats: booking.guestCount,
        bookedSeats: -booking.guestCount,
      },
    },
    { new: true, session },
  );

  if (
    dep &&
    dep.availableSeats > 0 &&
    dep.status === TOUR_DEPARTURE_STATUS.FULL
  ) {
    dep.status = TOUR_DEPARTURE_STATUS.OPEN;
    await dep.save({ session });
  }
};

/* ============================================================
 *  SUCCESS PAYMENT
 * ============================================================ */
const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.PAID,
        verifiedAt: new Date(),
      },
      { new: true, runValidators: true, session },
    );

    if (!updatedPayment) {
      throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
    }

    // ✅ Booking CONFIRMED (COMPLETED না), reservationExpiresAt clear
    const updatedBooking = await Booking.findByIdAndUpdate(
      updatedPayment.booking,
      {
        status: BOOKING_STATUS.CONFIRMED,
        confirmedAt: new Date(),
        $unset: { reservationExpiresAt: 1 },
      },
      { new: true, runValidators: true, session },
    )
      .populate({
        path: "tourDeparture",
        populate: {
          path: "tour",
          select: "title slug",
        },
      })
      .populate("user", "name email");

    if (!updatedBooking) {
      throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
    }

    const invoiceData: IInvoiceData = {
      bookingDate: updatedBooking.createdAt as Date,
      guestCount: updatedBooking.guestCount,
      totalAmount: updatedPayment.amount,
      tourTitle: (updatedBooking?.tourDeparture as any)?.tour?.title ?? "Tour",
      transactionId: updatedPayment.transactionId!,
      userName: (updatedBooking.user as unknown as IUser).name,
    };

    const pdfBuffer = await generatePdf(invoiceData);

    const cloudinaryResult = await uploadBufferToCloudinary(
      pdfBuffer,
      "invoice",
    );

    if (!cloudinaryResult) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Error uploading pdf",
      );
    }

    await Payment.findByIdAndUpdate(
      updatedPayment._id,
      { invoiceUrl: cloudinaryResult.secure_url },
      { runValidators: true, session },
    );

    await session.commitTransaction();
    session.endSession();

    // Email transaction-এর বাইরে (fail হলেও booking/payment ঠিক থাকবে)
    try {
      await sendEmail({
        to: (updatedBooking.user as unknown as IUser).email,
        subject: "Your Booking Invoice",
        templateName: "invoice",
        templateData: invoiceData as unknown as Record<string, unknown>,
        attachments: [
          {
            filename: "invoice.pdf",
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });
    } catch (emailErr) {
      console.error("Invoice email failed:", emailErr);
    }

    return { success: true, message: "Payment Completed Successfully" };
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

/* ============================================================
 *  FAIL PAYMENT
 * ============================================================ */
const failPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.FAILED,
        failureReason: query?.failedreason || "Payment failed",
      },
      { new: true, runValidators: true, session },
    );

    if (!updatedPayment) {
      throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
    }

    const booking = await Booking.findById(updatedPayment.booking).session(
      session,
    );

    if (booking) {
      // ✅ seats ফেরত (PENDING/CONFIRMED থেকে fail হলে)
      if (
        booking.status === BOOKING_STATUS.PENDING ||
        booking.status === BOOKING_STATUS.CONFIRMED
      ) {
        await releaseSeatsForBooking(booking, session);
      }

      booking.status = BOOKING_STATUS.FAILED;
      await booking.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment Failed" };
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

/* ============================================================
 *  CANCEL PAYMENT
 * ============================================================ */
const cancelPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.CANCELLED },
      { new: true, runValidators: true, session },
    );

    if (!updatedPayment) {
      throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
    }

    const booking = await Booking.findById(updatedPayment.booking).session(
      session,
    );

    if (booking) {
      // ✅ seats ফেরত
      if (
        booking.status === BOOKING_STATUS.PENDING ||
        booking.status === BOOKING_STATUS.CONFIRMED
      ) {
        await releaseSeatsForBooking(booking, session);
      }

      // ✅ CANCELLED (COMPLETED না!)
      booking.status = BOOKING_STATUS.CANCELLED;
      booking.cancelledAt = new Date();
      await booking.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment Cancelled" };
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

/* ============================================================
 *  GET INVOICE
 * ============================================================ */
const getInvoiceDownloadUrl = async (paymentId: string) => {
  const payment = await Payment.findById(paymentId).select("invoiceUrl");

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  if (!payment.invoiceUrl) {
    throw new AppError(httpStatus.NOT_FOUND, "No invoice found");
  }

  return payment.invoiceUrl;
};

export const PaymentService = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
  getInvoiceDownloadUrl,
};
