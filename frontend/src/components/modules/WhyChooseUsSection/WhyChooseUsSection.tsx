import {
  ArrowDownRight,
  ArrowRight,
  BadgeCheck,
  Clock3,
  Headset,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import Link from "next/link";

const benefits = [
  {
    number: "01",
    eyebrow: "TRAVEL WITH CONFIDENCE",
    title: "Trusted Travel Experiences",
    description:
      "Discover carefully selected destinations and plan your next adventure with greater confidence and peace of mind.",
    icon: ShieldCheck,
    visualIcon: BadgeCheck,
    iconStyle: "bg-sky-50 text-sky-600",
    glow: "bg-sky-100",
    accent: "text-sky-600",
    visual: "from-sky-100/80 to-cyan-50/30",
  },
  {
    number: "02",
    eyebrow: "MORE VALUE, LESS STRESS",
    title: "Great Value for Your Journey",
    description:
      "Explore travel options that fit your plans and budget, making it easier to spend more time enjoying the experience.",
    icon: Wallet,
    visualIcon: Sparkles,
    iconStyle: "bg-violet-50 text-violet-600",
    glow: "bg-violet-100",
    accent: "text-violet-600",
    visual: "from-violet-100/80 to-fuchsia-50/30",
  },
  {
    number: "03",
    eyebrow: "YOUR TIME MATTERS",
    title: "Simple & Seamless Planning",
    description:
      "Find inspiring destinations and explore available tours through an experience designed to keep your planning simple.",
    icon: Clock3,
    visualIcon: ArrowRight,
    iconStyle: "bg-cyan-50 text-cyan-600",
    glow: "bg-cyan-100",
    accent: "text-cyan-600",
    visual: "from-cyan-100/80 to-sky-50/30",
  },
  {
    number: "04",
    eyebrow: "HERE WHEN YOU NEED US",
    title: "Support Along the Way",
    description:
      "Get help when you need guidance, so you can focus on discovering new places and making memorable experiences.",
    icon: Headset,
    visualIcon: HeartHandshake,
    iconStyle: "bg-indigo-50 text-indigo-600",
    glow: "bg-indigo-100",
    accent: "text-indigo-600",
    visual: "from-indigo-100/80 to-violet-50/30",
  },
];

const WhyChooseUsSection = () => {
  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-choose-us-heading"
      className="relative isolate overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-40 -z-10 h-96 w-96 rounded-full bg-sky-100/70 blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-20 -z-10 h-96 w-96 rounded-full bg-violet-100/60 blur-[110px]"
      />

      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16 lg:mb-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-4 py-2 shadow-sm shadow-sky-100/60 backdrop-blur">
            <Sparkles className="h-4 w-4 text-sky-600" />

            <span className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700 sm:text-sm">
              Why TravelHub
            </span>
          </div>

          <h2
            id="why-choose-us-heading"
            className="text-balance text-4xl font-bold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
          >
            Travel Smarter.
            <br />
            <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent">
              Experience More.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Your journey deserves more than just a destination. Discover a
            thoughtful travel experience designed around simplicity, flexibility
            and the joy of exploring somewhere new.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            const VisualIcon = benefit.visualIcon;

            return (
              <article
                key={benefit.number}
                className="group relative isolate min-h-[340px] overflow-hidden rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-sky-200/80 hover:shadow-2xl hover:shadow-slate-200/60 sm:min-h-[360px] sm:p-7 lg:p-8"
              >
                {/* Decorative gradient */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-14 -top-14 -z-10 h-48 w-48 rounded-full bg-gradient-to-br ${benefit.visual} opacity-90 transition-transform duration-700 group-hover:scale-125 sm:h-56 sm:w-56`}
                />

                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -bottom-16 -right-10 -z-10 h-40 w-40 rounded-full ${benefit.glow} opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-70`}
                />

                {/* Top row */}
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:rotate-[-5deg] group-hover:scale-110 ${benefit.iconStyle}`}
                  >
                    <Icon className="h-7 w-7" strokeWidth={1.8} />
                  </div>

                  <span className="font-mono text-sm font-semibold tracking-wider text-slate-400">
                    / {benefit.number}
                  </span>
                </div>

                {/* Main content */}
                <div className="relative z-10 mt-9">
                  <p
                    className={`mb-3 text-[10px] font-extrabold tracking-[0.16em] sm:text-[11px] ${benefit.accent}`}
                  >
                    {benefit.eyebrow}
                  </p>

                  <h3 className="text-xl font-bold leading-snug tracking-tight text-slate-950 sm:text-2xl">
                    {benefit.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {benefit.description}
                  </p>
                </div>

                {/* Decorative corner icon */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/80 text-slate-500 shadow-sm backdrop-blur-sm transition-all duration-500 group-hover:rotate-45 group-hover:text-slate-900 sm:bottom-7 sm:right-7"
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

        {/* Trust banner */}
        <div className="relative mt-8 overflow-hidden rounded-[28px] bg-slate-950 px-6 py-8 shadow-xl shadow-slate-900/10 sm:px-9 sm:py-10 lg:mt-10 lg:px-12 lg:py-12">
          {/* Banner atmosphere */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-sky-500/20 blur-[80px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-violet-500/20 blur-[80px]"
          />

          <div className="relative flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2 text-sky-300">
                <HeartHandshake className="h-4 w-4" />

                <span className="text-xs font-bold uppercase tracking-[0.18em]">
                  Your Journey, Our Priority
                </span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Every great journey
                <br className="hidden sm:block" /> begins with a{" "}
                <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                  little inspiration.
                </span>
              </h3>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Find a place that inspires you, explore your possibilities and
                take the first step toward your next adventure.
              </p>
            </div>

            <Link
              href="/tours"
              className="group inline-flex w-full shrink-0 items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-sm font-bold text-slate-950 transition-all duration-300 hover:bg-sky-50 hover:shadow-lg hover:shadow-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto"
            >
              Explore Tours
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

export default WhyChooseUsSection;
