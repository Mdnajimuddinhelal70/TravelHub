"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const categories = [
  "All Destinations",
  "Nature",
  "Mountains",
  "Beaches",
  "Culture",
] as const;

type DestinationCategory = (typeof categories)[number];

type Destination = {
  id: number;
  name: string;
  country: string;
  category: Exclude<DestinationCategory, "All Destinations">;
  description: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
};

const destinations: Destination[] = [
  {
    id: 1,
    name: "Sylhet",
    country: "Bangladesh",
    category: "Nature",
    description:
      "Explore lush tea gardens, peaceful rivers, and the refreshing beauty of green landscapes.",
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Lush green natural landscape surrounded by trees",
    featured: true,
  },
  {
    id: 2,
    name: "Swiss Alps",
    country: "Switzerland",
    category: "Mountains",
    description:
      "Discover breathtaking mountain scenery, alpine villages, and unforgettable views.",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Majestic mountain peaks beneath a clear sky",
    featured: true,
  },
  {
    id: 3,
    name: "Bali",
    country: "Indonesia",
    category: "Beaches",
    description:
      "Find tropical coastlines, peaceful retreats, and beautiful island experiences.",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Tropical Bali landscape with traditional architecture",
    featured: true,
  },
  {
    id: 4,
    name: "Kyoto",
    country: "Japan",
    category: "Culture",
    description:
      "Experience traditional streets, timeless architecture, and rich cultural heritage.",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Traditional Japanese architecture surrounded by greenery",
  },
  {
    id: 5,
    name: "Banff",
    country: "Canada",
    category: "Nature",
    description:
      "Escape into crystal-clear lakes, forest trails, and spectacular wilderness.",
    image:
      "https://images.unsplash.com/photo-1503614472-8c93d56cd7b5?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Turquoise lake surrounded by dramatic mountain scenery",
  },
  {
    id: 6,
    name: "Santorini",
    country: "Greece",
    category: "Beaches",
    description:
      "Enjoy bright coastal views, beautiful island architecture, and Mediterranean charm.",
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Whitewashed buildings overlooking the sea in Santorini",
  },
];

