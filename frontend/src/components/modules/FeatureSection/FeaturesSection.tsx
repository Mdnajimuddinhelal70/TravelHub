import {
  ArrowDownRight,
  ArrowRight,
  BadgeCheck,
  Compass,
  Globe2,
  Headphones,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    number: "01",
    eyebrow: "DISCOVER MORE",
    title: "Find places that move you.",
    description:
      "From peaceful escapes to unforgettable adventures, discover destinations that match the way you love to travel.",
    icon: Compass,
    className:
      "bg-gradient-to-br from-sky-50 via-white to-cyan-50/80 lg:col-span-7",
    iconClassName: "bg-sky-600 text-white shadow-lg shadow-sky-600/20",
    accent: "text-sky-700",
    decoration: "bg-sky-200/50",
    visual: "from-sky-200/70 via-cyan-100/50 to-transparent",
    visualIcon: Globe2,
  },
  {
    number: "02",
    eyebrow: "TRAVEL WITH CONFIDENCE",
    title: "A journey you can trust.",
    description:
      "Find clear tour information and enjoy a more organized experience as you plan your next getaway.",
    icon: ShieldCheck,
    className:
      "bg-gradient-to-br from-violet-50 via-white to-indigo-50/80 lg:col-span-5",
    iconClassName: "bg-violet-600 text-white shadow-lg shadow-violet-600/20",
    accent: "text-violet-700",
    decoration: "bg-violet-200/50",
    visual: "from-violet-200/70 via-indigo-100/50 to-transparent",
    visualIcon: BadgeCheck,
  },
  {
    number: "03",
    eyebrow: "LOCAL PERSPECTIVES",
    title: "Go beyond the ordinary.",
    description:
      "Explore places, discover local highlights, and make more room for meaningful travel experiences.",
    icon: MapPin,
    className:
      "bg-gradient-to-br from-emerald-50 via-white to-teal-50/80 lg:col-span-5",
    iconClassName: "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20",
    accent: "text-emerald-700",
    decoration: "bg-emerald-200/50",
    visual: "from-emerald-200/70 via-teal-100/50 to-transparent",
    visualIcon: Users,
  },
  {
    number: "04",
    eyebrow: "HERE FOR YOUR JOURNEY",
    title: "Travel planning, made simpler.",
    description:
      "Keep your travel plans moving with a straightforward platform built to make exploring and booking easier.",
    icon: Headphones,
    className:
      "bg-gradient-to-br from-orange-50 via-white to-amber-50/80 lg:col-span-7",
    iconClassName: "bg-orange-500 text-white shadow-lg shadow-orange-500/20",
    accent: "text-orange-700",
    decoration: "bg-orange-200/50",
    visual: "from-orange-200/70 via-amber-100/50 to-transparent",
    visualIcon: Sparkles,
  },
];

const FeaturesSection = () => {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="relative isolate overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-40 -z-10 h-96 w-96 rounded-full bg-sky-100/70 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-20 -z-10 h-96 w-96 rounded-full bg-violet-100/60 blur-[110px]"
      />

      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16 lg:mb-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-4 py-2 shadow-sm shadow-sky-100/60 backdrop-blur">
            <Sparkles className="h-4 w-4 text-sky-600" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700 sm:text-sm">
              The TravelHub Difference
            </span>
          </div>

          <h2
            id="features-heading"
            className="text-balance text-4xl font-bold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
          >
            More than a trip.
            <br />
            <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent">
              A world of possibilities.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Every great journey begins with inspiration. Discover a simpler,
            more thoughtful way to explore the world with TravelHub.
          </p>
        </div>

        {/* Bento feature grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            const VisualIcon = feature.visualIcon;

            return (
              <article
                key={feature.number}
                className={`group relative isolate min-h-[310px] overflow-hidden rounded-[28px] border border-slate-200/70 p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-slate-300/80 hover:shadow-2xl hover:shadow-slate-200/60 sm:min-h-[330px] sm:p-8 lg:p-9 ${feature.className}`}
              >
                {/* Decorative visual */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-12 -top-12 -z-10 h-56 w-56 rounded-full bg-gradient-to-br ${feature.visual} opacity-80 transition-transform duration-700 group-hover:scale-125 sm:h-64 sm:w-64`}
                />

                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -bottom-16 -right-12 -z-10 h-44 w-44 rounded-full ${feature.decoration} opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-70`}
                />

                {/* Top row */}
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:rotate-[-5deg] group-hover:scale-110 ${feature.iconClassName}`}
                  >
                    <Icon className="h-7 w-7" strokeWidth={1.8} />
                  </div>

                  <span className="font-mono text-sm font-semibold tracking-wider text-slate-400">
                    / {feature.number}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-10 mt-9 max-w-md">
                  <p
                    className={`mb-3 text-[10px] font-extrabold tracking-[0.2em] sm:text-xs ${feature.accent}`}
                  >
                    {feature.eyebrow}
                  </p>

                  <h3 className="max-w-sm text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl">
                    {feature.title}
                  </h3>

                  <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600 sm:text-base">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative corner icon */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/80 bg-white/70 text-slate-500 shadow-sm backdrop-blur-sm transition-all duration-500 group-hover:rotate-45 group-hover:text-slate-900 sm:bottom-8 sm:right-8"
                >
                  <VisualIcon className="h-5 w-5" strokeWidth={1.7} />
                </div>

                {/* Bottom accent */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-500 transition-all duration-500 group-hover:w-full"
                />
              </article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="relative mt-8 overflow-hidden rounded-[28px] bg-slate-950 px-6 py-8 shadow-xl shadow-slate-900/10 sm:px-9 sm:py-10 lg:mt-10 lg:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-sky-500/20 blur-[80px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-violet-500/20 blur-[80px]"
          />

          <div className="relative flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
            <div className="max-w-xl">
              <div className="mb-3 flex items-center gap-2 text-sky-300">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-[0.18em]">
                  Your next chapter awaits
                </span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                The world is waiting.
                <br className="hidden sm:block" /> Where will you go next?
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                Start exploring new possibilities and make your next journey one
                to remember.
              </p>
            </div>

            <Link
              href="/register"
              className="group inline-flex w-full shrink-0 items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-sm font-bold text-slate-950 transition-all duration-300 hover:bg-sky-50 hover:shadow-lg hover:shadow-white/10 sm:w-auto"
            >
              Start Your Journey
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <ArrowDownRight
            aria-hidden="true"
            className="pointer-events-none absolute right-5 top-5 h-7 w-7 text-white/10 sm:right-8 sm:top-8 sm:h-9 sm:w-9"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
