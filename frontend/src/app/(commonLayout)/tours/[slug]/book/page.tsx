import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import BookingForm from "@/components/modules/Booking/BookingForm";
import { getDeparturesByTour } from "@/services/tour-departure/getDeparturesByTour";
import { getTourBySlug } from "@/services/tour/getTourBySlug";

const BookingPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ departure?: string }>;
}) => {
  const { slug } = await params;
  const { departure: departureId } = await searchParams;

  if (!departureId) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="h-10 w-10 text-rose-500" />
        <h1 className="mt-4 text-xl font-bold text-slate-900">
          No departure selected
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Please select a departure date from the tour page before booking.
        </p>
        <Link
          href={`/tours/${slug}`}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 text-sm font-bold text-white shadow-md"
        >
          Back to tour
        </Link>
      </div>
    );
  }

  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  const departures = await getDeparturesByTour(tour._id, { limit: "100" });

  const departure = departures.find(
    (d) => String(d._id) === String(departureId),
  );

  if (!departure) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="h-10 w-10 text-rose-500" />
        <h1 className="mt-4 text-xl font-bold text-slate-900">
          Departure unavailable
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          This departure is no longer open or does not exist. Please pick
          another date.
        </p>
        <Link
          href={`/tours/${tour.slug}`}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 text-sm font-bold text-white shadow-md"
        >
          Choose another departure
        </Link>
      </div>
    );
  }

  if (departure.availableSeats <= 0 || departure.status !== "OPEN") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="h-10 w-10 text-rose-500" />
        <h1 className="mt-4 text-xl font-bold text-slate-900">
          This departure is not available
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          All seats on this date have been booked or the departure is closed.
          Please choose another date.
        </p>
        <Link
          href={`/tours/${tour.slug}`}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 text-sm font-bold text-white shadow-md"
        >
          See available dates
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <BookingForm tour={tour} departure={departure} />
    </div>
  );
};

export default BookingPage;
