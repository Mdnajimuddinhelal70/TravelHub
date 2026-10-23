import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Backpack,
  Compass,
  Mountain,
  Palmtree,
  Search,
  Sparkles,
  TentTree,
  Waves,
} from "lucide-react";
import Link from "next/link";

const travelCategories = [
  {
    title: "Beach Escapes",
    description: "Coastal views & ocean adventures",
    count: "Coastal adventures",
    icon: Waves,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Beautiful tropical beach with turquoise water",
    href: "#all-tours",
    theme: "from-cyan-500/90 via-sky-600/35 to-transparent",
    iconTheme: "bg-cyan-50 text-cyan-700",
  },
  {
    title: "Mountain Trails",
    description: "Fresh air & breathtaking heights",
    count: "Nature & exploration",
    icon: Mountain,
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Majestic mountain peaks surrounded by clouds",
    href: "#all-tours",
    theme: "from-indigo-950/90 via-indigo-800/35 to-transparent",
    iconTheme: "bg-indigo-50 text-indigo-700",
  },
  {
    title: "Nature Retreats",
    description: "Escape into peaceful landscapes",
    count: "Slow travel",
    icon: TentTree,
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Sunlight filtering through a peaceful green forest",
    href: "#all-tours",
    theme: "from-emerald-950/90 via-emerald-800/30 to-transparent",
    iconTheme: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Adventure Trips",
    description: "Make every moment count",
    count: "For thrill seekers",
    icon: Backpack,
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Travelers exploring a scenic mountain hiking trail",
    href: "#all-tours",
    theme: "from-violet-950/90 via-violet-800/35 to-transparent",
    iconTheme: "bg-violet-50 text-violet-700",
  },
];

