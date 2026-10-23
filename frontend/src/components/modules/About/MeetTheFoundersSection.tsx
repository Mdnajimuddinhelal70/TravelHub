import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Compass,
  Globe,
  Heart,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

const founders = [
  {
    name: "Najim Uddin",
    role: "Co-founder",
    specialty: "Full Stack Developer",
    image:
      "https://res.cloudinary.com/dpgjlcycl/image/upload/v1792766681/Professional_Formal_Portrait_cjqcil.png",
    imageAlt: "Najim Uddin, TravelHub co-founder and application developer",
    description:
      "Leads the development of the TravelHub application, transforming the company's vision into a polished and reliable digital travel experience.",
    focus: [
      "Application Development",
      "Product & Technology",
      "Full Stack Engineering",
    ],
    portfolio: "https://najim-uddin.vercel.app/",
    github: "https://github.com/Mdnajimuddinhelal70",
    accent: "sky",
  },
  {
    name: "Md Rubel Ahmed Rana",
    role: "Co-founder",
    specialty: "Software Engineer",
    image:
      "https://res.cloudinary.com/dpgjlcycl/image/upload/v1792768649/Professional_Suit_Portrait_wzp5bi.png",
    imageAlt: "Md Rubel Ahmed Rana, TravelHub co-founder",
    description:
      "Shares company leadership equally with his co-founder, working together to guide the team, coordinate activities, and oversee travel operations.",
    focus: [
      "Software Engineer",
      "Team Coordination",
      "Travel Operations Oversight",
    ],
    portfolio: "https://mdrubelahmedrana.com/",
    github: "https://github.com/Md-Rubel-Ahmed-Rana",
    accent: "violet",
  },
];

