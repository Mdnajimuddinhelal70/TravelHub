import {
  ArrowDownRight,
  ArrowRight,
  CalendarCheck,
  Compass,
  MapPin,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    label: "STEP ONE",
    title: "Discover your destination",
    description:
      "Explore inspiring destinations, browse available tours, and find the experience that matches your travel dreams.",
    icon: Compass,
    iconColor: "text-sky-700",
    iconBackground: "bg-sky-100",
    borderHover: "group-hover:border-sky-200",
    glow: "bg-sky-200/60",
    accent: "from-sky-500 to-cyan-400",
  },
  {
    number: "02",
    label: "STEP TWO",
    title: "Plan your perfect trip",
    description:
      "Review tour details, choose an experience that suits you, and organize the next steps of your adventure.",
    icon: CalendarCheck,
    iconColor: "text-violet-700",
    iconBackground: "bg-violet-100",
    borderHover: "group-hover:border-violet-200",
    glow: "bg-violet-200/60",
    accent: "from-violet-500 to-indigo-400",
  },
  {
    number: "03",
    label: "STEP THREE",
    title: "Make memories for life",
    description:
      "Get ready to explore new places, enjoy meaningful experiences, and make your next journey unforgettable.",
    icon: MapPin,
    iconColor: "text-emerald-700",
    iconBackground: "bg-emerald-100",
    borderHover: "group-hover:border-emerald-200",
    glow: "bg-emerald-200/60",
    accent: "from-emerald-500 to-teal-400",
  },
];

const HowItWorksSection = () => {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="relative isolate overflow-hidden bg-slate-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32"
    >
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-36 top-20 -z-10 h-80 w-80 rounded-full bg-sky-100/70 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 bottom-0 -z-10 h-96 w-96 rounded-full bg-violet-100/60 blur-[110px]"
      />

      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-4 py-2 shadow-sm shadow-sky-100/60">
            <Sparkles className="h-4 w-4 text-sky-600" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700 sm:text-sm">
              Your Journey, Simplified
            </span>
          </div>

          <h2
            id="how-it-works-heading"
            className="text-balance text-4xl font-bold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
          >
            From dream to
            <br />
            <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent">
              destination.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Your next great adventure doesn&apos;t have to be complicated.
            Follow three simple steps and start exploring the world with
            TravelHub.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-7">
          {/* Connecting line for desktop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[18%] right-[18%] top-[43px] hidden h-px bg-gradient-to-r from-sky-300 via-violet-300 to-emerald-300 md:block"
          />

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className={`group relative rounded-[28px] border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/70 sm:p-8 lg:p-9 ${step.borderHover}`}
              >
                {/* Soft glow */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute right-0 top-0 h-36 w-36 rounded-full ${step.glow} opacity-0 blur-[65px] transition-opacity duration-500 group-hover:opacity-100`}
                />

                <div className="relative flex items-center justify-between">
                  <div
                    className={`relative z-10 flex h-[86px] w-[86px] items-center justify-center rounded-[26px] ${step.iconBackground} transition-transform duration-500 group-hover:rotate-[-5deg] group-hover:scale-105`}
                  >
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.accent} text-white shadow-lg`}
                    >
                      <Icon className="h-7 w-7" strokeWidth={1.8} />
                    </div>
                  </div>

                  <span className="font-mono text-4xl font-bold tracking-tight text-slate-100 transition-colors duration-300 group-hover:text-slate-200 sm:text-5xl">
                    {step.number}
                  </span>
                </div>

                <div className="relative mt-9">
                  <p className="mb-3 text-[10px] font-extrabold tracking-[0.2em] text-slate-400 sm:text-xs">
                    {step.label}
                  </p>

                  <h3 className="text-2xl font-bold leading-tight tracking-tight text-slate-950">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                    {step.description}
                  </p>
                </div>

                {/* Bottom accent */}
                <div
                  aria-hidden="true"
                  className={`absolute bottom-0 left-7 right-7 h-1 origin-left scale-x-0 rounded-full bg-gradient-to-r ${step.accent} transition-transform duration-500 group-hover:scale-x-100 sm:left-8 sm:right-8 lg:left-9 lg:right-9`}
                />
              </article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="relative mt-10 overflow-hidden rounded-[28px] bg-slate-950 px-6 py-8 shadow-xl shadow-slate-900/10 sm:px-9 sm:py-10 lg:mt-12 lg:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-sky-500/20 blur-[85px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-violet-500/20 blur-[85px]"
          />

          <div className="relative flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
            <div className="max-w-xl">
              <div className="mb-3 flex items-center gap-2 text-sky-300">
                <Compass className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-[0.18em]">
                  Adventure is calling
                </span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Your next adventure starts here.
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                Take the first step toward discovering somewhere extraordinary.
              </p>
            </div>

            <Link
              href="/tours"
              className="group inline-flex w-full shrink-0 items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-sm font-bold text-slate-950 transition-all duration-300 hover:bg-sky-50 hover:shadow-lg hover:shadow-white/10 sm:w-auto"
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

export default HowItWorksSection;
