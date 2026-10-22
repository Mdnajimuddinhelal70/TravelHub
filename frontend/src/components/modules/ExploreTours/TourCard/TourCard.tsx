import { ArrowUpRight, CalendarDays, Clock3, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { Tour } from "../tour.data";

type TourCardProps = {
  tour: Tour;
};

const TourCard = ({ tour }: TourCardProps) => {
  return (
    <article className="group overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-sky-200 hover:shadow-2xl hover:shadow-slate-300/35">
      {/* Image */}
      <div className="relative h-60 overflow-hidden bg-slate-100">
        <div
          role="img"
          aria-label={`${tour.destination}, ${tour.country}`}
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url("${tour.image}")` }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/10" />

        {tour.featured && (
          <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/90 px-3.5 py-1.5 text-xs font-bold text-sky-700 shadow-sm backdrop-blur-md">
            Featured
          </span>
        )}

        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-white/25 bg-slate-950/35 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md">
          <MapPin className="h-3.5 w-3.5 text-cyan-300" />
          {tour.destination}, {tour.country}
        </div>

        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-xs font-bold text-slate-800 shadow-lg">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {tour.rating.toFixed(1)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
          {tour.category}
        </div>

        <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-sky-700">
          {tour.title}
        </h3>

        <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
          {tour.description}
        </p>

        <div className="mt-5 flex items-center gap-4 border-b border-slate-100 pb-5 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Clock3 className="h-4 w-4 text-sky-600" />
            {tour.duration}
          </span>

          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-violet-500" />
            Flexible plans
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Starting from</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
              ${tour.price}
              <span className="ml-1 text-xs font-medium text-slate-400">
                / person
              </span>
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {tour.reviews} reviews
            </p>
          </div>

          <Link
            href={`/tours/${tour.id}`}
            aria-label={`View ${tour.title}`}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-600 text-white shadow-lg shadow-sky-500/20 transition-all duration-300 hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default TourCard;