const MeetTheFoundersSection = () => {
  return (
    <section
      id="founders"
      aria-labelledby="founders-heading"
      className="relative isolate overflow-hidden bg-[#f8faff] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 top-24 h-[26rem] w-[26rem] rounded-full bg-sky-200/35 blur-[100px]" />
        <div className="absolute -right-40 top-40 h-[28rem] w-[28rem] rounded-full bg-violet-200/30 blur-[110px]" />
        <div className="absolute bottom-0 left-1/2 h-80 w-[38rem] -translate-x-1/2 rounded-full bg-cyan-100/35 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <header className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white bg-white/85 px-4 py-2.5 shadow-sm shadow-slate-900/[0.04] backdrop-blur-xl">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
              <Users size={14} />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-700 sm:text-sm sm:tracking-[0.2em]">
              Meet the Co-founders
            </span>
          </div>

          <h2
            id="founders-heading"
            className="text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
          >
            Two Founders.
            <span className="mt-2 block bg-gradient-to-r from-sky-600 via-cyan-600 to-violet-600 bg-clip-text pb-2 text-transparent">
              One Shared Vision.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Meet the people behind TravelHub, united by a shared ambition to
            make travel planning more accessible, enjoyable, and meaningful.
          </p>
        </header>

        {/* Shared leadership */}
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/90 bg-white/75 p-5 shadow-lg shadow-slate-900/[0.035] backdrop-blur-xl sm:mt-12 sm:p-6">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-violet-500 text-white shadow-lg shadow-sky-500/20">
              <Heart size={21} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-bold tracking-tight text-slate-900 sm:text-lg">
                Equal co-founders. Shared leadership.
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-600 sm:text-base">
                Different areas of responsibility, equal commitment to
                TravelHub&apos;s vision and direction.
              </p>
            </div>

            <div className="hidden shrink-0 items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 sm:inline-flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-emerald-700">
                Working together
              </span>
            </div>
          </div>
        </div>

        {/* Founder cards */}
        <div className="mt-10 grid items-stretch gap-7 md:mt-14 md:grid-cols-2 md:gap-8 lg:gap-10">
          {founders.map((founder, index) => {
            const isNajim = founder.accent === "sky";

            const accentText = isNajim ? "text-sky-700" : "text-violet-700";

            const accentBackground = isNajim ? "bg-sky-50" : "bg-violet-50";

            const accentBorder = isNajim
              ? "border-sky-100"
              : "border-violet-100";

            const buttonGradient = isNajim
              ? "from-sky-600 to-cyan-600 shadow-sky-600/15 hover:shadow-sky-600/25 focus-visible:ring-sky-500"
              : "from-violet-600 to-indigo-600 shadow-violet-600/15 hover:shadow-violet-600/25 focus-visible:ring-violet-500";

            return (
              <article
                key={founder.name}
                className="group relative flex min-w-0 flex-col overflow-hidden rounded-[2rem] border border-white/90 bg-white/90 shadow-xl shadow-slate-900/[0.045] backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/[0.09]"
              >
                {/* Portrait frame */}
                <div className="p-3 pb-0 sm:p-4 sm:pb-0">
                  <div
                    className={`relative isolate aspect-[4/3] overflow-hidden rounded-[1.5rem] sm:aspect-[5/4] ${
                      isNajim
                        ? "bg-gradient-to-br from-sky-50 via-white to-cyan-50"
                        : "bg-gradient-to-br from-violet-50 via-white to-indigo-50"
                    }`}
                  >
                    {/* Soft background atmosphere */}
                    <div
                      aria-hidden="true"
                      className={`absolute inset-0 ${
                        isNajim ? "bg-sky-100/20" : "bg-violet-100/20"
                      }`}
                    />

                    {/* Portrait image */}
                    <Image
                      src={founder.image}
                      alt={founder.imageAlt}
                      fill
                      sizes="(max-width: 767px) calc(100vw - 56px), (max-width: 1279px) 45vw, 560px"
                      className="object-cover object-[center_35%] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />

                    {/* Readable caption gradient */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent sm:h-36"
                    />

                    {/* Founder badge */}
                    <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-3 py-2 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-md sm:left-5 sm:top-5">
                      <Sparkles
                        size={14}
                        className={isNajim ? "text-sky-700" : "text-violet-700"}
                      />
                      {founder.role}
                    </div>

                    {/* Founder details */}
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                      <p
                        className={`mb-2 text-[10px] font-extrabold uppercase tracking-[0.2em] sm:text-xs ${
                          isNajim ? "text-cyan-200" : "text-violet-200"
                        }`}
                      >
                        Co-founder {index + 1}
                      </p>

                      <h3 className="text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl lg:text-3xl">
                        {founder.name}
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-white/90 sm:text-base">
                        {isNajim ? (
                          <Code2 size={17} className="shrink-0" />
                        ) : (
                          <BriefcaseBusiness size={17} className="shrink-0" />
                        )}
                        <span>{founder.specialty}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile details */}
                <div className="flex flex-1 flex-col p-5 pt-6 sm:p-7 sm:pt-7 lg:p-8">
                  <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                    {founder.description}
                  </p>

                  {/* Areas of focus */}
                  <div className="mt-7">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-5 w-1 rounded-full ${
                          isNajim ? "bg-sky-500" : "bg-violet-500"
                        }`}
                      />
                      <h4 className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-800">
                        Areas of focus
                      </h4>
                    </div>

                    <ul className="mt-4 flex flex-wrap gap-2">
                      {founder.focus.map((item) => (
                        <li
                          key={item}
                          className={`rounded-xl border px-3 py-2 text-xs font-semibold leading-5 sm:text-sm ${
                            accentBorder
                          } ${accentBackground} ${accentText}`}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Profile links */}
                  <div className="mt-auto mt-8 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6">
                    <Link
                      href={founder.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${founder.name}'s portfolio`}
                      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-4 py-3 text-sm font-bold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${buttonGradient}`}
                    >
                      <Globe size={16} />
                      Portfolio
                      <ArrowUpRight size={15} />
                    </Link>

                    <Link
                      href={founder.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${founder.name}'s GitHub profile`}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                    >
                      <FaGithub size={17} />
                      GitHub
                      <ArrowUpRight size={15} />
                    </Link>

                    <div
                      aria-hidden="true"
                      className={`ml-auto hidden h-10 w-10 items-center justify-center rounded-full border transition duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5 sm:flex ${
                        isNajim
                          ? "border-sky-100 text-sky-400 group-hover:text-sky-600"
                          : "border-violet-100 text-violet-400 group-hover:text-violet-600"
                      }`}
                    >
                      <ArrowDownRight size={19} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Closing statement */}
        <div className="relative mt-12 overflow-hidden rounded-[2rem] border border-white/90 bg-white/75 px-5 py-9 text-center shadow-lg shadow-slate-900/[0.035] backdrop-blur-xl sm:mt-16 sm:px-10 sm:py-12">
          <div
            aria-hidden="true"
            className="absolute inset-x-[15%] top-0 h-px bg-gradient-to-r from-transparent via-sky-300 to-violet-300"
          />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 via-cyan-50 to-violet-100 text-sky-700 ring-1 ring-white">
            <Compass size={25} />
          </div>

          <h3 className="mt-5 text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
            Moving forward, together.
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            Our shared commitment is to lead TravelHub with purpose, empower our
            team, and create more meaningful opportunities for travelers.
          </p>

          <Link
            href="/tours"
            className="group mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-sky-700 transition-colors hover:bg-sky-50 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            Explore TravelHub
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MeetTheFoundersSection;
