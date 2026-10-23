"use client";

import {
  ArrowDownUp,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Compass,
  Heart,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  UsersRound,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const categories = [
  "All Tours",
  "Beach",
  "Adventure",
  "Nature",
  "Cultural",
] as const;

type TourCategory = (typeof categories)[number];

type Tour = {
  id: string;
  slug: string;
  title: string;
  destination: string;
  category: Exclude<TourCategory, "All Tours">;
  image: string;
  imageAlt: string;
  duration: string;
  groupSize: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  featured: boolean;
  badge?: string;
  description: string;
};

const demoTours: Tour[] = [
  {
    id: "tour-1",
    slug: "bali-tropical-escape",
    title: "Bali Tropical Escape",
    destination: "Bali, Indonesia",
    category: "Beach",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Lush tropical landscape and traditional Balinese architecture",
    duration: "5 Days / 4 Nights",
    groupSize: "2–10 people",
    price: 649,
    originalPrice: 799,
    rating: 4.9,
    reviews: 128,
    featured: true,
    badge: "Bestseller",
    description:
      "Discover tropical beaches, hidden temples, and unforgettable island sunsets.",
  },
  {
    id: "tour-2",
    slug: "swiss-alpine-adventure",
    title: "Swiss Alpine Adventure",
    destination: "Interlaken, Switzerland",
    category: "Adventure",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Beautiful Swiss alpine scenery beneath a dramatic sky",
    duration: "6 Days / 5 Nights",
    groupSize: "2–8 people",
    price: 1299,
    originalPrice: 1499,
    rating: 4.9,
    reviews: 96,
    featured: true,
    badge: "Popular",
    description:
      "Explore breathtaking mountain scenery and unforgettable alpine experiences.",
  },
  {
    id: "tour-3",
    slug: "santorini-coastal-journey",
    title: "Santorini Coastal Journey",
    destination: "Santorini, Greece",
    category: "Cultural",
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Whitewashed Santorini buildings overlooking the blue Aegean Sea",
    duration: "4 Days / 3 Nights",
    groupSize: "2–12 people",
    price: 899,
    originalPrice: 1099,
    rating: 4.8,
    reviews: 84,
    featured: false,
    description:
      "Experience island architecture, charming streets, and coastal sunsets.",
  },
  {
    id: "tour-4",
    slug: "bali-rainforest-retreat",
    title: "Rainforest Retreat",
    destination: "Ubud, Bali",
    category: "Nature",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Peaceful green rainforest filled with lush trees",
    duration: "3 Days / 2 Nights",
    groupSize: "2–8 people",
    price: 349,
    originalPrice: 429,
    rating: 4.8,
    reviews: 72,
    featured: false,
    description:
      "Reconnect with nature through peaceful landscapes and scenic forest trails.",
  },
  {
    id: "tour-5",
    slug: "thailand-island-discovery",
    title: "Island Discovery",
    destination: "Phi Phi Islands, Thailand",
    category: "Beach",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Crystal-clear turquoise ocean along a tropical sandy beach",
    duration: "4 Days / 3 Nights",
    groupSize: "2–10 people",
    price: 529,
    originalPrice: 649,
    rating: 4.7,
    reviews: 63,
    featured: false,
    description:
      "Discover turquoise lagoons, island views, and relaxing beach escapes.",
  },
  {
    id: "tour-6",
    slug: "himalayan-mountain-escape",
    title: "Himalayan Escape",
    destination: "Pokhara, Nepal",
    category: "Adventure",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Towering mountain peaks and spectacular alpine scenery",
    duration: "5 Days / 4 Nights",
    groupSize: "2–8 people",
    price: 749,
    originalPrice: 899,
    rating: 4.9,
    reviews: 105,
    featured: false,
    description:
      "Take in remarkable mountain landscapes and explore the great outdoors.",
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

const AllToursSection = () => {
  const [activeCategory, setActiveCategory] =
    useState<TourCategory>("All Tours");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [maxBudget, setMaxBudget] = useState("any");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredTours = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const result = demoTours.filter((tour) => {
      const matchesCategory =
        activeCategory === "All Tours" || tour.category === activeCategory;

      const matchesSearch =
        !normalizedQuery ||
        `${tour.title} ${tour.destination} ${tour.category}`
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesBudget =
        maxBudget === "any" || tour.price <= Number(maxBudget);

      return matchesCategory && matchesSearch && matchesBudget;
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return Number(b.featured) - Number(a.featured);
      }
    });
  }, [activeCategory, searchQuery, sortBy, maxBudget]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const clearFilters = () => {
    setActiveCategory("All Tours");
    setSearchQuery("");
    setSortBy("featured");
    setMaxBudget("any");
  };

  const hasActiveFilters =
    activeCategory !== "All Tours" ||
    searchQuery.trim() !== "" ||
    sortBy !== "featured" ||
    maxBudget !== "any";

  return (
    <section
      id="all-tours"
      aria-labelledby="all-tours-heading"
      className="relative isolate overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-40 -z-10 h-[400px] w-[400px] rounded-full bg-sky-100/60 blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-[45%] -z-10 h-[440px] w-[440px] rounded-full bg-violet-100/50 blur-[120px]"
      />

      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50/80 px-4 py-2">
              <Compass className="h-4 w-4 text-sky-600" />

              <span className="text-[11px] font-extrabold uppercase tracking-[0.17em] text-sky-800">
                The TravelHub Collection
              </span>
            </div>

            <h2
              id="all-tours-heading"
              className="text-balance text-3xl font-bold leading-tight tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-5xl"
            >
              Find Your Next
              <span className="mt-1 block bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-600 bg-clip-text pb-1 text-transparent">
                Extraordinary Journey
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              Explore handpicked journeys, compare experiences, and discover
              places that make every moment of your trip worth remembering.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm shadow-slate-900/[0.03]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-violet-100 text-sky-700">
              <MapPin className="h-5 w-5" />
            </div>

            <div>
              <p className="text-lg font-bold text-slate-900">
                {filteredTours.length.toString().padStart(2, "0")}{" "}
                <span className="text-sm font-semibold text-slate-500">
                  journeys
                </span>
              </p>

              <p className="text-xs text-slate-500">
                Matching your preferences
              </p>
            </div>
          </div>
        </div>

        {/* Search and filter toolbar */}
        <div className="mt-10 rounded-[26px] border border-slate-200/80 bg-white/90 p-4 shadow-lg shadow-slate-900/[0.035] backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            {/* Search */}
            <div className="relative w-full xl:max-w-md">
              <Search
                aria-hidden="true"
                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search destinations or experiences..."
                aria-label="Search tours by destination or experience"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Budget filter */}
              <div className="relative flex-1 sm:min-w-[175px]">
                <label htmlFor="tour-collection-budget" className="sr-only">
                  Filter by maximum price
                </label>

                <select
                  id="tour-collection-budget"
                  value={maxBudget}
                  onChange={(event) => setMaxBudget(event.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-9 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                >
                  <option value="any">Any budget</option>
                  <option value="400">Up to $400</option>
                  <option value="600">Up to $600</option>
                  <option value="800">Up to $800</option>
                  <option value="1000">Up to $1,000</option>
                </select>

                <SlidersHorizontal
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                />
              </div>

              {/* Sorting */}
              <div className="relative flex-1 sm:min-w-[190px]">
                <label htmlFor="tour-collection-sort" className="sr-only">
                  Sort tours
                </label>

                <select
                  id="tour-collection-sort"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-9 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                >
                  <option value="featured">Featured first</option>
                  <option value="price-low">Price: Low to high</option>
                  <option value="price-high">Price: High to low</option>
                  <option value="rating">Highest rated</option>
                </select>

                <ArrowDownUp
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Category filters */}
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5">
            <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Categories
            </span>

            {categories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={isActive}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
                    isActive
                      ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                  }`}
                >
                  {isActive && <Check className="h-3.5 w-3.5" />}
                  {category}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
              >
                <X className="h-3.5 w-3.5" />
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Collection heading */}
        <div className="mb-7 mt-10 flex items-center justify-between gap-4 sm:mb-8 sm:mt-12">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              {activeCategory === "All Tours"
                ? "Discover all tours"
                : `${activeCategory} tours`}
            </h3>

            <p className="mt-1.5 text-sm text-slate-500">
              Showing {filteredTours.length}{" "}
              {filteredTours.length === 1 ? "experience" : "experiences"}
            </p>
          </div>

          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:inline-flex">
            <Sparkles className="h-3.5 w-3.5" />
            Curated journeys
          </span>
        </div>

        {/* Tour cards */}
        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-7">
            {filteredTours.map((tour) => {
              const isFavorite = favorites.includes(tour.id);

              return (
                <article
                  key={tour.id}
                  className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.035] transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-100 hover:shadow-xl hover:shadow-slate-900/[0.08]"
                >
                  {/* Tour image */}
                  <div className="relative h-[245px] overflow-hidden bg-slate-100 sm:h-[255px]">
                    <Image
                      src={tour.image}
                      alt={tour.imageAlt}
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-slate-950/10"
                    />

                    {/* Category badge */}
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      {tour.badge && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-800 shadow-sm backdrop-blur-xl">
                          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                          {tour.badge}
                        </span>
                      )}

                      <span className="rounded-full border border-white/25 bg-slate-950/35 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-xl">
                        {tour.category}
                      </span>
                    </div>

                    {/* Favorite control */}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(tour.id)}
                      aria-label={
                        isFavorite
                          ? `Remove ${tour.title} from favorites`
                          : `Add ${tour.title} to favorites`
                      }
                      aria-pressed={isFavorite}
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/90 text-slate-600 shadow-lg backdrop-blur-xl transition-all hover:scale-105 hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                    >
                      <Heart
                        className={`h-[18px] w-[18px] ${
                          isFavorite ? "fill-rose-500 text-rose-500" : ""
                        }`}
                      />
                    </button>

                    {/* Rating */}
                    <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-xl border border-white/25 bg-slate-950/30 px-3 py-2 text-xs font-bold text-white backdrop-blur-xl">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {tour.rating.toFixed(1)}
                      <span className="font-medium text-white/75">
                        ({tour.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-700">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{tour.destination}</span>
                    </div>

                    <h4 className="mt-3 text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-sky-700 sm:text-[22px]">
                      {tour.title}
                    </h4>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {tour.description}
                    </p>

                    {/* Tour metadata */}
                    <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                          <Clock3 className="h-4 w-4" />
                        </span>

                        <div className="min-w-0">
                          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                            Duration
                          </p>

                          <p className="mt-1 truncate text-xs font-bold text-slate-700">
                            {tour.duration}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                          <UsersRound className="h-4 w-4" />
                        </span>

                        <div className="min-w-0">
                          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                            Group size
                          </p>

                          <p className="mt-1 truncate text-xs font-bold text-slate-700">
                            {tour.groupSize}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Price and details */}
                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Starting from
                        </p>

                        <div className="mt-1 flex flex-wrap items-baseline gap-2">
                          <span className="text-2xl font-extrabold tracking-tight text-slate-950">
                            {formatPrice(tour.price)}
                          </span>

                          <span className="text-xs font-medium text-slate-400 line-through">
                            {formatPrice(tour.originalPrice)}
                          </span>
                        </div>

                        <p className="mt-1 text-[11px] text-slate-500">
                          Per person · Demo pricing
                        </p>
                      </div>

                      <Link
                        href={`/tours/${tour.slug}`}
                        aria-label={`View details for ${tour.title}`}
                        className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-600 hover:to-violet-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                      >
                        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/70 px-5 py-16 text-center sm:px-10 sm:py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-violet-100 text-sky-700">
              <Search className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No journeys found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
              We couldn&apos;t find any tours matching your current filters. Try
              another destination, choose a different category, or adjust your
              budget.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              Clear all filters
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Collection footer */}
        <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-[24px] border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-sky-50/70 p-6 sm:flex-row sm:p-8">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm ring-1 ring-slate-100">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div>
              <p className="font-bold text-slate-900">
                Your next adventure starts here
              </p>

              <p className="mt-1 max-w-lg text-sm leading-6 text-slate-500">
                Find an experience you love and explore the details of your next
                unforgettable journey.
              </p>
            </div>
          </div>

          <Link
            href="#tour-discovery-heading"
            className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            Refine your search
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
          Sample tour listings and prices are for UI demonstration only. Live
          availability, ratings, and prices will come from the backend.
        </p>
      </div>
    </section>
  );
};

export default AllToursSection;