const ExploreDestinationsSection = () => {
  const [activeCategory, setActiveCategory] =
    useState<DestinationCategory>("All Destinations");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDestinations = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return destinations.filter((destination) => {
      const matchesCategory =
        activeCategory === "All Destinations" ||
        destination.category === activeCategory;

      const searchableText = [
        destination.name,
        destination.country,
        destination.category,
        destination.description,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const resetFilters = () => {
    setActiveCategory("All Destinations");
    setSearchQuery("");
  };

  return (
    <section
      id="explore-destinations"
      aria-labelledby="explore-destinations-heading"
      className="relative isolate overflow-hidden bg-slate-50/70 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 top-40 h-80 w-80 rounded-full bg-sky-200/35 blur-[100px]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-violet-200/30 blur-[110px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-100/40 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-white px-4 py-2 shadow-sm shadow-sky-100/70">
            <Compass size={15} className="text-sky-600" />
            <span className="text-xs font-bold tracking-[0.16em] text-slate-600 uppercase">
              Explore the World
            </span>
          </div>

          <h2
            id="explore-destinations-heading"
            className="text-3xl leading-tight font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            Find a Place That
            <span className="block bg-gradient-to-r from-sky-600 via-cyan-600 to-violet-600 bg-clip-text pb-2 text-transparent">
              Moves Your Soul
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            From peaceful nature escapes to vibrant cultural cities, explore
            inspiring destinations and find the perfect setting for your next
            journey.
          </p>
        </div>

        {/* Search and filters */}
        <div className="mt-10 rounded-3xl border border-white bg-white/85 p-4 shadow-xl shadow-slate-900/[0.04] backdrop-blur-xl sm:p-6 lg:mt-12">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                size={19}
                aria-hidden="true"
                className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
              />

              <label htmlFor="destination-search" className="sr-only">
                Search destinations
              </label>

              <input
                id="destination-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by destination or country..."
                className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/70 pr-11 pl-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear destination search"
                  className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div
              aria-label="Filter destinations by category"
              className="flex flex-wrap items-center justify-start gap-2 lg:justify-end"
            >
              {categories.map((category) => {
                const isActive = activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-xl px-4 py-2.5 text-xs font-bold transition duration-200 sm:text-sm ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-md shadow-sky-600/20"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results heading */}
        <div className="mt-10 flex flex-wrap items-end justify-between gap-4 sm:mt-12">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-sky-700 uppercase">
              <Sparkles size={14} />
              Handpicked Inspiration
            </p>

            <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Explore beautiful places
            </h3>

            <p aria-live="polite" className="mt-2 text-sm text-slate-500">
              {filteredDestinations.length}{" "}
              {filteredDestinations.length === 1
                ? "destination"
                : "destinations"}{" "}
              to discover
            </p>
          </div>

          {(searchQuery || activeCategory !== "All Destinations") && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-sky-200 hover:text-sky-700"
            >
              <X size={15} />
              Clear filters
            </button>
          )}
        </div>

        {/* Destination cards */}
        {filteredDestinations.length > 0 ? (
          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {filteredDestinations.map((destination) => (
              <article
                key={destination.id}
                className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white shadow-sm shadow-slate-900/[0.03] transition duration-500 hover:-translate-y-1.5 hover:border-sky-200 hover:shadow-2xl hover:shadow-sky-900/[0.09]"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden sm:h-72">
                  <div
                    role="img"
                    aria-label={destination.imageAlt}
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{
                      backgroundImage: `url("${destination.image}")`,
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/0 to-slate-950/10" />

                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-md">
                      <Compass size={13} className="text-sky-600" />
                      {destination.category}
                    </span>
                  </div>

                  {destination.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-slate-900/30 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                        <Sparkles size={12} />
                        Featured
                      </span>
                    </div>
                  )}

                  <div className="absolute right-5 bottom-5 left-5">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-white/85">
                          <MapPin size={14} />
                          {destination.country}
                        </div>

                        <h4 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                          {destination.name}
                        </h4>
                      </div>

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition duration-300 group-hover:rotate-45 group-hover:bg-white group-hover:text-sky-700">
                        <ArrowUpRight size={20} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card content */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="flex-1 text-sm leading-7 text-slate-600">
                    {destination.description}
                  </p>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <Link
                      href={`/destinations/${encodeURIComponent(
                        destination.name.toLowerCase().replace(/\s+/g, "-"),
                      )}`}
                      className="group/link inline-flex items-center gap-2 text-sm font-bold text-sky-700 transition hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-4"
                      aria-label={`Explore ${destination.name}, ${destination.country}`}
                    >
                      Explore destination
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover/link:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white/80 px-5 py-14 text-center sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
              <Search size={24} />
            </div>

            <h4 className="mt-5 text-xl font-bold text-slate-900">
              No destinations found
            </h4>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              We couldn&apos;t find a destination matching your search. Try a
              different name or choose another category.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
            >
              Show all destinations
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="relative mt-12 overflow-hidden rounded-[2rem] bg-gradient-to-r from-sky-700 via-cyan-700 to-blue-700 px-6 py-8 shadow-xl shadow-sky-900/10 sm:px-9 sm:py-10 lg:mt-16 lg:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-24 h-64 w-64 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-2 -top-16 h-48 w-48 rounded-full border border-white/10"
          />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-cyan-100 uppercase">
                <Sparkles size={14} />
                Your next adventure awaits
              </p>

              <h3 className="text-2xl leading-tight font-extrabold tracking-tight text-white sm:text-3xl">
                Found a place you love?
              </h3>

              <p className="mt-3 text-sm leading-7 text-sky-100 sm:text-base">
                Turn your travel inspiration into a journey worth remembering.
                Explore tours and start planning your next escape.
              </p>
            </div>

            <Link
              href="/tours"
              className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-sky-800 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Explore Tours
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreDestinationsSection;
