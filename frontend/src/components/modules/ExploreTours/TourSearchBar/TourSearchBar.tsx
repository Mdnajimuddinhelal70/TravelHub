"use client";

import {
  ArrowRight,
  Compass,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

const tourCategories = [
  { label: "All Categories", value: "" },
  { label: "Adventure", value: "adventure" },
  { label: "Beach & Islands", value: "beach" },
  { label: "Nature", value: "nature" },
  { label: "Cultural", value: "cultural" },
  { label: "City Tours", value: "city" },
];

type TourSearchBarProps = {
  onSearch?: (filters: { destination: string; category: string }) => void;
};

const TourSearchBar = ({ onSearch }: TourSearchBarProps) => {
  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSearch?.({
      destination: destination.trim(),
      category,
    });

    document.getElementById("all-tours")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      aria-label="Search tours"
      className="relative z-20 px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <form
          onSubmit={handleSearch}
          className="relative overflow-hidden rounded-[28px] border border-sky-100/80 bg-white/95 p-4 shadow-[0_20px_70px_-25px_rgba(14,165,233,0.22)] backdrop-blur-xl sm:p-6 lg:p-7"
        >
          {/* Decorative gradient */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-28 h-56 w-56 rounded-full bg-violet-100/70 blur-[75px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-1/4 h-48 w-48 rounded-full bg-sky-100/70 blur-[70px]"
          />

          <div className="relative">
            {/* Heading */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-500/20">
                    <Search className="h-4 w-4" />
                  </span>

                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
                    Find Your Experience
                  </span>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                  Where would you like to go?
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Find a destination that matches your travel style.
                </p>
              </div>

              <div className="hidden items-center gap-2 self-start rounded-full border border-violet-100 bg-violet-50/80 px-3.5 py-2 text-xs font-semibold text-violet-700 sm:inline-flex">
                <Compass className="h-4 w-4" />
                Your next adventure starts here
              </div>
            </div>

            {/* Search fields */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
              {/* Destination */}
              <div className="min-w-0">
                <label
                  htmlFor="tour-destination"
                  className="mb-2.5 flex items-center gap-2 text-sm font-bold text-slate-800"
                >
                  <MapPin className="h-4 w-4 text-sky-600" />
                  Destination
                </label>

                <div className="group flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 transition-all duration-300 focus-within:border-sky-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100/70 hover:border-sky-200">
                  <Search className="h-5 w-5 shrink-0 text-slate-400 transition-colors group-focus-within:text-sky-600" />

                  <input
                    id="tour-destination"
                    name="destination"
                    type="search"
                    value={destination}
                    onChange={(event) => setDestination(event.target.value)}
                    placeholder="e.g. Bali, Switzerland..."
                    className="h-full w-full min-w-0 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="min-w-0">
                <label
                  htmlFor="tour-category"
                  className="mb-2.5 flex items-center gap-2 text-sm font-bold text-slate-800"
                >
                  <SlidersHorizontal className="h-4 w-4 text-violet-600" />
                  Tour Category
                </label>

                <div className="relative">
                  <select
                    id="tour-category"
                    name="category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/80 px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition-all duration-300 hover:border-violet-200 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100/70"
                  >
                    {tourCategories.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>

                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
                      <path
                        d="m5 7.5 5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Search button */}
              <button
                type="submit"
                className="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600 px-7 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 active:translate-y-0 md:w-auto"
              >
                <Search className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                Search Tours
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Quick suggestions */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold text-slate-500">
                Popular:
              </span>

              {["Bali", "Switzerland", "Santorini", "Thailand"].map((place) => (
                <button
                  key={place}
                  type="button"
                  onClick={() => setDestination(place)}
                  className="rounded-full border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 transition-all duration-200 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  {place}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default TourSearchBar;
