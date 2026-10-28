"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  UsersRound,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { cancelBooking } from "@/services/booking/cancelBooking";
import type { IBooking } from "@/types";

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

const getStatusStyle = (status: IBooking["status"]) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "PENDING":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "COMPLETED":
      return "bg-sky-50 text-sky-700 ring-sky-200";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    case "EXPIRED":
    case "FAILED":
      return "bg-slate-100 text-slate-600 ring-slate-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
};

const MyBookingsList = ({ bookings }: { bookings: IBooking[] }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = (booking: IBooking) => {
    const confirmed = window.confirm(
      `Cancel booking #${booking.bookingNumber}? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setCancellingId(booking._id);

    startTransition(async () => {
      const result = await cancelBooking(booking._id);

      if (result.success) {
        toast.success("Booking cancelled successfully");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to cancel booking");
      }

      setCancellingId(null);
    });
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const tour =
          typeof booking.tour === "object" && booking.tour !== null
            ? booking.tour
            : null;
        const departure =
          typeof booking.tourDeparture === "object" &&
          booking.tourDeparture !== null
            ? booking.tourDeparture
            : null;

        const canCancel =
          booking.status === "PENDING" || booking.status === "CONFIRMED";
        const isCancelling = cancellingId === booking._id && isPending;

        return (
          <article
            key={booking._id}
            className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-sky-200 hover:shadow-md"
          >
            <div className="flex flex-col gap-4 p-5 sm:flex-row">
              {/* Image */}
              <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-40">
                {tour?.coverImage ? (
                  <Image
                    src={tour.coverImage}
                    alt={tour.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 160px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <MapPin className="h-8 w-8" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] font-bold text-sky-700">
                      #{booking.bookingNumber}
                    </p>
                    <h3 className="mt-1 truncate text-base font-bold text-slate-900">
                      {tour?.title ?? "Tour"}
                    </h3>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ring-1 ring-inset ${getStatusStyle(
                      booking.status,
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                  {departure && (
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(departure.startDate)} —{" "}
                      {formatDate(departure.endDate)}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <UsersRound className="h-3.5 w-3.5" />
                    {booking.guestCount} traveler
                    {booking.guestCount !== 1 ? "s" : ""}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    Booked {formatDate(booking.createdAt)}
                  </span>
                </div>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Total Amount
                    </p>
                    <p className="text-lg font-extrabold text-slate-950">
                      {formatPrice(booking.priceBreakdown.total)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/my-bookings/${booking._id}`}
                      className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
                    >
                      View details
                    </Link>
                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => handleCancel(booking)}
                        disabled={isCancelling}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isCancelling ? (
                          "Cancelling..."
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5" />
                            Cancel
                          </>
                        )}
                      </button>
                    )}
                    {booking.status === "CONFIRMED" && (
                      <span className="inline-flex h-9 items-center gap-1 rounded-lg bg-emerald-50 px-3 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Confirmed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default MyBookingsList;
