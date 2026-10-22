"use client";

import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Compass,
  Globe2,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative isolate mt-3 overflow-hidden rounded-[1.75rem] border border-sky-100/70 bg-gradient-to-br from-sky-50 via-white to-indigo-50 sm:rounded-[2.25rem] lg:min-h-[calc(100svh-88px)]">
      {/* Cinematic background */}
      <div className="absolute inset-0 -z-30">
        <Image
          src="/assets/bannerImg/img4.png"
          alt="Beautiful travel destination surrounded by nature"
          fill
          priority
          sizes="100vw"
          className="scale-[1.02] object-cover object-center"
        />
      </div>

      {/* Layered premium overlays */}
      <div className="absolute inset-0 -z-20 bg-white/45" />

      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-white via-white/95 to-white/45 lg:via-white/85 lg:to-white/10" />

      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-sky-50/30 via-transparent to-white/85 lg:to-white/35" />

      {/* Ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-36 -left-32 -z-10 size-[28rem] rounded-full bg-cyan-300/25 blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-40 -z-10 size-[32rem] rounded-full bg-indigo-300/20 blur-[130px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 left-1/3 -z-10 size-[30rem] rounded-full bg-sky-300/25 blur-[120px]"
      />

      {/* Subtle dotted texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#64748b_0.7px,transparent_0.7px)] [background-size:25px_25px] opacity-[0.13]"
      />

      {/* Main content */}
      <div className="mx-auto grid min-h-[720px] max-w-[1400px] items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:min-h-[calc(100svh-88px)] lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 lg:px-12 lg:py-16 xl:px-16">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-2xl"
        >
          {/* Eyebrow */}
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/90 bg-white/75 py-1.5 pr-4 pl-1.5 shadow-[0_8px_30px_-12px_rgba(14,165,233,0.3)] backdrop-blur-xl">
            <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/25">
              <Sparkles size={17} />
            </span>

            <span className="text-[10px] font-extrabold tracking-[0.16em] text-slate-700 uppercase sm:text-xs">
              Your Journey, Our Passion
            </span>

            <span className="ml-1 size-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)]" />
          </div>

          {/* Heading */}
          <h1 className="text-[2.65rem] leading-[1.08] font-black tracking-[-0.055em] text-slate-950 sm:text-6xl md:text-7xl lg:text-[4.4rem] xl:text-[5.15rem]">
            The World Is
            <span className="mt-2 block">
              <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
                Yours to Explore.
              </span>
            </span>
          </h1>

          {/* Decorative underline */}
          <div className="mt-5 flex items-center gap-2">
            <span className="h-1 w-16 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500" />
            <span className="h-1 w-7 rounded-full bg-indigo-400/70" />
            <span className="h-1 w-2 rounded-full bg-violet-400/60" />
          </div>

          <p className="mt-6 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 lg:text-[1.05rem]">
            Discover extraordinary destinations, connect with trusted local
            guides, and turn your travel dreams into unforgettable experiences
            with TravelHub.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/register"
              className="group relative inline-flex min-h-14 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_35px_-12px_rgba(14,165,233,0.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(79,70,229,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />

              <span className="relative">Start Your Journey</span>

              <span className="relative flex size-8 items-center justify-center rounded-xl bg-white/20 transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight size={17} />
              </span>
            </Link>

            <Link
              href="/login"
              className="group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-2xl border border-white/90 bg-white/75 px-6 py-3.5 text-sm font-bold text-slate-700 shadow-[0_8px_28px_-15px_rgba(15,23,42,0.25)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white hover:text-sky-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              <Compass
                size={18}
                className="text-sky-600 transition-transform duration-500 group-hover:rotate-45"
              />
              Explore Your Account
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 border-t border-slate-200/80 pt-6 sm:grid-cols-2 sm:gap-5">
            <div className="group flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-sky-100 bg-gradient-to-br from-white to-sky-50 text-sky-600 shadow-sm transition-all duration-300 group-hover:border-sky-200 group-hover:shadow-md group-hover:shadow-sky-100">
                <ShieldCheck size={23} />
              </span>

              <div>
                <p className="text-sm font-extrabold text-slate-800">
                  Trusted Travel
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Travel with confidence
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50 text-indigo-600 shadow-sm transition-all duration-300 group-hover:border-indigo-200 group-hover:shadow-md group-hover:shadow-indigo-100">
                <MapPin size={23} />
              </span>

              <div>
                <p className="text-sm font-extrabold text-slate-800">
                  Amazing Places
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Find your next adventure
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right floating composition */}
        <motion.div
          initial={{ opacity: 0, x: 35, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className="relative hidden min-h-[500px] items-center justify-center lg:flex"
        >
          {/* Decorative halo */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 size-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-white/10 shadow-[0_0_100px_rgba(56,189,248,0.17)] backdrop-blur-[3px] xl:size-[470px]"
          />

          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 size-[335px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-sky-300/35 xl:size-[395px]"
          />

          {/* Main floating card */}
          <motion.div
            animate={{ y: [0, -9, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-10 w-full max-w-[355px] translate-x-2 rounded-[2rem] border border-white/90 bg-white/85 p-5 shadow-[0_30px_100px_-30px_rgba(15,23,42,0.35)] backdrop-blur-2xl xl:translate-x-6 xl:p-6"
          >
            {/* Card heading */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2.5 inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.17em] text-sky-600 uppercase">
                  <span className="flex size-6 items-center justify-center rounded-lg bg-sky-100">
                    <Compass size={14} />
                  </span>
                  Travel Inspiration
                </div>

                <h2 className="text-[1.65rem] leading-tight font-black tracking-tight text-slate-900">
                  Make Every Trip
                  <span className="block bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                    Count.
                  </span>
                </h2>
              </div>

              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-gradient-to-br from-sky-50 to-indigo-100 text-indigo-600 shadow-sm">
                <Sparkles size={22} />
              </span>
            </div>

            {/* Scenic image */}
            <div className="relative my-5 h-48 overflow-hidden rounded-[1.4rem] bg-slate-100">
              <Image
                src="/assets/bannerImg/img3.png"
                alt="Scenic destination inspiration for your next trip"
                fill
                sizes="355px"
                className="object-cover transition-transform duration-700 ease-out hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />

              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/95 px-3 py-2 text-[11px] font-bold text-slate-800 shadow-lg">
                  <MapPin size={14} className="text-sky-600" />
                  New Discoveries
                </span>

                <span className="rounded-full border border-white/30 bg-slate-950/25 px-3 py-2 text-[10px] font-bold tracking-wide text-white backdrop-blur-md">
                  TRAVELHUB
                </span>
              </div>
            </div>

            <p className="text-[13px] leading-6 text-slate-600">
              From hidden gems to memorable getaways, your next story starts
              with a single step.
            </p>

            {/* Card footer */}
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Your next chapter awaits
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Let the adventure begin
                </p>
              </div>

              <Link
                href="/register"
                aria-label="Get started with TravelHub"
                className="group flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-indigo-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                <ArrowRight
                  size={19}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </motion.div>

          {/* Floating location badge */}
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-12 right-0 z-20 flex items-center gap-3 rounded-2xl border border-white/90 bg-white/90 p-3 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.3)] backdrop-blur-xl xl:-right-3"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-100 to-sky-100 text-sky-700">
              <MapPin size={21} />
            </span>

            <div>
              <p className="text-xs font-extrabold text-slate-800">
                Find Your Place
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                Discover something new
              </p>
            </div>
          </motion.div>

          {/* Floating exploration badge */}
          <motion.div
            animate={{ y: [0, -7, 0], rotate: [0, 3, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
            className="absolute bottom-12 left-0 z-20 flex size-[4.5rem] items-center justify-center rounded-[1.4rem] border border-white/90 bg-white/90 text-indigo-600 shadow-[0_18px_45px_-20px_rgba(79,70,229,0.4)] backdrop-blur-xl xl:-left-3"
          >
            <Globe2 size={34} strokeWidth={1.5} />
            <span className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-cyan-400 to-sky-600 text-white">
              <Sparkles size={12} />
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#features"
        aria-label="Scroll to discover more"
        className="group absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[9px] font-extrabold tracking-[0.24em] text-slate-500 uppercase transition-colors group-hover:text-sky-600">
          Discover More
        </span>

        <span className="flex size-8 items-center justify-center rounded-full border border-white/90 bg-white/75 text-slate-500 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:translate-y-1 group-hover:border-sky-200 group-hover:text-sky-600 group-hover:shadow-md">
          <ArrowDown size={15} />
        </span>
      </a>
    </section>
  );
}
