import { CheckCircle2, Download, MapPin, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPaymentByTransactionId } from "@/services/payment/getPaymentByTransactionId";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(price);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const PaymentSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ transactionId?: string }>;
}) => {
  const { transactionId } = await searchParams;

  if (!transactionId) notFound();

  const payment = await getPaymentByTransactionId(transactionId);

  if (!payment) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <h1 className="text-xl font-bold text-slate-900">Payment not found</h1>
        <p className="mt-2 text-sm text-slate-600">
          We couldn&apos;t find this payment. Please check your bookings.
        </p>
        <Link
          href="/my-bookings"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 text-sm font-bold text-white shadow-md"
        >
          View my bookings
        </Link>
      </div>
    );
  }

  const booking = payment.booking;
  const tour =
    typeof booking.tour === "object" && booking.tour !== null
      ? booking.tour
      : null;
  const departure =
    typeof booking.tourDeparture === "object" && booking.tourDeparture !== null
      ? booking.tourDeparture
      : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Success header */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-slate-950">
          Payment Successful!
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Your booking has been confirmed. A confirmation email with your
          invoice has been sent.
        </p>
        <p className="mt-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
          Booking #{booking.bookingNumber}
        </p>
      </div>

      {/* Tour summary */}
      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {tour?.coverImage && (
            <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-32">
              <Image
                src={tour.coverImage}
                alt={tour.title}
                fill
                sizes="(max-width: 640px) 100vw, 128px"
                className="object-cover"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-slate-900">
              {tour?.title ?? "Tour"}
            </h2>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
              {departure && (
                <>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {formatDate(departure.startDate)} —{" "}
                    {formatDate(departure.endDate)}
                  </span>
                </>
              )}
              <span className="inline-flex items-center gap-1">
                <UsersRound className="h-3.5 w-3.5" />
                {booking.guestCount} traveler
                {booking.guestCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Travelers */}
      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-slate-900">Travelers</h2>
        <ul className="space-y-2">
          {booking.travelers.map((t, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 text-sm"
            >
              <span className="font-semibold text-slate-800">{t.name}</span>
              <span className="text-xs capitalize text-slate-500">
                {t.type} · {t.age} yrs · {t.gender}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment summary */}
      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-sky-50/70 p-5 shadow-sm">
        <h2 className="mb-3 text-base font-bold text-slate-900">
          Payment Summary
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-700">
            <span>Transaction ID</span>
            <span className="font-mono text-xs">{payment.transactionId}</span>
          </div>
          <div className="flex justify-between text-slate-700">
            <span>Status</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
              {payment.status}
            </span>
          </div>
          <hr className="border-slate-200" />
          <div className="flex justify-between text-base font-bold text-slate-950">
            <span>Total Paid</span>
            <span>{formatPrice(payment.amount)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {payment.invoiceUrl && (
          <a
            href={payment.invoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-700 hover:shadow-md"
          >
            <Download className="h-4 w-4" />
            Download Invoice
          </a>
        )}
        <Link
          href="/my-bookings"
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          View my bookings
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
