import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  User,
  UsersRound,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import BookingDetailActions from "@/components/modules/Booking/BookingDetailActions";
import { getSingleBooking } from "@/services/booking/getSingleBooking";

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

const formatDateTime = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

const getStatusStyle = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "PENDING":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "COMPLETED":
      return "bg-sky-50 text-sky-700 ring-sky-200";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
};

const BookingDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const booking = await getSingleBooking(id);

  if (!booking) notFound();

  const tour =
    typeof booking.tour === "object" && booking.tour !== null
      ? booking.tour
      : null;
  const departure =
    typeof booking.tourDeparture === "object" && booking.tourDeparture !== null
      ? booking.tourDeparture
      : null;
  const payment =
    typeof booking.payment === "object" && booking.payment !== null
      ? booking.payment
      : null;

  const canCancel =
    booking.status === "PENDING" || booking.status === "CONFIRMED";

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div>
        <Link
          href="/dashboard/my-bookings"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 transition hover:text-sky-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to my bookings
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] font-bold text-sky-700">
              #{booking.bookingNumber}
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
              {tour?.title ?? "Tour Booking"}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Booked on {formatDateTime(booking.createdAt)}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider ring-1 ring-inset ${getStatusStyle(
              booking.status,
            )}`}
          >
            {booking.status}
          </span>
        </div>
      </div>

      {/* Tour card */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-5 sm:flex-row">
          <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-32 sm:w-48">
            {tour?.coverImage ? (
              <Image
                src={tour.coverImage}
                alt={tour.title}
                fill
                sizes="(max-width: 640px) 100vw, 192px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <MapPin className="h-8 w-8" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-slate-900">
              {tour?.title ?? "Tour"}
            </h2>
            {departure && (
              <div className="mt-2 space-y-1 text-xs text-slate-600">
                <p className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-sky-600" />
                  {formatDate(departure.startDate)} —{" "}
                  {formatDate(departure.endDate)}
                </p>
                {departure.meetingPoint && (
                  <p className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-sky-600" />
                    {departure.meetingPoint}
                  </p>
                )}
              </div>
            )}
            {tour?.slug && (
              <Link
                href={`/tours/${tour.slug}`}
                className="mt-3 inline-flex text-xs font-bold text-sky-700 hover:underline"
              >
                View tour page →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Grid: Travelers + Contact */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Travelers */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
            <UsersRound className="h-4 w-4 text-sky-600" />
            Travelers ({booking.guestCount})
          </h3>
          <ul className="mt-3 space-y-2">
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
        </section>

        {/* Contact */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
            <User className="h-4 w-4 text-sky-600" />
            Contact Information
          </h3>
          <div className="mt-3 space-y-2 text-sm">
            <p className="flex items-center gap-2 text-slate-700">
              <User className="h-3.5 w-3.5 text-slate-400" />
              {booking.contactInfo.name}
            </p>
            <p className="flex items-center gap-2 text-slate-700">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              {booking.contactInfo.phone}
            </p>
            <p className="flex items-center gap-2 text-slate-700">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              {booking.contactInfo.email}
            </p>
          </div>
          {booking.specialRequests && (
            <div className="mt-4 rounded-lg bg-amber-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Special Requests
              </p>
              <p className="mt-1 text-xs text-amber-900">
                {booking.specialRequests}
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Price breakdown + Payment */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Price */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
            <CreditCard className="h-4 w-4 text-sky-600" />
            Price Breakdown
          </h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between text-slate-700">
              <span>
                Adults × {booking.priceBreakdown.adultCount} @{" "}
                {formatPrice(booking.priceBreakdown.adultPrice)}
              </span>
              <span>
                {formatPrice(
                  booking.priceBreakdown.adultPrice *
                    booking.priceBreakdown.adultCount,
                )}
              </span>
            </div>
            {booking.priceBreakdown.childCount > 0 && (
              <div className="flex justify-between text-slate-700">
                <span>
                  Children × {booking.priceBreakdown.childCount} @{" "}
                  {formatPrice(booking.priceBreakdown.childPrice ?? 0)}
                </span>
                <span>
                  {formatPrice(
                    (booking.priceBreakdown.childPrice ?? 0) *
                      booking.priceBreakdown.childCount,
                  )}
                </span>
              </div>
            )}
            <div className="flex justify-between text-slate-700">
              <span>Subtotal</span>
              <span>{formatPrice(booking.priceBreakdown.subtotal)}</span>
            </div>
            {booking.priceBreakdown.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount</span>
                <span>
                  -{formatPrice(booking.priceBreakdown.discountAmount)}
                </span>
              </div>
            )}
            <hr className="border-slate-200" />
            <div className="flex justify-between text-base font-extrabold text-slate-950">
              <span>Total</span>
              <span>{formatPrice(booking.priceBreakdown.total)}</span>
            </div>
          </div>
        </section>

        {/* Payment */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
            <CreditCard className="h-4 w-4 text-sky-600" />
            Payment
          </h3>
          {payment ? (
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between text-slate-700">
                <span>Status</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ring-1 ring-inset ${getStatusStyle(
                    payment.status,
                  )}`}
                >
                  {payment.status}
                </span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Transaction ID</span>
                <span className="font-mono text-xs">
                  {payment.transactionId}
                </span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Amount</span>
                <span>{formatPrice(payment.amount)}</span>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              No payment information available.
            </p>
          )}

          <BookingDetailActions
            bookingId={booking._id}
            paymentId={payment?._id}
            invoiceUrl={payment?.invoiceUrl}
            canCancel={canCancel}
          />
        </section>
      </div>

      {/* Timeline */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h3 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
          <Clock3 className="h-4 w-4 text-sky-600" />
          Booking Timeline
        </h3>
        <ol className="mt-3 space-y-3">
          <TimelineItem
            label="Booking created"
            date={booking.createdAt}
            icon={<Clock3 className="h-3.5 w-3.5" />}
          />
          {booking.confirmedAt && (
            <TimelineItem
              label="Booking confirmed"
              date={booking.confirmedAt}
              icon={<CheckCircle2 className="h-3.5 w-3.5" />}
            />
          )}
          {booking.cancelledAt && (
            <TimelineItem
              label={`Cancelled${
                booking.cancellationReason
                  ? ` — ${booking.cancellationReason}`
                  : ""
              }`}
              date={booking.cancelledAt}
              icon={<XCircle className="h-3.5 w-3.5" />}
            />
          )}
        </ol>
      </section>
    </div>
  );
};

const TimelineItem = ({
  label,
  date,
  icon,
}: {
  label: string;
  date: string;
  icon: React.ReactNode;
}) => (
  <li className="flex items-start gap-3">
    <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-sky-50 text-sky-700">
      {icon}
    </span>
    <div>
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      <p className="text-xs text-slate-500">{formatDateTime(date)}</p>
    </div>
  </li>
);

export default BookingDetailPage;
