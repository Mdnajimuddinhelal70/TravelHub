/* eslint-disable react/no-unescaped-entities */

import {
  ArrowRight,
  Compass,
  Heart,
  Lightbulb,
  MoveUpRight,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

const OUR_STORY_IMAGE =
  "https://res.cloudinary.com/dpgjlcycl/image/upload/v1792765249/Collaborative_Coders_in_a_Modern_Workspace_em9uyt.png";

const principles = [
  {
    number: "01",
    icon: Users,
    title: "Shared Leadership",
    description:
      "Both co-founders share responsibility for guiding TravelHub, coordinating the team, and overseeing the company's travel operations.",
  },
  {
    number: "02",
    icon: Compass,
    title: "A Traveler-First Mindset",
    description:
      "We aim to make discovering destinations and exploring travel opportunities simpler, clearer, and more enjoyable.",
  },
  {
    number: "03",
    icon: Lightbulb,
    title: "Continuous Improvement",
    description:
      "We want TravelHub to grow through thoughtful decisions, collaboration, and a commitment to improving the experience.",
  },
];

const OurStorySection = () => {
  return (
    <section
      id="our-story"
      aria-labelledby="our-story-heading"
      className="relative isolate overflow-hidden bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-32"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 top-32 h-96 w-96 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-violet-100/60 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-50/70 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/85 px-4 py-2 shadow-sm shadow-sky-950/[0.03] backdrop-blur">
            <Sparkles size={15} className="text-sky-600" />

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-700 sm:text-sm">
              The Story Behind TravelHub
            </span>
          </div>

          <h2
            id="our-story-heading"
            className="text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
          >
            One Company.
            <span className="mt-2 block bg-gradient-to-r from-sky-600 via-cyan-600 to-violet-600 bg-clip-text pb-2 text-transparent">
              Two Co-founders.
            </span>
            A Shared Vision.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            TravelHub brings together our shared ambition to build a travel
            company focused on discovery, thoughtful experiences, and a
            traveler-first approach.
          </p>
        </div>

        {/* Main story layout */}
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-20">
          {/* Visual */}
          <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
            {/* Decorative frame */}
            <div
              aria-hidden="true"
              className="absolute -left-3 -top-3 h-28 w-28 rounded-tl-[2rem] border-l-2 border-t-2 border-sky-300 sm:-left-5 sm:-top-5 sm:h-36 sm:w-36"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-3 -right-3 h-28 w-28 rounded-br-[2rem] border-b-2 border-r-2 border-violet-300 sm:-bottom-5 sm:-right-5 sm:h-36 sm:w-36"
            />

            <div className="relative rounded-[1.8rem] border border-white bg-white/80 p-2 shadow-2xl shadow-slate-900/[0.08] backdrop-blur-sm sm:rounded-[2.25rem] sm:p-3">
              <div
                role="img"
                aria-label="A shared workspace representing the people and vision behind TravelHub"
                className="relative min-h-[370px] overflow-hidden rounded-[1.4rem] bg-cover bg-center sm:min-h-[490px] sm:rounded-[1.75rem] lg:min-h-[540px]"
                style={{
                  backgroundImage: `url("${OUR_STORY_IMAGE}")`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/15 to-slate-900/5" />

                {/* Top label */}
                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-slate-950/20 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md sm:left-7 sm:top-7 sm:text-sm">
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                  Our journey, together
                </div>

                {/* Bottom caption */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200 sm:text-sm">
                    Built around a shared vision
                  </p>

                  <h3 className="mt-3 max-w-md text-2xl font-bold leading-snug text-white sm:text-3xl lg:text-4xl">
                    Bringing people and travel opportunities closer together.
                  </h3>

                  <p className="mt-4 max-w-md text-sm leading-7 text-white/80 sm:text-base">
                    A company shaped by collaboration, shared responsibility,
                    and a common ambition for better travel experiences.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating identity card */}
            <div className="absolute -bottom-7 right-3 max-w-[275px] rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl shadow-slate-950/[0.08] backdrop-blur-xl sm:-bottom-8 sm:-right-4 sm:max-w-[310px] sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-violet-500 text-white shadow-lg shadow-sky-500/20">
                  <Heart size={20} />
                </div>

                <div>
                  <p className="font-bold text-slate-900">Equal co-founders</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                    One company, shared leadership.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Story content */}
          <div className="pt-3 lg:pt-0">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-700 sm:text-sm">
              Why we started
            </p>

            <h3 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-3xl lg:text-[2.6rem]">
              A shared ambition to make travel discovery better.
            </h3>

            <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
              <p>
                Founded by{" "}
                <span className="font-semibold text-slate-900">
                  Najim Uddin
                </span>{" "}
                and{" "}
                <span className="font-semibold text-slate-900">
                  Md Rubel Ahmed Rana
                </span>
                , TravelHub is a jointly led travel company built around a
                shared vision.
              </p>

              <p>
                Together, we share responsibility for guiding the company,
                coordinating our team, and overseeing travel operations. Our
                common goal is to help travelers discover destinations and
                explore travel opportunities through a more thoughtful
                experience.
              </p>

              <p>
                The TravelHub application is developed by Najim, while the
                company's direction and leadership remain a shared
                responsibility between both co-founders. We believe a strong
                travel company needs both a useful digital experience and
                committed people working together.
              </p>
            </div>

            {/* Shared principles */}
            <div className="mt-9 space-y-3">
              {principles.map((principle) => {
                const Icon = principle.icon;

                return (
                  <article
                    key={principle.number}
                    className="group flex gap-4 rounded-2xl border border-slate-100/90 bg-white/75 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-sky-100 hover:shadow-lg hover:shadow-sky-950/[0.04] sm:gap-5 sm:p-5"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50 to-violet-50 text-sky-700 ring-1 ring-sky-100 transition duration-300 group-hover:from-sky-100 group-hover:to-violet-100">
                      <Icon size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-slate-900">
                          {principle.title}
                        </h4>

                        <span className="text-[10px] font-bold tracking-widest text-slate-300">
                          {principle.number}
                        </span>
                      </div>

                      <p className="mt-1.5 text-sm leading-6 text-slate-600">
                        {principle.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                href="/tours"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-600/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-600/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                Explore Tours
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/divisions"
                className="group inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition-colors hover:text-sky-700"
              >
                Discover destinations
                <MoveUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStorySection;
