import {
  ArrowDown,
  ArrowRight,
  Headphones,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const ContactHeroSection = () => {
  return (
    <section
      aria-labelledby="contact-hero-heading"
      className="relative isolate overflow-hidden bg-white px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-24 lg:pt-36"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-sky-200/40 blur-[100px] sm:h-96 sm:w-96" />
        <div className="absolute -right-32 top-0 h-80 w-80 rounded-full bg-violet-200/35 blur-[110px] sm:h-[28rem] sm:w-[28rem]" />
        <div className="absolute bottom-0 left-1/2 h-64 w-3/4 -translate-x-1/2 rounded-full bg-cyan-100/50 blur-[100px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(14,165,233,0.12)_1px,transparent_0)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          {/* Eyebrow badge */}
          <div className="mb-7 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-white/80 px-4 py-2 shadow-sm shadow-sky-100/70 backdrop-blur-xl">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
                <Sparkles size={13} />
              </span>

              <span className="text-xs font-bold tracking-wide text-slate-700 sm:text-sm">
                GET IN TOUCH
              </span>

              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              />
            </div>
          </div>

          {/* Main heading */}
          <h1
            id="contact-hero-heading"
            className="text-balance text-4xl font-black leading-[1.12] tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Let&apos;s Make Your
            <span className="mt-2 block bg-gradient-to-r from-sky-600 via-cyan-600 to-violet-600 bg-clip-text pb-2 text-transparent">
              Next Journey
            </span>
            Unforgettable.
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-8 text-slate-600 sm:mt-7 sm:text-lg">
            Have a question, need travel advice, or ready to plan your next
            adventure? We&apos;re here to help you make every journey memorable.
          </p>

          {/* CTA buttons */}
          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a
              href="#contact-form"
              className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-sky-600/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-600/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 sm:text-base"
            >
              <MessageCircle size={19} />
              Send Us a Message
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>

            <Link
              href="/tours"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-7 py-4 text-sm font-bold text-slate-700 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 sm:text-base"
            >
              Explore Our Tours
              <ArrowRight size={17} />
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4">
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/90 bg-white/65 px-4 py-4 shadow-sm shadow-slate-200/40 backdrop-blur-md">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <Mail size={19} />
              </span>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800">Easy Contact</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  We&apos;re here to listen
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/90 bg-white/65 px-4 py-4 shadow-sm shadow-slate-200/40 backdrop-blur-md">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                <Headphones size={19} />
              </span>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800">
                  Travel Support
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Help with your plans
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/90 bg-white/65 px-4 py-4 shadow-sm shadow-slate-200/40 backdrop-blur-md">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <ShieldCheck size={19} />
              </span>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800">
                  Personal Care
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Your journey matters
                </p>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <a
            href="#contact-details"
            className="mx-auto mt-10 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-slate-500 transition hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:mt-12"
          >
            Let&apos;s connect
            <ArrowDown size={15} className="animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactHeroSection;
