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

import { getBookingByIdAdmin } from "@/services/booking/getBookingByIdAdmin";

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
    case "FAILED":
    case "EXPIRED":
      return "bg-slate-100 text-slate-600 ring-slate-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
};

const AdminBookingDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const booking = await getBookingByIdAdmin(id);

  if (!booking) notFound();

  const tour =
    typeof booking.tour === "object" && booking.tour !== null
      ? booking.tour
      : null;
  const departure =
    typeof booking.tourDeparture === "object" && booking.tourDeparture !== null
      ? booking.tourDeparture
      : null;
  const user =
    typeof booking.user === "object" && booking.user !== null
      ? booking.user
      : null;
  const payment =
    typeof booking.payment === "object" && booking.payment !== null
      ? booking.payment
      : null;

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div>
        <Link
          href="/admin/dashboard/booking-management"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 transition hover:text-sky-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to bookings
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] font-bold text-sky-700">
              #{booking.bookingNumber}
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
              {tour?.title ?? "Booking"}
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Tour Info */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
            <MapPin className="h-4 w-4 text-sky-600" />
            Tour & Departure
          </h2>
          <div className="mt-4 flex items-start gap-4">
            {tour?.coverImage && (
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src={tour.coverImage}
                  alt={tour.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1 space-y-2 text-sm">
              <p className="font-semibold text-slate-800">
                {tour?.title ?? "—"}
              </p>
              {departure && (
                <>
                  <p className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                    <CalendarDays className="h-3.5 w-3.5 text-sky-600" />
                    {formatDate(departure.startDate)} —{" "}
                    {formatDate(departure.endDate)}
                  </p>
                  {departure.meetingPoint && (
                    <p className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-sky-600" />
                      {departure.meetingPoint}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Customer Info */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
            <User className="h-4 w-4 text-sky-600" />
            Customer
          </h2>
          <div className="mt-3 space-y-2 text-sm">
            <p className="font-semibold text-slate-800">{user?.name ?? "—"}</p>
            {user?.email && (
              <p className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                {user.email}
              </p>
            )}
            {user?.phone && (
              <p className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                {user.phone}
              </p>
            )}
          </div>
        </section>

        {/* Travelers */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
            <UsersRound className="h-4 w-4 text-sky-600" />
            Travelers ({booking.guestCount})
          </h2>
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

        {/* Contact Information */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
            <User className="h-4 w-4 text-sky-600" />
            Contact Information
          </h2>
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
            <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
              <span className="font-bold">Special Requests: </span>
              {booking.specialRequests}
            </div>
          )}
        </section>

        {/* Price Breakdown */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
            <CreditCard className="h-4 w-4 text-sky-600" />
            Price Breakdown
          </h2>
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
            <hr className="border-slate-200" />
            <div className="flex justify-between text-base font-extrabold text-slate-950">
              <span>Total</span>
              <span>{formatPrice(booking.priceBreakdown.total)}</span>
            </div>
          </div>
        </section>

        {/* Payment Info */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
            <CreditCard className="h-4 w-4 text-sky-600" />
            Payment
          </h2>
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
                  {payment.transactionId ?? "—"}
                </span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Amount</span>
                <span>{formatPrice(payment.amount)}</span>
              </div>
              {payment.invoiceUrl && (
                <div className="mt-3 flex justify-end">
                  <a
                    href={payment.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
                  >
                    Download Invoice
                  </a>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              No payment information available.
            </p>
          )}
        </section>
      </div>

      {/* Timeline */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h2 className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
          <Clock3 className="h-4 w-4 text-sky-600" />
          Booking Timeline
        </h2>
        <ol className="mt-4 space-y-4">
          <TimelineItem
            label="Booking created"
            date={booking.createdAt}
            icon={<Clock3 className="h-3.5 w-3.5" />}
            color="bg-slate-100 text-slate-600"
          />
          {booking.confirmedAt && (
            <TimelineItem
              label="Booking confirmed"
              date={booking.confirmedAt}
              icon={<CheckCircle2 className="h-3.5 w-3.5" />}
              color="bg-emerald-50 text-emerald-600"
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
              color="bg-rose-50 text-rose-600"
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
  color,
}: {
  label: string;
  date: string;
  icon: React.ReactNode;
  color: string;
}) => (
  <li className="flex items-start gap-3">
    <span
      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${color}`}
    >
      {icon}
    </span>
    <div>
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      <p className="text-xs text-slate-500">{formatDateTime(date)}</p>
    </div>
  </li>
);

export default AdminBookingDetailPage;
