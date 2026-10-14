import {
  ArrowDown,
  ArrowRight,
  Compass,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative isolate min-h-[720px] mt-3 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50 sm:min-h-[760px] lg:min-h-[calc(100svh-76px)]">
      {/* Scenic background image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/assets/bannerImg/img4.png"
          alt="Beautiful travel destination surrounded by nature"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Light premium gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white via-white/95 to-white/35" />

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sky-50/20 via-transparent to-white/70" />

      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 -z-10 size-80 rounded-full bg-sky-300/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-20 -z-10 size-72 rounded-full bg-indigo-300/20 blur-3xl"
      />

      {/* Hero content */}
      <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:min-h-[calc(100svh-76px)] lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:px-10 lg:py-16">
        <div className="max-w-2xl">
          {/* Eyebrow badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-white/85 px-4 py-2 shadow-sm shadow-sky-100/70 backdrop-blur-md">
            <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white">
              <Sparkles className="size-3.5" />
            </span>

            <span className="text-xs font-bold tracking-wide text-slate-700 sm:text-sm">
              YOUR JOURNEY, OUR PASSION
            </span>

            <span className="hidden size-1.5 rounded-full bg-cyan-500 sm:block" />
          </div>

          {/* Main heading */}
          <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-[4.25rem]">
            The World Is
            <br />
            <span className="relative inline-block bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 bg-clip-text pb-2 text-transparent">
              Yours to Explore.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:mt-6 sm:text-lg">
            Discover extraordinary destinations, connect with trusted local
            guides, and turn your travel dreams into unforgettable experiences
            with TravelHub.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/register"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              Start Your Journey
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/login"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/85 px-6 py-3 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              Explore Your Account
              <Compass className="size-4" />
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-slate-200/80 pt-6">
            <div className="flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                <ShieldCheck className="size-5" />
              </span>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Trusted Travel
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Travel with confidence
                </p>
              </div>
            </div>

            <div className="hidden h-9 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <MapPin className="size-5" />
              </span>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Amazing Places
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Find your next adventure
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right-side floating travel card */}
        <div className="relative hidden min-h-[440px] items-center justify-center lg:flex">
          {/* Soft decorative ring */}
          <div
            aria-hidden="true"
            className="absolute size-[390px] rounded-full border border-white/70 bg-white/10 shadow-[0_0_100px_rgba(56,189,248,0.16)] backdrop-blur-[2px] xl:size-[440px]"
          />

          {/* Floating info card */}
          <div className="relative z-10 w-full max-w-[350px] translate-x-3 rounded-3xl border border-white/80 bg-white/85 p-5 shadow-[0_24px_80px_-25px_rgba(15,23,42,0.28)] backdrop-blur-xl xl:translate-x-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-sky-600">
                  <Compass className="size-3.5" />
                  Travel inspiration
                </div>

                <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                  Make Every Trip
                  <br />
                  Count.
                </h2>
              </div>

              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 text-indigo-600">
                <Sparkles className="size-5" />
              </span>
            </div>

            <div className="my-5 overflow-hidden rounded-2xl">
              <div className="relative h-44">
                <Image
                  src="/assets/bannerImg/img3.png"
                  alt="Scenic destination inspiration for your next trip"
                  fill
                  sizes="350px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-transparent to-transparent" />

                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm">
                    <MapPin className="size-3.5 text-sky-600" />
                    New discoveries
                  </span>

                  <span className="rounded-full bg-white/20 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                    TravelHub
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm leading-6 text-slate-600">
              From hidden gems to memorable getaways, your next story starts
              with a single step.
            </p>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-xs font-medium text-slate-500">
                Your next chapter awaits
              </span>

              <Link
                href="/register"
                aria-label="Get started with TravelHub"
                className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-200/60 transition hover:scale-105"
              >
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Floating location badge */}
          <div className="absolute right-0 top-12 flex items-center gap-2.5 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-lg shadow-slate-200/50 backdrop-blur-md xl:-right-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-100 to-sky-100 text-sky-700">
              <MapPin className="size-5" />
            </span>

            <div>
              <p className="text-xs font-bold text-slate-800">
                Find Your Place
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Discover something new
              </p>
            </div>
          </div>

          {/* Floating compass badge */}
          <div className="absolute bottom-12 left-0 flex size-16 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-indigo-600 shadow-xl shadow-indigo-100/70 backdrop-blur-md xl:-left-2">
            <Compass className="size-8" strokeWidth={1.7} />
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <a
        href="#features"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-slate-500 transition hover:text-sky-600 md:flex"
        aria-label="Scroll to discover more"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
          Discover More
        </span>
        <ArrowDown className="size-4 animate-bounce" />
      </a>
    </section>
  );
}
