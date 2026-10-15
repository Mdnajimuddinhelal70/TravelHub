"use client";

import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  MapPin,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const tourPackages = [
  {
    id: 1,
    title: "Discover Bali Paradise",
    location: "Bali, Indonesia",
    category: "Beach & Island",
    duration: "5 Days / 4 Nights",
    groupSize: "2–8 People",
    price: 649,
    rating: 4.9,
    reviews: 128,
    badge: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Beautiful tropical Bali temple surrounded by greenery",
    featured: true,
  },
  {
    id: 2,
    title: "Swiss Alpine Escape",
    location: "Interlaken, Switzerland",
    category: "Mountain Adventure",
    duration: "7 Days / 6 Nights",
    groupSize: "2–10 People",
    price: 1299,
    rating: 4.9,
    reviews: 96,
    badge: "Popular",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Majestic Swiss alpine mountains and scenic landscape",
    featured: false,
  },
  {
    id: 3,
    title: "Maldives Blue Escape",
    location: "Malé, Maldives",
    category: "Luxury Getaway",
    duration: "4 Days / 3 Nights",
    groupSize: "2–6 People",
    price: 899,
    rating: 4.8,
    reviews: 84,
    badge: "Limited Offer",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Luxury tropical island resort surrounded by turquoise water",
    featured: false,
  },
];

const FeaturedTourPackagesSection = () => {
  return (
    <section
      id="featured-tours"
      aria-labelledby="featured-tours-heading"
      className="relative isolate overflow-hidden bg-slate-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 top-24 h-80 w-80 rounded-full bg-cyan-200/30 blur-[100px]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-violet-200/30 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sky-200/20 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_0.7px,transparent_0.7px)] [background-size:24px_24px] opacity-[0.15]" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-white/80 px-4 py-2 shadow-sm shadow-cyan-100/50 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
              </span>
              <span className="text-xs font-bold tracking-[0.16em] text-slate-700 uppercase">
                Curated Experiences
              </span>
            </div>

            <h2
              id="featured-tours-heading"
              className="text-3xl leading-tight font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
            >
              Find Your Next
              <span className="mt-2 block bg-gradient-to-r from-cyan-600 via-sky-600 to-violet-600 bg-clip-text text-transparent">
                Extraordinary Escape.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              From tropical hideaways to breathtaking mountain adventures,
              discover handpicked journeys designed to turn your travel dreams
              into unforgettable memories.
            </p>
          </div>

          <Link
            href="/tours"
            className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition-all duration-300 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 hover:shadow-lg hover:shadow-cyan-100/50"
          >
            Explore All Tours
            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>

        {/* Tour cards */}
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
          {tourPackages.map((tour, index) => (
            <motion.article
              key={tour.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.6,
                delay: index * 0.12,
                ease: "easeOut",
              }}
              className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-white shadow-[0_12px_45px_-25px_rgba(15,23,42,0.20)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_65px_-25px_rgba(8,145,178,0.25)] ${
                tour.featured
                  ? "border-cyan-200/80"
                  : "border-slate-200/80 hover:border-cyan-200"
              }`}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden sm:h-72">
                <Image
                  src={tour.image}
                  alt={tour.imageAlt}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-slate-950/10" />

                {/* Top badges */}
                <div className="absolute top-4 right-4 left-4 flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/90 px-3.5 py-2 text-xs font-bold text-slate-800 shadow-lg backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    {tour.badge}
                  </span>

                  <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/35 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    {tour.rating}
                    <span className="text-white/70">({tour.reviews})</span>
                  </div>
                </div>

                {/* Image caption */}
                <div className="absolute right-5 bottom-5 left-5">
                  <span className="mb-3 inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md">
                    {tour.category}
                  </span>

                  <h3 className="text-2xl font-bold tracking-tight text-white sm:text-[1.7rem]">
                    {tour.title}
                  </h3>

                  <p className="mt-2 flex items-center gap-1.5 text-sm text-white/85">
                    <MapPin size={15} className="shrink-0 text-cyan-300" />
                    {tour.location}
                  </p>
                </div>
              </div>

              {/* Card content */}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-3 transition-colors duration-300 group-hover:bg-cyan-50/70">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-100/80 text-cyan-700">
                      <CalendarDays size={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium tracking-wide text-slate-500 uppercase">
                        Duration
                      </p>
                      <p className="mt-1 text-xs font-bold text-slate-800">
                        {tour.duration}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-3 transition-colors duration-300 group-hover:bg-violet-50/70">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100/80 text-violet-700">
                      <Users size={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium tracking-wide text-slate-500 uppercase">
                        Group Size
                      </p>
                      <p className="mt-1 text-xs font-bold text-slate-800">
                        {tour.groupSize}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-slate-100 pt-5">
                  <div>
                    <p className="mb-1 text-xs text-slate-500">Starting from</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold tracking-tight text-slate-950">
                        ${tour.price.toLocaleString("en-US")}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        / person
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/tours/${tour.id}`}
                    aria-label={`Explore ${tour.title}`}
                    className="group/button inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-violet-600 text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/30 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <ArrowDownRight
                      size={22}
                      className="transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:translate-y-0.5"
                    />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12 flex flex-col items-center justify-between gap-5 rounded-3xl border border-cyan-100 bg-gradient-to-r from-white via-cyan-50/80 to-violet-50/80 p-6 shadow-sm shadow-cyan-100/40 sm:flex-row sm:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/20">
              <Clock3 size={22} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Your next adventure is waiting.
              </h3>
              <p className="mt-1 max-w-lg text-sm leading-6 text-slate-600">
                Explore more destinations and find a journey that fits your
                travel style.
              </p>
            </div>
          </div>

          <Link
            href="/tours"
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-cyan-700 hover:shadow-lg hover:shadow-cyan-700/20"
          >
            Discover More
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedTourPackagesSection;
