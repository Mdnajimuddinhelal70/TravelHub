import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Star,
  UsersRound,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDeparturesByTour } from "@/services/tour-departure/getDeparturesByTour";
import { getTourBySlug } from "@/services/tour/getTourBySlug";
import type { ITour, ITourDeparture } from "@/types";

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

const getCoverImage = (tour: ITour): string =>
  tour.coverImage ||
  tour.images?.[0] ||
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85";

const getDestinationName = (tour: ITour): string => {
  if (tour.primaryDestination && typeof tour.primaryDestination !== "string") {
    return tour.primaryDestination.name;
  }
  if (Array.isArray(tour.destinations) && tour.destinations.length > 0) {
    const first = tour.destinations[0];
    return typeof first === "string" ? first : first.name;
  }
  return "Multiple destinations";
};

const getTourTypeName = (tour: ITour): string => {
  if (typeof tour.tourType === "string") return tour.tourType;
  return tour.tourType?.name ?? "Tour";
};

const TourDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  const departures = await getDeparturesByTour(tour._id, {
    status: "OPEN",
    sort: "startDate",
    limit: "50",
  });

  const cover = getCoverImage(tour);
  const destination = getDestinationName(tour);
  const tourType = getTourTypeName(tour);

  const finalPrice =
    tour.price.adult -
    (tour.price.adult * (tour.price.discountPercent ?? 0)) / 100;

  const availableDepartures = departures.filter(
    (d) => d.status === "OPEN" && d.availableSeats > 0,
  );

  return (
    <div className="bg-white pb-20">
      {/* Hero */}
      <div className="relative h-[380px] w-full overflow-hidden sm:h-[480px]">
        <Image
          src={cover}
          alt={tour.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-slate-950/10" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <Link
            href="/tours"
            className="mb-4 inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/25"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to tours
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-sky-500/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              {tourType}
            </span>
            {tour.category && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white capitalize backdrop-blur">
                {tour.category}
              </span>
            )}
            {tour.difficulty && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white capitalize backdrop-blur">
                {tour.difficulty}
              </span>
            )}
          </div>

          <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {tour.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/90">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {destination}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {(tour.rating ?? 0).toFixed(1)} ({tour.totalReviews ?? 0} reviews)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" />
              {tour.duration.days}D / {tour.duration.nights}N
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UsersRound className="h-4 w-4" />
              {tour.minGroupSize ?? 1}–{tour.maxGuest ?? 20} people
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        {/* Main content */}
        <div className="space-y-10 lg:col-span-2">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              Overview
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
              {tour.description ?? "No description available."}
            </p>
          </section>

          {/* Itinerary */}
          {tour.tourPlan?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                Itinerary
              </h2>
              <ol className="mt-4 space-y-4">
                {tour.tourPlan.map((day) => (
                  <li
                    key={day.day}
                    className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-xs font-bold text-white">
                        {day.day}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900">
                          {day.title}
                        </h3>
                        {day.description && (
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {day.description}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500">
                          {day.meals && day.meals.length > 0 && (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                              Meals: {day.meals.join(", ")}
                            </span>
                          )}
                          {day.accommodation && (
                            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-violet-700">
                              Stay: {day.accommodation}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Included / Excluded */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
              <h3 className="flex items-center gap-2 font-bold text-emerald-800">
                <Check className="h-4 w-4" />
                Included
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-emerald-900/90">
                {tour.included?.length > 0 ? (
                  tour.included.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-emerald-700/70">Not specified</li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-5">
              <h3 className="flex items-center gap-2 font-bold text-rose-800">
                <X className="h-4 w-4" />
                Excluded
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-rose-900/90">
                {tour.excluded?.length > 0 ? (
                  tour.excluded.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <X className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-rose-700/70">Not specified</li>
                )}
              </ul>
            </div>
          </section>

          {/* Amenities */}
          {tour.amenities?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                Amenities
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {tour.amenities.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Cancellation policy */}
          {tour.cancellationPolicy && (
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                Cancellation Policy
              </h2>
              <p className="mt-3 whitespace-pre-line rounded-2xl border border-amber-100 bg-amber-50/60 p-5 text-sm leading-6 text-amber-900/90">
                {tour.cancellationPolicy}
              </p>
            </section>
          )}
        </div>

        {/* Sidebar — departures */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-lg shadow-slate-900/[0.04]">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Starting from
                </p>
                <p className="mt-1 text-2xl font-extrabold text-slate-950">
                  {formatPrice(finalPrice)}
                </p>
                <p className="text-[11px] text-slate-500">per person</p>
              </div>
              <CalendarDays className="h-5 w-5 text-sky-600" />
            </div>

            <hr className="my-4 border-slate-100" />

            <h3 className="text-sm font-bold text-slate-900">
              Available Departures
            </h3>

            {availableDepartures.length > 0 ? (
              <ul className="mt-3 space-y-3">
                {availableDepartures.map((d: ITourDeparture) => (
                  <li
                    key={d._id}
                    className="rounded-xl border border-slate-200 bg-slate-50/60 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {formatDate(d.startDate)}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          to {formatDate(d.endDate)}
                        </p>
                      </div>
                      <p className="text-sm font-extrabold text-sky-700">
                        {formatPrice(d.pricePerPerson)}
                      </p>
                    </div>
                    <p className="mt-1 text-[11px] font-semibold text-slate-500">
                      {d.availableSeats} seat
                      {d.availableSeats !== 1 ? "s" : ""} left
                    </p>
                    <Link
                      href={`/tours/${tour.slug}/book?departure=${d._id}`}
                      className="mt-3 flex h-10 w-full items-center justify-center rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-xs font-bold text-white shadow-md shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      Book Now
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-center text-xs text-slate-500">
                No open departures right now. Please check back later.
              </p>
            )}

            {tour.minAge !== undefined && (
              <p className="mt-4 rounded-lg bg-violet-50 px-3 py-2 text-[11px] font-semibold text-violet-700">
                Minimum age: {tour.minAge} years
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TourDetailPage;