const TourDiscoverySection = () => {
  return (
    <section
      aria-labelledby="tour-discovery-heading"
      className="relative isolate overflow-hidden bg-gradient-to-b from-slate-50 via-white to-sky-50/40 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-20 -z-10 h-[420px] w-[420px] rounded-full bg-sky-200/30 blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 bottom-0 -z-10 h-[460px] w-[460px] rounded-full bg-violet-200/30 blur-[120px]"
      />

      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/85 px-4 py-2 shadow-sm shadow-sky-100/60 backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-sky-600" />

            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-sky-800 sm:text-xs">
              Your Next Adventure
            </span>
          </div>

          <h2
            id="tour-discovery-heading"
            className="text-balance text-3xl font-bold leading-tight tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-5xl"
          >
            Where Would You Like
            <span className="mt-1 block bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-600 bg-clip-text pb-1 text-transparent">
              to Go Next?
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            From sun-soaked beaches to breathtaking mountain trails, discover
            experiences that match your travel style and turn your next trip
            into something extraordinary.
          </p>
        </div>

        {/* Discovery search panel */}
        <div className="relative mx-auto mt-10 max-w-5xl sm:mt-12">
          <div
            aria-hidden="true"
            className="absolute -inset-1 rounded-[30px] bg-gradient-to-r from-sky-200/70 via-cyan-100/70 to-violet-200/70 opacity-80 blur-lg"
          />

          <form
            action="#all-tours"
            method="get"
            className="relative grid gap-3 rounded-[26px] border border-white bg-white/95 p-4 shadow-xl shadow-slate-900/[0.06] backdrop-blur-2xl sm:grid-cols-2 sm:gap-4 sm:p-5 lg:grid-cols-[1.35fr_1fr_1fr_auto] lg:items-end lg:gap-3"
          >
            {/* Destination */}
            <div className="min-w-0">
              <label
                htmlFor="tour-destination"
                className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700"
              >
                <Compass className="h-4 w-4 text-sky-600" />
                Where to?
              </label>

              <input
                id="tour-destination"
                name="destination"
                type="search"
                placeholder="Search a destination..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-sky-200 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {/* Travel style */}
            <div className="min-w-0">
              <label
                htmlFor="tour-category"
                className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700"
              >
                <Palmtree className="h-4 w-4 text-sky-600" />
                Travel style
              </label>

              <select
                id="tour-category"
                name="category"
                defaultValue=""
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-700 outline-none transition-all hover:border-sky-200 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              >
                <option value="">All experiences</option>
                <option value="beach">Beach escapes</option>
                <option value="mountain">Mountain trails</option>
                <option value="nature">Nature retreats</option>
                <option value="adventure">Adventure trips</option>
              </select>
            </div>

            {/* Budget */}
            <div className="min-w-0">
              <label
                htmlFor="tour-budget"
                className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700"
              >
                <Sparkles className="h-4 w-4 text-violet-600" />
                Your budget
              </label>

              <select
                id="tour-budget"
                name="budget"
                defaultValue=""
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-700 outline-none transition-all hover:border-sky-200 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              >
                <option value="">Any budget</option>
                <option value="budget">Budget-friendly</option>
                <option value="mid-range">Mid-range</option>
                <option value="premium">Premium experiences</option>
              </select>
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600 px-6 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 lg:min-w-[125px]"
            >
              <Search className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              Find Tours
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-semibold text-slate-600">
              Looking for inspiration?
            </span>
            <span>Start with a travel style below.</span>
          </div>
        </div>

        {/* Category heading */}
        <div className="mb-7 mt-16 flex flex-col gap-4 sm:mb-9 sm:mt-20 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-sky-700">
              Find Your Travel Style
            </p>

            <h3 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Explore by experience
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              One world, countless ways to explore. Find the journey that feels
              right for you.
            </p>
          </div>

          <Link
            href="#all-tours"
            className="group inline-flex w-fit shrink-0 items-center gap-2 text-sm font-bold text-sky-700 transition-colors hover:text-violet-700"
          >
            View all experiences
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Travel category cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {travelCategories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.title}
                href={category.href}
                aria-label={`Explore ${category.title}`}
                className="group relative isolate block min-h-[310px] overflow-hidden rounded-[26px] border border-white bg-slate-200 shadow-lg shadow-slate-900/[0.06] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-900/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-4 sm:min-h-[340px] lg:min-h-[370px]"
              >
                {/* Destination image */}
                <div
                  role="img"
                  aria-label={category.imageAlt}
                  className="absolute inset-0 -z-20 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{
                    backgroundImage: `url("${category.image}")`,
                  }}
                />

                {/* Image overlays */}
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 -z-10 bg-gradient-to-t ${category.theme}`}
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/20 via-transparent to-transparent opacity-80"
                />

                {/* Top label */}
                <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-slate-950/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-xl">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    {category.count}
                  </span>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-xl transition-all duration-300 group-hover:rotate-45 group-hover:bg-white group-hover:text-sky-700">
                    <ArrowDownRight className="h-5 w-5" />
                  </span>
                </div>

                {/* Bottom content */}
                <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
                  <span
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${category.iconTheme} shadow-lg shadow-slate-950/10 transition-transform duration-300 group-hover:-translate-y-1`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <h4 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    {category.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-white/80">
                    {category.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white/95">
                    Discover experiences
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>

                  <div className="mt-4 h-0.5 w-10 rounded-full bg-gradient-to-r from-cyan-300 to-violet-300 transition-all duration-500 group-hover:w-20" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom inspiration strip */}
        <div className="relative mt-8 overflow-hidden rounded-2xl border border-sky-100/80 bg-white/75 px-5 py-5 shadow-sm shadow-sky-900/[0.03] backdrop-blur-xl sm:px-7 sm:py-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-20 h-44 w-44 rounded-full bg-violet-100/60 blur-3xl"
          />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-violet-100 text-sky-700">
                <Compass className="h-5 w-5" />
              </span>

              <div>
                <p className="font-bold text-slate-900">
                  Your kind of journey is waiting.
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Explore the collection and find a trip worth remembering.
                </p>
              </div>
            </div>

            <Link
              href="#all-tours"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-sky-700 transition-colors hover:text-violet-700"
            >
              Discover all tours
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourDiscoverySection;
