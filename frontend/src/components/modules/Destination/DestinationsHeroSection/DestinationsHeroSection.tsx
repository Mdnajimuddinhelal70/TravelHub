import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Compass,
  Globe2,
  MapPin,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const destinationHighlights = [
  {
    name: "Sylhet",
    country: "Bangladesh",
    className: "bg-emerald-50 text-emerald-700",
  },
  {
    name: "Bali",
    country: "Indonesia",
    className: "bg-sky-50 text-sky-700",
  },
  {
    name: "Swiss Alps",
    country: "Switzerland",
    className: "bg-violet-50 text-violet-700",
  },
];

const DestinationsHeroSection = () => {
  return (
    <section
      aria-labelledby="destinations-hero-heading"
      className="relative isolate overflow-hidden bg-white"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-sky-200/40 blur-[100px]" />
        <div className="absolute right-[-100px] top-20 h-96 w-96 rounded-full bg-violet-200/35 blur-[110px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-100/50 blur-[100px]" />

        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_0.7px,transparent_0.7px)] [background-size:25px_25px] opacity-[0.16]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          {/* Left: Content */}
          <div className="relative z-10 mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-white/80 px-4 py-2 shadow-sm shadow-sky-100/70 backdrop-blur">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
                <Sparkles size={14} />
              </span>

              <span className="text-xs font-bold tracking-[0.15em] text-slate-600 uppercase sm:text-sm">
                Find Your Next Escape
              </span>
            </div>

            <h1
              id="destinations-hero-heading"
              className="text-4xl leading-[1.13] font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-[4.25rem]"
            >
              Extraordinary
              <span className="mt-1 block bg-gradient-to-r from-sky-600 via-cyan-600 to-violet-600 bg-clip-text pb-2 text-transparent">
                Places.
              </span>
              <span className="block">Unforgettable Journeys.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg lg:mx-0">
              From peaceful green landscapes to breathtaking mountain escapes,
              discover places that inspire your next adventure with TravelHub.
            </p>

            {/* Actions */}
            <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
              <Link
                href="#explore-destinations"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-sky-600/20 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-600/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
              >
                Explore Destinations
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/tours"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-7 py-4 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
              >
                <Compass size={18} />
                Discover Tours
                <ArrowUpRight size={16} />
              </Link>
            </div>

            {/* Destination highlights */}
            <div className="mt-10 border-t border-slate-200/80 pt-7">
              <p className="mb-4 text-xs font-bold tracking-[0.16em] text-slate-400 uppercase">
                Get inspired by
              </p>

              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                {destinationHighlights.map((destination) => (
                  <div
                    key={destination.name}
                    className="group inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-3.5 py-2.5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${destination.className}`}
                    >
                      <MapPin size={16} />
                    </span>

                    <span className="text-left">
                      <span className="block text-sm font-bold text-slate-800">
                        {destination.name}
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        {destination.country}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Destination visual */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            {/* Image glow */}
            <div
              aria-hidden="true"
              className="absolute -inset-5 rounded-[3rem] bg-gradient-to-br from-sky-300/30 via-cyan-200/20 to-violet-300/30 blur-2xl"
            />

            <div className="relative">
              {/* Main destination image */}
              <div className="relative h-[390px] overflow-hidden rounded-[2rem] border border-white shadow-2xl shadow-slate-900/10 sm:h-[490px] sm:rounded-[2.5rem]">
                <div
                  role="img"
                  aria-label="Beautiful tropical island with turquoise water and lush green mountains"
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1400&q=85')",
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-900/5 to-slate-900/10" />

                {/* Image label */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-9">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                    <Globe2 size={14} />
                    The world is waiting
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Your next story
                    <span className="block">starts here.</span>
                  </h2>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/80 sm:text-base">
                    Discover new cultures, beautiful landscapes, and memories
                    worth keeping.
                  </p>
                </div>

                {/* Decorative image marker */}
                <div className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/40 bg-white/20 text-white shadow-lg backdrop-blur-md sm:right-7 sm:top-7">
                  <Compass size={23} />
                </div>
              </div>

              {/* Floating destination card */}
              <div className="absolute -left-2 top-8 max-w-[185px] rounded-2xl border border-white/80 bg-white/95 p-3.5 shadow-xl shadow-slate-900/10 backdrop-blur-xl sm:-left-7 sm:top-12 sm:max-w-[215px] sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-cyan-100 text-sky-700">
                    <Globe2 size={21} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Open your world
                    </p>
                    <p className="mt-1 text-sm font-extrabold text-slate-800">
                      Endless possibilities
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating bottom card */}
              <div className="absolute -right-1 bottom-24 max-w-[190px] rounded-2xl border border-white/80 bg-white/95 p-3.5 shadow-xl shadow-slate-900/10 backdrop-blur-xl sm:-right-5 sm:bottom-28 sm:max-w-[225px] sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-700">
                    <Sparkles size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-extrabold text-slate-800">
                      Make it memorable
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Find a place that feels like you.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom scroll hint */}
              <a
                href="#explore-destinations"
                className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-xs font-semibold text-slate-500 transition hover:border-sky-200 hover:text-sky-700 sm:mt-10"
              >
                Scroll to explore
                <ArrowDown size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DestinationsHeroSection;
