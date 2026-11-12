import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Compass,
  MapPin,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { getAllDestinations } from "@/services/destination/getAllDestinations";

const getDivisionName = (division: unknown): string => {
  if (typeof division === "object" && division !== null && "name" in division) {
    return (division as { name: string }).name;
  }
  return "Bangladesh";
};

const PopularDestinationsSection = async () => {
  const { destinations } = await getAllDestinations({
    limit: "4",
    sort: "-createdAt",
  });

  // No destinations → section hide
  if (destinations.length === 0) {
    return null;
  }

  return (
    <section
      id="popular-destinations"
      aria-labelledby="destinations-heading"
      className="relative isolate overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-32 -z-10 h-96 w-96 rounded-full bg-sky-100/70 blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-72 -z-10 h-96 w-96 rounded-full bg-violet-100/60 blur-[110px]"
      />

      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16 lg:mb-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-4 py-2 shadow-sm shadow-sky-100/60 backdrop-blur">
            <MapPin className="h-4 w-4 text-sky-600" />

            <span className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700 sm:text-sm">
              Popular Destinations
            </span>
          </div>

          <h2
            id="destinations-heading"
            className="text-balance text-4xl font-bold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
          >
            Explore Our
            <br className="sm:hidden" />{" "}
            <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent">
              Most Popular Destinations
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            From breathtaking landscapes to vibrant cultures, discover
            extraordinary places and find inspiration for your next
            unforgettable journey.
          </p>
        </div>

        {/* Destination cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {destinations.map((destination) => (
            <article
              key={destination._id}
              className="group relative isolate min-h-[440px] overflow-hidden rounded-[28px] border border-slate-200/70 bg-slate-100 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-sky-200 hover:shadow-2xl hover:shadow-slate-300/40 sm:min-h-[460px] lg:min-h-[490px]"
            >
              {/* Image */}
              <div
                role="img"
                aria-label={destination.name}
                className="absolute inset-0 -z-20 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                style={{
                  backgroundImage: `url("${
                    destination.thumbnail ||
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85"
                  }")`,
                }}
              />

              {/* Image overlay */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/30 via-transparent to-transparent opacity-80"
              />

              {/* Top row — Division badge */}
              <div className="absolute inset-x-5 top-5 flex items-start justify-between gap-3">
                <div className="rounded-2xl border border-white/20 bg-slate-950/35 px-3.5 py-2.5 text-white shadow-lg backdrop-blur-md">
                  <p className="text-[10px] font-medium tracking-wide text-white/80">
                    Division
                  </p>
                  <p className="text-sm font-extrabold tracking-tight">
                    {getDivisionName(destination.division)}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white/90">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">{destination.slug}</span>
                </div>

                <h3 className="text-2xl font-bold tracking-tight sm:text-[27px]">
                  {destination.name}
                </h3>

                {destination.description && (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/85">
                    {destination.description}
                  </p>
                )}

                {/* Action */}
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/20 pt-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                    <Sparkles className="h-3 w-3" />
                    Explore tours
                  </span>

                  <Link
                    href={`/tours?search=${encodeURIComponent(destination.name)}`}
                    aria-label={`Explore tours for ${destination.name}`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-950 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  >
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                  </Link>
                </div>
              </div>

              {/* Hover accent */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-1 w-0 bg-sky-400 transition-all duration-500 group-hover:w-full"
              />
            </article>
          ))}
        </div>

        {/* Bottom CTA — অপরিবর্তিত */}
        <div className="group/cta relative mt-8 overflow-hidden rounded-[28px] bg-slate-950 px-6 py-8 shadow-xl shadow-slate-900/10 sm:px-9 sm:py-10 lg:mt-10 lg:px-12 lg:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-sky-500/20 blur-[80px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-violet-500/20 blur-[80px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -bottom-40 h-80 w-80 rounded-full border border-sky-400/10 transition-transform duration-700 group-hover/cta:scale-110"
          />

          <div className="relative flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <div className="mb-3 flex items-center gap-2 text-sky-300">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-[0.18em]">
                  Ready for your next adventure?
                </span>
              </div>

              <h3 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                Your next adventure
                <br className="hidden sm:block" /> starts{" "}
                <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                  somewhere extraordinary.
                </span>
              </h3>

              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
                Find your perfect destination, explore new possibilities and
                turn your travel dreams into unforgettable memories.
              </p>
            </div>

            <Link
              href="/destination"
              className="group inline-flex w-full shrink-0 items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-sm font-bold text-slate-950 transition-all duration-300 hover:bg-sky-50 hover:shadow-lg hover:shadow-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto"
            >
              Explore All Destinations
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <ArrowDownRight
            aria-hidden="true"
            className="pointer-events-none absolute right-5 top-5 h-7 w-7 text-white/10 sm:right-8 sm:top-8 sm:h-9 sm:w-9"
          />
          <Compass
            aria-hidden="true"
            className="pointer-events-none absolute bottom-5 right-8 hidden h-24 w-24 rotate-12 text-white/[0.04] transition-transform duration-700 group-hover/cta:rotate-45 sm:block"
          />
        </div>
      </div>
    </section>
  );
};

export default PopularDestinationsSection;
