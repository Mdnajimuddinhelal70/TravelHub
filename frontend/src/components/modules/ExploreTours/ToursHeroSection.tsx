import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Compass,
  Globe2,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

const travelHighlights = [
  {
    icon: Globe2,
    title: "Curated Destinations",
    description: "Places worth discovering",
  },
  {
    icon: ShieldCheck,
    title: "Travel with Confidence",
    description: "A smoother travel journey",
  },
  {
    icon: UsersRound,
    title: "Memorable Experiences",
    description: "Moments to remember",
  },
];

const ToursHeroSection = () => {
  return (
    <section
      aria-labelledby="tours-hero-heading"
      className="relative isolate overflow-hidden bg-white px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-0 -z-10 h-[480px] w-[480px] rounded-full bg-sky-200/45 blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-violet-200/45 blur-[130px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/3 -z-10 h-72 w-[600px] rounded-full bg-cyan-100/60 blur-[110px]"
      />

      {/* Decorative shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-44 -z-10 h-48 w-48 rounded-full border border-sky-200/50"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[12%] top-24 -z-10 hidden h-44 w-44 rounded-full border border-violet-200/50 xl:block"
      />

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 xl:gap-12">
          {/* Left content */}
          <div className="relative z-10 mx-auto w-full max-w-2xl text-center lg:mx-0 lg:text-left">
            {/* Eyebrow */}
            <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-sky-100 bg-white/85 px-4 py-2.5 shadow-sm shadow-sky-100/70 backdrop-blur-xl">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20">
                <Compass className="h-4 w-4" />
              </span>

              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-sky-800 sm:text-xs">
                Explore Tours
              </span>

              <Sparkles className="h-4 w-4 text-violet-500" />
            </div>

            {/* Heading */}
            <h1
              id="tours-hero-heading"
              className="text-balance text-[2.65rem] font-bold leading-[1.08] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[3.75rem] xl:text-[4.4rem]"
            >
              Discover the World
              <span className="mt-1 block bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-600 bg-clip-text pb-1 text-transparent">
                With TravelHub
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg lg:mx-0">
              Explore breathtaking destinations, experience new cultures, and
              create unforgettable memories. Your next adventure starts here.
            </p>

            {/* Highlights */}
            <div className="mt-9 grid grid-cols-1 gap-4 text-left sm:grid-cols-3 sm:gap-3 lg:gap-2">
              {travelHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100/80 bg-white/70 p-3.5 shadow-sm shadow-slate-200/30 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-100 hover:shadow-md sm:flex-col sm:items-start sm:border-transparent sm:bg-transparent sm:p-2 sm:shadow-none"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50 to-violet-50 text-sky-600 ring-1 ring-sky-100/80">
                      <Icon className="h-5 w-5" />
                    </span>

                    <div>
                      <p className="text-sm font-bold leading-5 text-slate-800">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA buttons */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="#all-tours"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-sky-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                <Compass className="h-5 w-5" />
                Explore All Tours
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/"
                className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white/80 px-7 py-4 text-sm font-bold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                Back to Home
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Scroll hint */}
            <Link
              href="#all-tours"
              className="mt-10 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-sky-600"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-200 bg-white/80 text-sky-600 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                <ArrowDown className="h-4 w-4" />
              </span>
              Scroll to explore
            </Link>
          </div>

          {/* Right visual collage */}
          <div className="relative mx-auto w-full max-w-[570px] lg:max-w-none">
            {/* Glow behind images */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-10 inset-y-12 -z-10 rounded-[45%] bg-gradient-to-br from-sky-200/60 via-cyan-100/60 to-violet-200/70 blur-[65px]"
            />

            {/* Main image */}
            <div className="relative mx-auto h-[430px] w-full max-w-[490px] sm:h-[520px] lg:h-[550px] lg:max-w-none">
              <div className="absolute inset-y-8 left-[8%] right-[13%] overflow-hidden rounded-[34px] border-[5px] border-white bg-slate-100 shadow-2xl shadow-sky-900/10 transition-transform duration-700 hover:rotate-1">
                <div
                  role="img"
                  aria-label="Dramatic tropical cliffs and turquoise ocean in Bali"
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=90')",
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/10" />

                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/30 bg-slate-950/25 px-3.5 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-xl">
                  <MapPin className="h-4 w-4 text-cyan-300" />
                  Bali, Indonesia
                </div>

                <div className="absolute inset-x-5 bottom-6 flex items-end justify-between gap-3 sm:inset-x-7 sm:bottom-8">
                  <div className="max-w-[230px]">
                    <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-lg">
                      <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                      Tropical Escape
                    </span>

                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      Find your
                      <span className="block italic">happy place.</span>
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-white/80">
                      Extraordinary places. Unforgettable memories.
                    </p>
                  </div>

                  <div className="hidden shrink-0 items-center gap-1.5 rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-white backdrop-blur-lg sm:flex">
                    <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                    <span className="text-sm font-bold">Discover</span>
                  </div>
                </div>
              </div>

              {/* Top floating destination card */}
              <div className="absolute right-0 top-2 z-20 w-[195px] rounded-2xl border border-white/80 bg-white/95 p-3 shadow-xl shadow-slate-900/10 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 sm:right-0 sm:w-[215px]">
                <div className="flex items-center gap-3">
                  <div
                    role="img"
                    aria-label="Swiss mountain landscape"
                    className="h-[60px] w-[64px] shrink-0 rounded-xl bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=300&q=85')",
                    }}
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      Switzerland
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Mountain escape
                    </p>

                    <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-sky-700">
                      <Sparkles className="h-3.5 w-3.5" />
                      Explore nature
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom-right image */}
              <div className="absolute bottom-0 right-0 z-10 h-[170px] w-[52%] overflow-hidden rounded-[26px] border-[5px] border-white bg-slate-100 shadow-2xl shadow-slate-900/15 transition-transform duration-500 hover:-translate-y-1 hover:rotate-1 sm:h-[210px] sm:w-[54%]">
                <div
                  role="img"
                  aria-label="White architecture and blue domes in Santorini, Greece"
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-110"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=700&q=85')",
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                <div className="absolute inset-x-3 bottom-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <MapPin className="h-3.5 w-3.5 text-cyan-300" />
                    Santorini, Greece
                  </div>

                  <p className="mt-1 text-[11px] text-white/80">
                    A view worth remembering
                  </p>
                </div>
              </div>

              {/* Floating experience card */}
              <div className="absolute bottom-4 left-0 z-20 flex max-w-[245px] items-center gap-3 rounded-2xl border border-white/80 bg-white/95 p-3.5 shadow-xl shadow-sky-900/10 backdrop-blur-xl sm:bottom-6 sm:left-2 sm:max-w-[265px] sm:p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-violet-100 text-sky-700">
                  <Heart className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Made for explorers
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Find journeys that inspire you.
                  </p>
                </div>
              </div>

              {/* Decorative sparkle */}
              <div
                aria-hidden="true"
                className="absolute left-[4%] top-[27%] z-20 hidden h-11 w-11 items-center justify-center rounded-2xl border border-white bg-white/90 text-violet-500 shadow-lg shadow-violet-900/10 sm:flex"
              >
                <Sparkles className="h-5 w-5" />
              </div>

              {/* Floating orbit dot */}
              <div
                aria-hidden="true"
                className="absolute right-[9%] top-[24%] z-20 h-3 w-3 rounded-full bg-cyan-400 ring-4 ring-cyan-100/70"
              />
            </div>

            {/* Visual caption */}
            <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-slate-500 lg:justify-end">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-sky-300" />
              <Compass className="h-4 w-4 text-sky-500" />
              <span>Every journey starts with a discovery.</span>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-violet-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToursHeroSection;
