import { ArrowDown, ArrowRight, Compass, Globe2, Sparkles } from "lucide-react";
import Link from "next/link";

const AboutHeroSection = () => {
  return (
    <section
      aria-labelledby="about-hero-heading"
      className="relative isolate overflow-hidden bg-white"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 -top-36 h-96 w-96 rounded-full bg-sky-200/35 blur-3xl" />
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-96 rounded-full bg-cyan-100/40 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:pb-28 lg:pt-24">
        {/* Left content */}
        <div className="relative z-10 max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-4 py-2 shadow-sm shadow-sky-100/50 backdrop-blur">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-500 text-white">
              <Sparkles size={14} />
            </span>

            <span className="text-sm font-semibold tracking-wide text-slate-700">
              The People Behind TravelHub
            </span>
          </div>

          <h1
            id="about-hero-heading"
            className="text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl xl:text-[4.25rem]"
          >
            Two Co-founders.
            <span className="mt-2 block bg-gradient-to-r from-sky-600 via-cyan-600 to-violet-600 bg-clip-text pb-2 text-transparent">
              One Shared Vision.
            </span>
            A World to Explore.
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            TravelHub began with a shared vision: to make discovering
            destinations and exploring travel opportunities simpler and more
            enjoyable. We are building a platform where technology and the
            excitement of travel come together.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/tours"
              className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-600/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-600/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              Explore Tours
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/divisions"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50"
            >
              <Compass size={18} className="text-sky-600" />
              Discover Destinations
            </Link>
          </div>

          {/* Co-founder introduction */}
          <div className="mt-10 flex flex-col gap-4 border-t border-slate-200/80 pt-7 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex -space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-white bg-gradient-to-br from-sky-500 to-cyan-500 text-sm font-extrabold text-white shadow-sm">
                NU
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-white bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-extrabold text-white shadow-sm">
                RR
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-900">
                Najim Uddin &amp; Md Rubel Ahmed Rana
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Co-founders building TravelHub together
              </p>
            </div>
          </div>
        </div>

        {/* Right visual */}
        <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
          {/* Decorative rings */}
          <div
            aria-hidden="true"
            className="absolute -right-5 -top-5 h-32 w-32 rounded-full border border-sky-200/80 sm:-right-8 sm:-top-8 sm:h-44 sm:w-44"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-6 -left-5 h-28 w-28 rounded-full border border-violet-200/80 sm:-bottom-8 sm:-left-8 sm:h-36 sm:w-36"
          />

          {/* Main travel image */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white bg-slate-100 p-2.5 shadow-2xl shadow-sky-900/10 sm:rounded-[2.5rem] sm:p-3">
            <div
              role="img"
              aria-label="A scenic mountain lake surrounded by dramatic mountains"
              className="relative min-h-[390px] overflow-hidden rounded-[1.5rem] bg-cover bg-center sm:min-h-[500px] sm:rounded-[2rem]"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/10 to-sky-900/10" />

              {/* Top image label */}
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md sm:left-7 sm:top-7 sm:text-sm">
                <Globe2 size={15} />
                Discover. Explore. Experience.
              </div>

              {/* Image bottom content */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200 sm:text-sm">
                  <span className="h-px w-7 bg-cyan-300" />
                  Our journey
                </span>

                <h2 className="mt-3 max-w-sm text-3xl font-bold leading-tight text-white sm:text-4xl">
                  Built on ideas.
                  <br />
                  Inspired by discovery.
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-white/80 sm:text-base">
                  A shared project, a collaborative journey, and a vision that
                  keeps moving forward.
                </p>
              </div>
            </div>
          </div>

          {/* Floating co-founder card */}
          <div className="absolute -bottom-7 right-3 max-w-[255px] rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl shadow-slate-900/10 backdrop-blur-xl sm:-bottom-8 sm:-right-5 sm:max-w-[280px] sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-violet-500 text-white shadow-md shadow-sky-500/20">
                <Sparkles size={20} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  One team, shared responsibility
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                  Working together to shape and improve TravelHub.
                </p>
              </div>
            </div>
          </div>

          {/* Small scroll indicator */}
          <div className="mt-12 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 sm:mt-14">
            <ArrowDown size={15} />
            Get to know our story
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
