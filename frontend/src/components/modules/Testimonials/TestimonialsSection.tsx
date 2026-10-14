import { ArrowRight, BadgeCheck, Quote, Sparkles, Star } from "lucide-react";
import Link from "next/link";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Adventure Traveler",
    initials: "SM",
    location: "United Kingdom",
    rating: 5,
    accent: "from-sky-500 to-cyan-400",
    avatar: "bg-sky-100 text-sky-700",
    quote:
      "Planning a trip felt so much easier. The experience was straightforward, and discovering new places became something I genuinely looked forward to.",
    tag: "Easy Trip Planning",
  },
  {
    name: "Daniel Carter",
    role: "Frequent Explorer",
    initials: "DC",
    location: "Australia",
    rating: 5,
    accent: "from-violet-500 to-indigo-400",
    avatar: "bg-violet-100 text-violet-700",
    quote:
      "I love the idea of having travel inspiration and tour information together. It makes exploring possibilities feel exciting instead of overwhelming.",
    tag: "Great Experience",
  },
  {
    name: "Olivia Bennett",
    role: "Weekend Traveler",
    initials: "OB",
    location: "Canada",
    rating: 5,
    accent: "from-emerald-500 to-teal-400",
    avatar: "bg-emerald-100 text-emerald-700",
    quote:
      "A clean and welcoming experience makes a real difference when planning an adventure. I appreciate how simple and approachable everything feels.",
    tag: "Traveler Friendly",
  },
];

const TestimonialsSection = () => {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative isolate overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-24 -z-10 h-96 w-96 rounded-full bg-sky-100/60 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-10 -z-10 h-96 w-96 rounded-full bg-violet-100/50 blur-[110px]"
      />

      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16 lg:mb-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50/80 px-4 py-2 shadow-sm shadow-violet-100/50">
            <Sparkles className="h-4 w-4 text-violet-600" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700 sm:text-sm">
              Stories from Travelers
            </span>
          </div>

          <h2
            id="testimonials-heading"
            className="text-balance text-4xl font-bold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
          >
            Every journey has
            <br />
            <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent">
              a story to tell.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            The best travel experiences stay with us long after we return.
            Discover what makes a thoughtful travel experience matter.
          </p>
        </div>

        {/* Featured testimonial */}
        <div className="relative mb-7 overflow-hidden rounded-[30px] bg-slate-950 p-7 shadow-2xl shadow-slate-900/10 sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-28 h-80 w-80 rounded-full bg-sky-500/20 blur-[90px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/20 blur-[90px]"
          />

          <div className="relative grid items-center gap-9 lg:grid-cols-[1fr_auto] lg:gap-14">
            <div>
              <div className="mb-7 flex items-center gap-1.5 text-amber-400">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className="h-5 w-5 fill-current"
                    strokeWidth={1.5}
                  />
                ))}
                <span className="ml-2 text-sm font-semibold text-slate-300">
                  A thoughtful way to travel
                </span>
              </div>

              <Quote
                aria-hidden="true"
                className="mb-4 h-10 w-10 text-sky-300/70"
                strokeWidth={1.5}
              />

              <blockquote className="max-w-3xl text-2xl font-semibold leading-relaxed tracking-tight text-white sm:text-3xl lg:text-4xl">
                “The joy of travel begins before the journey itself — with
                inspiration, exciting possibilities, and the feeling that
                something wonderful is waiting.”
              </blockquote>

              <p className="mt-5 text-sm leading-7 text-slate-300">
                A reminder of what a great travel-planning experience should
                feel like.
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm lg:min-w-[235px] lg:flex-col lg:items-start lg:p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-violet-500 text-white shadow-lg shadow-sky-500/20">
                <Sparkles className="h-7 w-7" />
              </div>

              <div>
                <p className="font-semibold text-white">Make room for wonder</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  Your next chapter could begin anywhere.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="group relative overflow-hidden rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60 sm:p-7"
            >
              {/* Card accent */}
              <div
                aria-hidden="true"
                className={`absolute left-0 top-0 h-1 w-0 bg-gradient-to-r ${testimonial.accent} transition-all duration-500 group-hover:w-full`}
              />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: testimonial.rating }, (_, index) => (
                    <Star
                      key={index}
                      className="h-4 w-4 fill-current"
                      strokeWidth={1.5}
                    />
                  ))}
                </div>

                <Quote
                  aria-hidden="true"
                  className="h-7 w-7 text-slate-200 transition-colors duration-300 group-hover:text-sky-300"
                />
              </div>

              <blockquote className="mt-6 min-h-[145px] text-[15px] leading-7 text-slate-600">
                “{testimonial.quote}”
              </blockquote>

              <div className="my-6 h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent" />

              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${testimonial.avatar}`}
                >
                  {testimonial.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="font-bold text-slate-950">
                      {testimonial.name}
                    </h3>
                    <BadgeCheck
                      aria-hidden="true"
                      className="h-4 w-4 text-sky-600"
                    />
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                  {testimonial.tag}
                </span>

                <span className="text-xs font-medium text-slate-400">
                  {testimonial.location}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-[26px] border border-slate-200/70 bg-gradient-to-r from-sky-50 via-white to-violet-50/80 p-6 text-center sm:mt-12 sm:flex-row sm:p-8 sm:text-left">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              Your travel story starts with one step.
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
              Discover your next destination and begin planning your journey.
            </p>
          </div>

          <Link
            href="/register"
            className="group inline-flex w-full shrink-0 items-center justify-center gap-3 rounded-xl bg-slate-950 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:bg-sky-700 sm:w-auto"
          >
            Join TravelHub
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
